package yoot.yoedu_backend.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import yoot.yoedu_backend.domain.AuditableEntity;
import yoot.yoedu_backend.domain.enums.Status;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "enrollments")
public class Enrollment extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_class_id")
    private CourseClass courseClass;

    private LocalDate enrollAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.ACTIVE;

    private String note;
}
