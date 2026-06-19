package yoot.yoedu_backend.controllers;

import yoot.yoedu_backend.common.ApiResponse;
import yoot.yoedu_backend.domain.entity.Room;
import yoot.yoedu_backend.domain.entity.ScheduleSlot;
import yoot.yoedu_backend.domain.entity.Teacher;
import yoot.yoedu_backend.repository.RoomRepository;
import yoot.yoedu_backend.repository.ScheduleSlotRepository;
import yoot.yoedu_backend.repository.TeachersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/reference")
@RequiredArgsConstructor
@Tag(name = "Reference Data", description = "Reference data endpoints")
@SecurityRequirement(name = "jwt")
public class ReferenceDataController {

    private final TeachersRepository teacherRepository;
    private final RoomRepository roomRepository;
    private final ScheduleSlotRepository scheduleSlotRepository;

    @GetMapping("/teachers")
    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    public ApiResponse<List<Teacher>> teachers() {
        return ApiResponse.success(teacherRepository.findAll());
    }

    @GetMapping("/rooms")
    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    public ApiResponse<List<Room>> rooms() {
        return ApiResponse.success(roomRepository.findAll());
    }

    @GetMapping("/schedule-slots")
    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    public ApiResponse<List<ScheduleSlot>> scheduleSlots() {
        return ApiResponse.success(scheduleSlotRepository.findAll());
    }
}
