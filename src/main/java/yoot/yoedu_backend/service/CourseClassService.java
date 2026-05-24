package yoot.yoedu_backend.service;

import yoot.yoedu_backend.domain.entity.CourseClass;
import yoot.yoedu_backend.dto.courseclass.CourseClassResponse;
import yoot.yoedu_backend.dto.courseclass.CourseClassUpsertRequest;

import java.util.List;
import java.util.Optional;

public interface CourseClassService {
    List<CourseClassResponse> findAll();

    Optional<CourseClassResponse> findById(Long id);

    CourseClassResponse create(CourseClassUpsertRequest req);

    CourseClassResponse update(Long id, CourseClassUpsertRequest req);

    CourseClass getCourseClass(Long courseClassId);
}
