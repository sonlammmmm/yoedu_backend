package yoot.yoedu_backend.service;

import jakarta.validation.Valid;
import yoot.yoedu_backend.dto.attendance.AttendanceCreateRequest;
import yoot.yoedu_backend.dto.attendance.AttendanceResponse;

import java.util.List;

public interface AttendanceService {
    List<AttendanceResponse> findByClassId(Long classId);

    AttendanceResponse create(@Valid AttendanceCreateRequest request, String name);
}
