package yoot.yoedu_backend.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import yoot.yoedu_backend.domain.AuditableEntity;
import yoot.yoedu_backend.domain.enums.PaymentMethod;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "payments")
public class Payment extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private TuitionInvoice invoice;

    @Column(name = "payment_code", nullable = false, unique = true, length = 30)
    private String paymentCode;

    @Column(name = "paid_amount", nullable = false)
    private float paidAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    @Column(name = "paid_at", nullable = false)
    private LocalDateTime paidAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cashier_user_id")
    private User cashierUser;

    @Column(length = 255)
    private String note;
}
