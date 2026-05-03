package yoot.yoedu_backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import yoot.yoedu_backend.domain.entity.Student;
import yoot.yoedu_backend.service.StudentService;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HomeController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("\"data\":\"This is my cmt\"");
    }

    @GetMapping(value = "/students")
    public ResponseEntity<List<Student>> findAll() {
        return ResponseEntity.ok(studentService.findAll());
    }
}
