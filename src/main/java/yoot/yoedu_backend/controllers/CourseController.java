package yoot.yoedu_backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yoot.yoedu_backend.common.ApiResponse;
import yoot.yoedu_backend.domain.entity.Course;
import yoot.yoedu_backend.service.CourseService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/courses")
@RequiredArgsConstructor
@Tag(name = "Course", description = "Course management endpoints")
@SecurityRequirement(name = "jwt")
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
