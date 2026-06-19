package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    java.util.List<Payment> findByPaymentCodeAndPaymentMethod(String paymentCode, String paymentMethod);
}