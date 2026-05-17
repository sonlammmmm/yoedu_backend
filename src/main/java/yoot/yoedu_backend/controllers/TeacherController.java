package yoot.yoedu_backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yoot.yoedu_backend.common.ApiResponse;
import yoot.yoedu_backend.domain.entity.Teacher;
import yoot.yoedu_backend.service.TeachersService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/teachers")
@RequiredArgsConstructor
public class TeacherController {
    private final TeachersService teachersService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Teacher>>> getTeachers() {
        return ResponseEntity.ok(ApiResponse.success("Success", teachersService.findAll()));
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<Teacher>> getTeacherById(@PathVariable("id") Long id){
        Optional<Teacher> teachers = teachersService.findById(id);

        if(teachers.isPresent()){
            return ResponseEntity.ok(ApiResponse.success("Success", teachers.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Teacher>> create(@RequestBody Teacher teacher){
        return ResponseEntity.ok(ApiResponse.success("Success", teachersService.save(teacher)));
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<Teacher>> update(@PathVariable("id") Long id, @RequestBody Teacher teacher) {
        Optional<Teacher> existing = teachersService.findById(id);

        if (existing.isPresent()) {
            teacher.setId(id);
            return ResponseEntity.ok(ApiResponse.success("Success", teachersService.save(teacher)));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Teacher>> delete(@PathVariable("id") Long id) {
        teachersService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
