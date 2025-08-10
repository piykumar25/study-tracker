package com.piyush.studylogservice.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Entity
@Table(name = "study_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    @NotBlank
    private String subject;

    @Column(name = "duration_mins", nullable = false)
    @Min(1)
    private Integer durationMins;

    // YYYY-MM-DD for simplicity (store as DATE if you prefer)
    @Column(nullable = false, length = 10)
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}")
    private String date;

    @Column(length = 500)
    private String notes;
}