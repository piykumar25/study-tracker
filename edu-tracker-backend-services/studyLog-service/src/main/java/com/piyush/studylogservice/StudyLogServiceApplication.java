package com.piyush.studylogservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StudyLogServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudyLogServiceApplication.class, args);
    }

}
