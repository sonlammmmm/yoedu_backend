package yoot.yoedu_backend.controllers;

import java.security.Principal;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import yoot.yoedu_backend.common.ApiResponse;
import yoot.yoedu_backend.common.exception.ConflictException;
import yoot.yoedu_backend.dto.learningresult.LearningResultCreateRequest;
import yoot.yoedu_backend.dto.learningresult.LearningResultResponse;
import yoot.yoedu_backend.service.LearningResultService;

@RestController
@RequestMapping("/api/learning-result")
@RequiredArgsConstructor
public class LearningResultController {
    private final LearningResultService learningResultService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    public ApiResponse<LearningResultResponse> create(@Valid @RequestBody LearningResultCreateRequest request, Principal principal) throws ConflictException {
        return ApiResponse.success("Learning result created", learningResultService.create(request, principal.getName()));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF','PARENT')")
    public ApiResponse<List<LearningResultResponse>> findByStudentId(@PathVariable Long studentId, Principal principal) {
        return ApiResponse.success(learningResultService.findByStudentId(studentId, principal.getName()));
    }
}
