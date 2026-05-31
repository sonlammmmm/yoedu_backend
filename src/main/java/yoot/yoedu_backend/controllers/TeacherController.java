package yoot.yoedu_backend.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yoot.yoedu_backend.common.ApiResponse;
import yoot.yoedu_backend.dto.teacher.TeacherResponse;
import yoot.yoedu_backend.dto.teacher.TeacherUpsertRequest;
import yoot.yoedu_backend.service.TeachersService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/teachers")
@RequiredArgsConstructor
@Tag(name = "Teacher", description = "Teacher management endpoints")
@SecurityRequirement(name = "jwt")
public class TeacherController {
    private final TeachersService teachersService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeacherResponse>>> getTeachers() {
        return ResponseEntity.ok(ApiResponse.success("Success", teachersService.findAll()));
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<TeacherResponse>> getTeacherById(@PathVariable("id") Long id) {
        Optional<TeacherResponse> teacher = teachersService.findById(id);

        if (teacher.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("Success", teacher.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TeacherResponse>> create(@Valid @RequestBody TeacherUpsertRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Success", teachersService.create(req)));
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<TeacherResponse>> update(@PathVariable("id") Long id, @Valid @RequestBody TeacherUpsertRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Success", teachersService.update(id, req)));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") Long id) throws Exception {
        teachersService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted successfully", null));
    }
}
