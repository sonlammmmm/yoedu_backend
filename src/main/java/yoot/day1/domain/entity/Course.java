package yoot.day1.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import yoot.day1.domain.AuditableEntity;

import java.math.BigDecimal;

@Entity
@Data
@Table(name = "courses")
public class Course extends AuditableEntity {

    @Column(columnDefinition = "varchar(20)")
    private String courseCode;

    @Column(columnDefinition = "varchar(100)")
    private String name;

    @Column(columnDefinition = "text", nullable = true)
    private String description;

    private BigDecimal tuitionFee;

    private int totalSessions;

    private boolean isActive;
}
