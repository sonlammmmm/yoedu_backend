package yoot.yoedu_backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import yoot.yoedu_backend.domain.enums.Gender;
import yoot.yoedu_backend.domain.enums.Status;
import yoot.yoedu_backend.domain.AuditableEntity;

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

    @Column(columnDefinition = "varchar(100)", nullable = false)
    private String full_name;

    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender = Gender.OTHER;

    @Column(length = 30)
    private String grade_level;

    @Column(length = 100)
    private String school_name;

    @Column(length = 20)
    private String phone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id")
    private Parents parents;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @Column(precision = 5, scale = 2)
    private BigDecimal lastestScore = BigDecimal.ZERO;

    private String note;
}
