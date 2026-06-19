package yoot.yoedu_backend.dto.attendance;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AttendanceResponse {
    Long id;
    Long courseClassId;
    String className;
    Long studentId;
    String studentName;
    LocalDate attendanceDate;
    String status;
    String note;
    Long recordedByUserId;
    String recordedByUsername;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
