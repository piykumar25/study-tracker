package com.piyush.studylogservice.service;

import com.piyush.studylogservice.dto.StudyLogCreateReq;
import com.piyush.studylogservice.dto.StudyLogResp;
import com.piyush.studylogservice.model.StudyLog;
import com.piyush.studylogservice.repository.StudyLogRepository;
import com.piyush.studylogservice.sse.RealtimeBroadcaster;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

//@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class StudyLogServiceTests {

    @InjectMocks
    private  StudyLogServiceImpl service;

    @Mock
    StudyLogRepository repo;

    @Mock
    RealtimeBroadcaster broadcaster;

//    @BeforeEach
//    public void setup() {
//        MockitoAnnotations.openMocks(this);
//    }

    @Test
//    @Disabled
    public void createTest() {
        StudyLogCreateReq request = new StudyLogCreateReq
                ("Math",
                        60,
                        "2025-08-14",
                        "Studied calculus");


        when(repo.save(any(StudyLog.class))).thenReturn(
                StudyLog.builder()
                        .subject(request.subject())
                        .durationMins(request.durationMins())
                        .date(request.date())
                        .notes(request.notes()).build());

        doNothing().when(broadcaster).created(any(Object.class));

        StudyLogResp saved = service.create(request, 1L);
        assertNotNull(saved);
        assertNotNull(saved.subject(), "Subject should not be null");
    }

    @ParameterizedTest
    @CsvSource(value = {
            "1, 2, 3",
            "2, 3, 5",
            "3, 4, 8"
    })
    @Disabled
    public void test(int a, int b, int expected) {
        assertEquals(expected, a + b);
    }
}
