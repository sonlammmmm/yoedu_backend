package yoot.yoedu_backend.dto.courseclass;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import yoot.yoedu_backend.domain.enums.ClassStatus;

import java.time.LocalDate;

@Data
public class CourseClassUpsertRequest {
    @NotBlank
    @Size(max = 20)
    String classCode;

    @NotBlank
    @Size(max = 100)
    String name;

    @NotNull
    Long courseId;

    @NotNull
    Long roomId;

    @NotNull
    Long scheduleSlotId;

    @NotNull
    Long mainTeacherId;

    Long assistantTeacherId;

    @NotNull
    LocalDate startDate;

    LocalDate endDate;

    float tuitionFee;

    @NotNull
    ClassStatus status;
}
