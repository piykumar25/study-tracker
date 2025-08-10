package com.piyush.studylogservice.service;

import com.piyush.studylogservice.dto.PagedResp;
import com.piyush.studylogservice.dto.StudyLogCreateReq;
import com.piyush.studylogservice.dto.StudyLogResp;
import com.piyush.studylogservice.dto.StudyLogUpdateReq;
import com.piyush.studylogservice.model.StudyLog;
import com.piyush.studylogservice.repository.StudyLogRepository;
import com.piyush.studylogservice.sse.RealtimeBroadcaster;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudyLogServiceImpl implements StudyLogService {
    private final StudyLogRepository repo;
    private final RealtimeBroadcaster broadcaster;

    @Override
    public PagedResp<StudyLogResp> list(String q, String subject, String from, String to,
                                        Integer minMins, String sort, int page, int size) {
        Specification<StudyLog> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
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
            if (from != null && !from.isBlank()) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), from));
            }
            if (to != null && !to.isBlank()) {
                predicates.add(cb.lessThanOrEqualTo(root.get("date"), to));
            }
            if (minMins != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("durationMins"), minMins));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sortBy = switch (sort == null ? "dateDesc" : sort) {
            case "dateAsc" -> Sort.by("date").ascending();
            case "durationDesc" -> Sort.by("durationMins").descending();
            case "durationAsc" -> Sort.by("durationMins").ascending();
            default -> Sort.by("date").descending();
        };

        PageRequest pr = PageRequest.of(Math.max(0, page - 1), Math.max(1, size), sortBy);
        Page<StudyLog> pageRes = repo.findAll(spec, pr);
        List<StudyLogResp> items = pageRes.getContent().stream().map(this::toResp).toList();
        return new PagedResp<>(items, pageRes.getTotalElements());
    }

    @Transactional
    @Override
    public StudyLogResp create(@Valid StudyLogCreateReq req) {
        StudyLog entity = StudyLog.builder()
                .subject(req.subject())
                .durationMins(req.durationMins())
                .date(req.date())
                .notes(req.notes())
                .build();
        StudyLog saved = repo.save(entity);
        StudyLogResp dto = toResp(saved);
        broadcaster.created(dto);
        return dto;
    }

    @Transactional
    @Override
    public StudyLogResp update(String id, StudyLogUpdateReq req) {
        StudyLog e = repo.findById(id).orElseThrow();
        if (req.subject() != null) e.setSubject(req.subject());
        if (req.durationMins() != null) e.setDurationMins(req.durationMins());
        if (req.date() != null && !req.date().isBlank()) e.setDate(req.date());
        if (req.notes() != null) e.setNotes(req.notes());
        StudyLog saved = repo.save(e);
        StudyLogResp dto = toResp(saved);
        broadcaster.updated(dto);
        return dto;
    }

    @Transactional
    @Override
    public void delete(String id) {
        repo.deleteById(id);
        broadcaster.deleted(new IdOnly(id));
    }

    private StudyLogResp toResp(StudyLog s) {
        return new StudyLogResp(s.getId(), s.getSubject(), s.getDurationMins(), s.getDate(), s.getNotes());
    }

    // simple record used for delete event payload
    public record IdOnly(String id) {}
}