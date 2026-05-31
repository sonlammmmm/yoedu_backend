package yoot.yoedu_backend.dto.enrollment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import yoot.yoedu_backend.domain.enums.EnrollmentStatus;

import java.time.LocalDate;

@Data
public class EnrollmentCreateRequest {
    @NotNull
    private Long studentId;

    @NotNull
    private Long courseClassId;

    @NotNull
    private LocalDate enrolledAt;

    @NotNull
    private EnrollmentStatus status;

    @Size(max = 255)
    private String note;
}