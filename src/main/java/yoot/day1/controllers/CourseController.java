package yoot.day1.controllers;

import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yoot.day1.common.ApiResponse;
import yoot.day1.domain.entity.Course;
import yoot.day1.domain.entity.Teachers;
import yoot.day1.repository.CourseRepository;
import yoot.day1.service.CourseService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Course>>> getCourses() {
        return ResponseEntity.ok(ApiResponse.success("Success", courseService.findAll()));
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<Course>> getCourseById(@PathVariable("id") Long id) {
        Optional<Course> course = courseService.findById(id);

        if (course.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("Success", course.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Course>> create(@RequestBody Course course) {
        return ResponseEntity.ok(ApiResponse.success("Success", courseService.save(course)));
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<Course>> update(@PathVariable("id") Long id, @RequestBody Course course) {
        Optional<Course> existing = courseService.findById(id);

        if (existing.isPresent()) {
            course.setId(id);
            return ResponseEntity.ok(ApiResponse.success("Success", courseService.save(course)));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Course>> delete(@PathVariable Long id) {
        courseService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
