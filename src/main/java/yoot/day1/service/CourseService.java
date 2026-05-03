package yoot.day1.service;

import yoot.day1.domain.entity.Course;
import yoot.day1.repository.CourseRepository;

import java.util.List;
import java.util.Optional;

public interface CourseService {

    List<Course> findAll();

    Optional<Course> findById(Long id);

    Course save(Course course);

    void deleteById(Long id);
}
