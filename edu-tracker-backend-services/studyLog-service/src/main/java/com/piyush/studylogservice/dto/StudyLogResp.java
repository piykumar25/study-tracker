package com.piyush.studylogservice.dto;


public record StudyLogResp(
        String id,
        String subject,
        Integer durationMins,
        String date,
        String notes
) {}