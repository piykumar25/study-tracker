package com.piyush.studylogservice.dto;
import java.util.List;

public record PagedResp<T>(List<T> items, long total) {}