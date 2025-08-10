package com.piyush.studylogservice.controller;

import com.piyush.studylogservice.dto.PagedResp;
import com.piyush.studylogservice.dto.StudyLogCreateReq;
import com.piyush.studylogservice.dto.StudyLogResp;
import com.piyush.studylogservice.dto.StudyLogUpdateReq;
import com.piyush.studylogservice.service.StudyLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/study-logs")
@RequiredArgsConstructor
public class StudyLogController {

    private final StudyLogService service;

    @GetMapping
    public PagedResp<StudyLogResp> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) Integer minMins,
            @RequestParam(defaultValue = "dateDesc") String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        Long userId = ((Jwt) authentication.getPrincipal()).getClaim("userId");
        return service.list(q, subject, from, to, minMins, sort, page, size, userId);
    }

    @PostMapping
    public ResponseEntity<StudyLogResp> create(@Valid @RequestBody StudyLogCreateReq req, Authentication authentication) {
        //authentication.principal.claims['userId']
        Long userId = ((Jwt) authentication.getPrincipal()).getClaim("userId");
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req, userId));
    }

    @PatchMapping("/{id}")
    public StudyLogResp update(@PathVariable String id, @RequestBody StudyLogUpdateReq req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
