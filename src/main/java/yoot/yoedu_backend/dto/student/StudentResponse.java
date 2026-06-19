package yoot.yoedu_backend.dto.student;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import yoot.yoedu_backend.domain.entity.Parents;
import yoot.yoedu_backend.domain.enums.Gender;
import yoot.yoedu_backend.domain.enums.Status;
import yoot.yoedu_backend.dto.parent.ParentResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponse {
    private Long id;

    private String student_code;

    private String full_name;

    private LocalDate dateOfBirth;

    private Gender gender;

    private String grade_level;

    private String school_name;

    private String phone;

    private ParentResponse parent;

    private Status status;

    @Min(value = 0)
    @Max(value = 10)
    private BigDecimal lastestScore;

    private String note;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
