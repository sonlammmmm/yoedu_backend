package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.TuitionInvoice;

public interface TuitionInvoiceRepository extends JpaRepository<TuitionInvoice, Long> {
    java.util.List<TuitionInvoice> findByStudentId(Long studentId);

    java.util.List<TuitionInvoice> findByStudentParentsId(Long parentId);
}
