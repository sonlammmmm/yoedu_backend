package yoot.yoedu_backend.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Data;
import yoot.yoedu_backend.domain.AuditableEntity;

@Entity
@Data
public class Parents extends AuditableEntity {

    @Column(length = 100, nullable = false)
    private String full_name;

    @Column(length = 20, nullable = false, unique = true)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(length = 255)
    private String address;
}
