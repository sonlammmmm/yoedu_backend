package yoot.day1.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import yoot.day1.common.enums.Gender;
import yoot.day1.common.enums.Status;
import yoot.day1.common.enums.TeacherRole;
import yoot.day1.domain.AuditableEntity;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
@Entity
@Data
@Table(name = "students")
@AllArgsConstructor
@NoArgsConstructor
public class Student extends AuditableEntity {

    @Column(length = 20, nullable = false, unique = true)
    private String student_code;

    @Column(length = 100, nullable = false)
    private String full_name;

    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private Gender gender = Gender.OTHER;

    @Column(length = 30)
    private String grade_level;

    @Column(length = 100)
    private String school_name;

    @Column(length = 20)
    private String phone;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Parents parents;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @Builder.Default
    @Column(precision = 5, scale = 2)
    private BigDecimal lastestScore = BigDecimal.ZERO;

    private String note;
}
