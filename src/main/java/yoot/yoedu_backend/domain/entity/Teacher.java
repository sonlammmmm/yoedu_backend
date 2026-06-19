package yoot.yoedu_backend.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import yoot.yoedu_backend.domain.enums.TeacherRole;
import yoot.yoedu_backend.domain.AuditableEntity;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "teachers")
public class Teacher extends AuditableEntity {

    @Column(length = 20, nullable = false, unique = true)
    private String teacher_code;

    @Column(length = 100, nullable = false)
    private String full_name;

    @Column(length = 20, nullable = false, unique = true)
    private String phone;

    @Column(length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TeacherRole teacherRole = TeacherRole.TEACHER;

    @Column(length = 255)
    private String cccdImageUrl;

    @Column(nullable = false)
    private boolean isActive;
}
