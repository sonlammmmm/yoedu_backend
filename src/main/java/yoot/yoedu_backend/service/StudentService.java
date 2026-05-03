package yoot.yoedu_backend.service;

import yoot.yoedu_backend.domain.entity.Student;
import yoot.yoedu_backend.dto.student.StudentResponse;
import yoot.yoedu_backend.dto.student.StudentUpsertRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface StudentService {
    List<StudentResponse> findAll();

    Optional<StudentResponse> findById(Long id);

//    Student save(Student student);

    StudentResponse create(StudentUpsertRequest req);

    StudentResponse update(Long id, StudentUpsertRequest req);

    void deleteById(Long id) throws Exception;
}
