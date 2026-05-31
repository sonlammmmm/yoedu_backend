package yoot.yoedu_backend.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yoot.yoedu_backend.common.ApiResponse;
import yoot.yoedu_backend.domain.entity.Student;
import yoot.yoedu_backend.dto.student.StudentResponse;
import yoot.yoedu_backend.dto.student.StudentUpsertRequest;
import yoot.yoedu_backend.service.StudentService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/students")
@RequiredArgsConstructor
@Tag(name = "Student", description = "Student management endpoints")
@SecurityRequirement(name = "jwt")
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<StudentResponse>> findAll() {
        return ResponseEntity.ok(studentService.findAll());

    }

    @GetMapping("{id}")
    public ResponseEntity<StudentResponse> findById(@PathVariable Long id) {
        return studentService.findById(id)
                .map(stu -> ResponseEntity.ok(stu))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StudentResponse> create(@Valid @RequestBody StudentUpsertRequest req) {
        return ResponseEntity.ok(studentService.create(req));
    }

    @PutMapping("{id}")
    public ResponseEntity<StudentResponse> update(@PathVariable Long id, StudentUpsertRequest req) {
        return ResponseEntity.ok(studentService.update(id, req));
    }

    @DeleteMapping("{id}")
    ResponseEntity<?> delete(@PathVariable Long id) throws Exception {
        studentService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}   
