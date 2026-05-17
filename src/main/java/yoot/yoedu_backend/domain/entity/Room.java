package yoot.yoedu_backend.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import yoot.yoedu_backend.domain.AuditableEntity;

@Getter
@Setter
@Entity
@Table(name = "rooms")
public class Room extends AuditableEntity {

    @Column(name = "room_code", nullable = false, unique = true, length = 20)
    private String roomCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer capacity = 25;

    @Column(length = 255)
    private String description;
}
