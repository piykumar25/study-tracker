package com.piyush.studylogservice.service;

import com.piyush.studylogservice.dto.PagedResp;
import com.piyush.studylogservice.dto.StudyLogCreateReq;
import com.piyush.studylogservice.dto.StudyLogResp;
import com.piyush.studylogservice.dto.StudyLogUpdateReq;
import com.piyush.studylogservice.model.StudyLog;
import com.piyush.studylogservice.repository.StudyLogRepository;
import com.piyush.studylogservice.sse.RealtimeBroadcaster;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudyLogServiceImpl implements StudyLogService {

    private final StudyLogRepository repo;
    private final RealtimeBroadcaster broadcaster;

    @Override
    @Cacheable(
            value = "studyLogsByUser",
            key = "T(java.util.Objects).hash(#userId, #q, #subject, #from, #to, #minMins, #sort, #page, #size)"
    )
    public PagedResp<StudyLogResp> list(
            String q,
            String subject,
            String from,
            String to,
            Integer minMins,
            String sort,
            int page,
            int size,
            Long userId
    ) {

        Specification<StudyLog> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            // Always scope by user
            predicates.add(cb.equal(root.get("userId"), userId));

            if (q != null && !q.isBlank()) {
                String like = "%" + q.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("subject")), like),
                        cb.like(cb.lower(root.get("notes")), like)
                ));
            }
            if (subject != null && !subject.isBlank()) {
                predicates.add(cb.equal(root.get("subject"), subject));
            }
            LocalDate fromDate = parseLocalDate(from);
            if (fromDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), fromDate));
            }
            LocalDate toDate = parseLocalDate(to);
            if (toDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("date"), toDate));
            }
            if (minMins != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("durationMins"), minMins));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sortBy = switch (Objects.requireNonNullElse(sort, "dateDesc")) {
            case "dateAsc" -> Sort.by("date").ascending();
            case "durationDesc" -> Sort.by("durationMins").descending();
            case "durationAsc" -> Sort.by("durationMins").ascending();
            default -> Sort.by("date").descending();
        };

        int safePage = Math.max(0, page - 1);
        int safeSize = Math.min(Math.max(1, size), 100);
        PageRequest pr = PageRequest.of(safePage, safeSize, sortBy);

        Page<StudyLog> pageRes = repo.findAll(spec, pr);
        List<StudyLogResp> items = pageRes.getContent().stream().map(this::toResp).toList();
        return new PagedResp<>(items, pageRes.getTotalElements());
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "studyLogsByUser", allEntries = true)
    })
    public StudyLogResp create(StudyLogCreateReq req, Long userId) {
        StudyLog entity = StudyLog.builder()
                .subject(req.subject())
                .durationMins(req.durationMins())
                .date(req.date()) // Prefer LocalDate in DTO/model
                .notes(req.notes())
                .userId(userId)
                .build();

        StudyLog saved = repo.save(entity);
        StudyLogResp dto = toResp(saved);

        // Ensure SSE goes out only after commit
        runAfterCommit(() -> broadcaster.created(dto));
        return dto;
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "studyLogsByUser", allEntries = true)
    })
    public StudyLogResp update(String id, StudyLogUpdateReq req, Long userId) {
        StudyLog e = repo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new AccessDeniedException("Not found"));

        if (req.subject() != null) e.setSubject(req.subject());
        if (req.durationMins() != null) e.setDurationMins(req.durationMins());
        if (req.date() != null && !req.date().toString().isBlank()) e.setDate(req.date());
        if (req.notes() != null) e.setNotes(req.notes());

        StudyLog saved = repo.save(e);
        StudyLogResp dto = toResp(saved);
        runAfterCommit(() -> broadcaster.updated(dto));
        return dto;
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "studyLogsByUser", allEntries = true)
    })
    public void delete(String id, Long userId) {
        var existing = repo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new AccessDeniedException("Not found"));

        repo.delete(existing);
        runAfterCommit(() -> broadcaster.deleted(new IdOnly(id)));
    }

    // ---------- helpers ----------

    private LocalDate parseLocalDate(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return LocalDate.parse(s); // expects ISO-8601 (YYYY-MM-DD)
        } catch (Exception ignore) {
            return null;
        }
    }

    private StudyLogResp toResp(StudyLog s) {
        return new StudyLogResp(
                s.getId(),
                s.getSubject(),
                s.getDurationMins(),
                s.getDate(),
                s.getNotes()
        );
    }

    private void runAfterCommit(Runnable r) {
        if (TransactionSynchronizationManager.isActualTransactionActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override public void afterCommit() { r.run(); }
            });
        } else {
            // Fallback: no active tx; run immediately
            r.run();
        }
    }

    // simple record used for delete event payload
    public record IdOnly(String id) {}
}