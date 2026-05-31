package yoot.yoedu_backend.service;

import yoot.yoedu_backend.common.exception.BadRequestException;
import yoot.yoedu_backend.common.exception.NotFoundException;
import yoot.yoedu_backend.domain.entity.Enrollment;
import yoot.yoedu_backend.dto.enrollment.EnrollmentCreateRequest;
import yoot.yoedu_backend.dto.enrollment.EnrollmentResponse;

import java.util.List;

public interface EnrollmentService {
    EnrollmentResponse create(EnrollmentCreateRequest request) throws BadRequestException, NotFoundException;

    List<EnrollmentResponse> findByClassId(Long classId);

    Enrollment getEnrollment(Long studentId, Long classId) throws BadRequestException;
}