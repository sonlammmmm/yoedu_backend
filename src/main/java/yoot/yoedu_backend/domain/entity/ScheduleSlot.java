package yoot.yoedu_backend.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import yoot.yoedu_backend.domain.AuditableEntity;

import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "schedule_slots")
public class ScheduleSlot extends AuditableEntity {

    @Column(name = "slot_code", nullable = false, unique = true, length = 20)
    private String slotCode;

    @Column(nullable = false)
    private Integer weekday;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    private String note;
}
