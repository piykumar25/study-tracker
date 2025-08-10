package com.piyush.studylogservice.dto;

import jakarta.validation.constraints.*;

public record StudyLogCreateReq(
        @NotBlank
        String subject,
        @NotNull @Min(1)
        Integer durationMins,
        @NotBlank @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}")
        String date,
        @Size(max = 500) String
        notes
) {}