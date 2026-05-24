package yoot.yoedu_backend.dto.courseclass;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import yoot.yoedu_backend.domain.enums.ClassStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseClassResponse {
    private Long id;

    private String classCode;

    private String name;

    private Long courseId;

    private Long roomId;

    private Long scheduleSlotId;

    private Long mainTeacherId;

    private Long assistantTeacherId;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer maxStudents;

    private float tuitionFee;

    private ClassStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
