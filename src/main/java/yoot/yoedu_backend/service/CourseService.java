package yoot.yoedu_backend.service;

import yoot.yoedu_backend.domain.entity.Course;

import java.util.List;
import java.util.Optional;

public interface CourseService {

    List<Course> findAll();

    Optional<Course> findById(Long id);

    List<Course> findByCourseActive();

    Course save(Course course);

    void deleteById(Long id);
}
