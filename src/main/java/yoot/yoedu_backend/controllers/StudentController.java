package yoot.yoedu_backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yoot.yoedu_backend.common.ApiResponse;
import yoot.yoedu_backend.domain.entity.Student;
import yoot.yoedu_backend.service.StudentService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Student>>> getStudents() {
        return ResponseEntity.ok(ApiResponse.success("Success", studentService.findAll()));

    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<Student>> getStudentById(@PathVariable("id") Long id) {
        Optional<Student> student = studentService.findById(id);

        if (student.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("Success", student.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Student>> create(@RequestBody Student student){
        return ResponseEntity.ok(ApiResponse.success("Success", studentService.save(student)));
    }


    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<Student>> update(@PathVariable("id") Long id, @RequestBody Student student) {
        Optional<Student> existing = studentService.findById(id);

        if (existing.isPresent()) {
            student.setId(id);
            return ResponseEntity.ok(ApiResponse.success("Success", studentService.save(student)));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Student>> delete(@PathVariable("id") Long id){
        studentService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
