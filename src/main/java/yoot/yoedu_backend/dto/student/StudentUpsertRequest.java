package yoot.yoedu_backend.dto.student;

import jakarta.validation.constraints.*;
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
public class StudentUpsertRequest {

    @Size(min = 2)
    private String student_code;

    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters") 
    private String full_name;

    private LocalDate dateOfBirth;

    private Gender gender;

    private String grade_level;

    private String school_name;


    @NotBlank
    @Pattern(regexp="^(84|0[35789])+([0-9]{8})$")
    private String phone;

    @NotNull(message = "Parent ID is required")
    private Long parentId;

    private Status status;

    @Min(0)
    @Max(10)
    private BigDecimal lastestScore;

    private String note;

    private LocalDateTime created_at;

    private LocalDateTime updated_at;
}
