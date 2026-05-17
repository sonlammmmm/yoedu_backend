package yoot.yoedu_backend.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import yoot.yoedu_backend.domain.AuditableEntity;
import yoot.yoedu_backend.domain.enums.ClassStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name= "course_classes")
public class CourseClass extends AuditableEntity {

    @Column(columnDefinition = "varchar(20")
    private String classCode;

    @Column(columnDefinition = "varchar(100")
    private String name;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name ="room_id", nullable = false)
    private Room room;

    @ManyToOne
    @JoinColumn(name = "schedule_slot_id", nullable = false)
    private ScheduleSlot slot;

    @ManyToOne
    @JoinColumn(name = "main_teacher_id", nullable = false)
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "assistant_teacher_id")
    private Teacher assistantTeacher;

    private LocalDate startDate;
    private LocalDate endDate;

    private int maxStudents;

    @Column(columnDefinition = "decimal")
    private double tuitionFee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ClassStatus status = ClassStatus.OPEN;

}
