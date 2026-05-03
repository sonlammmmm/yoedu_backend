package yoot.yoedu_backend.dto.parent;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import yoot.yoedu_backend.domain.enums.Gender;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParentResponse {
    private Long id;

    private String full_name;

    private String phone;

    private String email;

    private String address;

    private Gender gender = Gender.OTHER;

    private String relationship;

    private LocalDateTime created_at;

    private LocalDateTime updated_at;
}
