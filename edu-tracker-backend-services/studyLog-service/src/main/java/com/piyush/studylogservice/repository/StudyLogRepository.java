package com.piyush.studylogservice.repository;

import com.piyush.studylogservice.model.StudyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


@Repository
public interface StudyLogRepository extends JpaRepository<StudyLog, String>, JpaSpecificationExecutor<StudyLog>{

}
