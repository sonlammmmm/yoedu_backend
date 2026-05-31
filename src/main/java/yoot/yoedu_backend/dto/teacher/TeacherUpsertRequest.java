package yoot.yoedu_backend.dto.teacher;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import yoot.yoedu_backend.domain.enums.TeacherRole;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeacherUpsertRequest {

    @NotBlank(message = "Teacher code is required")
    @Size(min = 2, max = 20, message = "Teacher code must be between 2 and 20 characters")
    private String teacher_code;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String full_name;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp="^(84|0[35789])+([0-9]{8})$", message = "Invalid phone number format")
    private String phone;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must be less than 100 characters")
    private String email;

    private TeacherRole teacherRole;

    @Size(max = 255, message = "CCCD Image URL must be less than 255 characters")
    private String cccdImageUrl;

    private boolean isActive;
}
