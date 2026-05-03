package yoot.yoedu_backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yoot.yoedu_backend.common.ApiResponse;
import yoot.yoedu_backend.domain.entity.Teachers;
import yoot.yoedu_backend.service.TeachersService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/teachers")
@RequiredArgsConstructor
public class TeacherController {
    private final TeachersService teachersService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Teachers>>> getTeachers() {
        return ResponseEntity.ok(ApiResponse.success("Success", teachersService.findAll()));
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<Teachers>> getTeacherById(@PathVariable("id") Long id){
        Optional<Teachers> teachers = teachersService.findById(id);

        if(teachers.isPresent()){
            return ResponseEntity.ok(ApiResponse.success("Success", teachers.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Teachers>> create(@RequestBody Teachers teachers){
        return ResponseEntity.ok(ApiResponse.success("Success", teachersService.save(teachers)));
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<Teachers>> update(@PathVariable("id") Long id, @RequestBody Teachers teachers) {
        Optional<Teachers> existing = teachersService.findById(id);

        if (existing.isPresent()) {
            teachers.setId(id);
            return ResponseEntity.ok(ApiResponse.success("Success", teachersService.save(teachers)));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Teachers>> delete(@PathVariable("id") Long id) {
        teachersService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
