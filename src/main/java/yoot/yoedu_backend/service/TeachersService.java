package yoot.yoedu_backend.service;

import yoot.yoedu_backend.domain.entity.Teacher;
import yoot.yoedu_backend.dto.teacher.TeacherResponse;
import yoot.yoedu_backend.dto.teacher.TeacherUpsertRequest;

import java.util.List;
import java.util.Optional;

public interface TeachersService {
    List<TeacherResponse> findAll();

    Optional<TeacherResponse> findById(Long id);

    TeacherResponse create(TeacherUpsertRequest req);

    TeacherResponse update(Long id, TeacherUpsertRequest req);

    void deleteById(Long id) throws Exception;

    Teacher getTeacher(Long id);
}
