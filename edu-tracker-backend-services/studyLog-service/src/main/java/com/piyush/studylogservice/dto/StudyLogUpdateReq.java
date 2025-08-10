package com.piyush.studylogservice.dto;

import jakarta.validation.constraints.*;

public record StudyLogUpdateReq(
        String subject,
        Integer durationMins,
        @Pattern(regexp = "^(|\\d{4}-\\d{2}-\\d{2})$") String date,
        @Size(max = 500) String notes
) {}