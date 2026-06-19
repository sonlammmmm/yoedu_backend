package yoot.yoedu_backend.dto.attendance;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import yoot.yoedu_backend.domain.enums.AttendanceStatus;

import java.time.LocalDate;

@Data
public class AttendanceCreateRequest {

    @NotNull
    Long courseClassId;

    @NotNull Long studentId;

    @NotNull
    LocalDate attendanceDate;

    @NotNull
    AttendanceStatus status;

    @Size(max = 255) String note;
}
