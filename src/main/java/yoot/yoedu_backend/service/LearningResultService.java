package yoot.yoedu_backend.service;

import yoot.yoedu_backend.dto.learningresult.LearningResultCreateRequest;
import yoot.yoedu_backend.dto.learningresult.LearningResultResponse;
import yoot.yoedu_backend.common.exception.ConflictException;

import java.util.List;

public interface LearningResultService {

    LearningResultResponse create(LearningResultCreateRequest request, String username) throws ConflictException;

    List<LearningResultResponse> findByStudentId(Long studentId, String username);
}
