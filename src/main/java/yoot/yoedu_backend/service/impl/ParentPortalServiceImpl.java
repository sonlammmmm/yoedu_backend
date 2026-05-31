package yoot.yoedu_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yoot.yoedu_backend.common.exception.BadRequestException;
import yoot.yoedu_backend.common.exception.NotFoundException;
import yoot.yoedu_backend.domain.entity.User;
import yoot.yoedu_backend.domain.enums.NotificationRecipientType;
import yoot.yoedu_backend.domain.enums.UserRole;
import yoot.yoedu_backend.dto.parent.InvoiceCard;
import yoot.yoedu_backend.dto.parent.NotificationCard;
import yoot.yoedu_backend.dto.parent.ParentDashboardResponse;
import yoot.yoedu_backend.dto.parent.StudentCard;
import yoot.yoedu_backend.dto.student.StudentResponse;
import yoot.yoedu_backend.repository.NotificationRepository;
import yoot.yoedu_backend.repository.TuitionInvoiceRepository;
import yoot.yoedu_backend.service.AuthService;
import yoot.yoedu_backend.service.ParentPortalService;
import yoot.yoedu_backend.service.StudentService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParentPortalServiceImpl implements ParentPortalService {
    private final AuthService authService;
    private final StudentService studentService;
    private final TuitionInvoiceRepository tuitionInvoiceRepository;
    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public ParentDashboardResponse getDashboard(String username) throws BadRequestException, NotFoundException {
        User user = authService.findActiveUserByUsername(username);
        if (user.getRole() != UserRole.PARENT || user.getParent() == null) {
            throw new BadRequestException("Current user is not a parent account");
        }

        Long parentId = user.getParent().getId();
        List<StudentCard> students = studentService.findByParentId(parentId).stream()
                .map(s -> new StudentCard(
                        s.getId(), 
                        s.getStudent_code(), 
                        s.getFull_name(), 
                        s.getStatus() != null ? s.getStatus().name() : null, 
                        s.getLastestScore() != null ? s.getLastestScore().floatValue() : 0f))
                .toList();

        List<InvoiceCard> invoices = tuitionInvoiceRepository.findByStudentParentsId(parentId).stream()
                .map(i -> new InvoiceCard(
                        i.getId(),
                        i.getInvoiceCode(),
                        i.getStudent().getFull_name(),
                        i.getCourseClass().getName(),
                        i.getBillingMonth(),
                        i.getFinalAmount(),
                        i.getAmountPaid(),
                        i.getBalanceAmount(),
                        i.getStatus() != null ? i.getStatus().name() : null,
                        i.getDueDate()
                ))
                .toList();

        List<NotificationCard> notifications = notificationRepository
                .findByRecipientTypeAndRecipientRefIdOrderByCreatedAtDesc(NotificationRecipientType.PARENT, parentId)
                .stream()
                .map(n -> new NotificationCard(
                        n.getId(),
                        n.getType().name(),
                        n.getTitle(),
                        n.getContent(),
                        n.getIsRead(),
                        n.getCreatedAt()
                ))
                .toList();

        return new ParentDashboardResponse(
                parentId,
                user.getParent().getFull_name(),
                user.getUsername(),
                students,
                invoices,
                notifications
        );
    }
}

