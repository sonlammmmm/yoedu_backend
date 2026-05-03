package yoot.day1.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import yoot.day1.domain.entity.Course;
import yoot.day1.domain.entity.Student;
import yoot.day1.repository.CourseRepository;
import yoot.day1.service.CourseService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;

    public List<Course> findAll() { return courseRepository.findAll(); }

    public Optional<Course> findById(Long id) { return courseRepository.findById(id); }

    public Course save(Course course) { return courseRepository.save(course); }

    public void deleteById(Long id) {
        courseRepository.deleteById(id);
    }
}
