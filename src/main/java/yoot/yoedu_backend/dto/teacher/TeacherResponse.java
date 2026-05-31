package yoot.yoedu_backend.dto.teacher;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import yoot.yoedu_backend.domain.enums.TeacherRole;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeacherResponse {
    private Long id;
    private String teacher_code;
    private String full_name;
    private String phone;
    private String email;
    private TeacherRole teacherRole;
    private String cccdImageUrl;
    private boolean isActive;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}
