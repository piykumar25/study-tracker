package com.piyush.studylogservice.service;

import com.piyush.studylogservice.dto.PagedResp;
import com.piyush.studylogservice.dto.StudyLogCreateReq;
import com.piyush.studylogservice.dto.StudyLogResp;
import com.piyush.studylogservice.dto.StudyLogUpdateReq;
import jakarta.validation.Valid;

public interface StudyLogService {
    PagedResp<StudyLogResp> list(String q, String subject, String from, String to, Integer minMins, String sort, int page, int size, Long userId);

    StudyLogResp update(String id, StudyLogUpdateReq req, Long userId);

    void delete(String id, Long userId);

    StudyLogResp create(@Valid StudyLogCreateReq req, Long userId);
}
