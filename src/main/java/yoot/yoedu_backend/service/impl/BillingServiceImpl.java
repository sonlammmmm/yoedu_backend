package yoot.yoedu_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yoot.yoedu_backend.common.exception.BadRequestException;
import yoot.yoedu_backend.common.exception.NotFoundException;
import yoot.yoedu_backend.domain.entity.Promotion;
import yoot.yoedu_backend.domain.entity.TuitionInvoice;
import yoot.yoedu_backend.domain.entity.User;
import yoot.yoedu_backend.domain.enums.DiscountType;
import yoot.yoedu_backend.domain.enums.InvoiceStatus;
import yoot.yoedu_backend.dto.billing.InvoiceCreateRequest;
import yoot.yoedu_backend.dto.billing.InvoiceResponse;
import yoot.yoedu_backend.repository.PromotionRepository;
import yoot.yoedu_backend.repository.TuitionInvoiceRepository;
import yoot.yoedu_backend.service.AuthService;
import yoot.yoedu_backend.service.BillingService;
import yoot.yoedu_backend.service.CourseClassService;
import yoot.yoedu_backend.service.StudentService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {

    private final TuitionInvoiceRepository tuitionInvoiceRepository;
    private final PromotionRepository promotionRepository;
    private final StudentService studentService;
    private final CourseClassService courseClassService;
    private final AuthService authService;
    private final ModelMapper mapper;

    @Override
    @Transactional
    public InvoiceResponse createInvoice(InvoiceCreateRequest request) throws NotFoundException {
        TuitionInvoice invoice = new TuitionInvoice();
        invoice.setInvoiceCode(request.getInvoiceCode());
        invoice.setStudent(studentService.getStudent(request.getStudentId()));
        invoice.setCourseClass(courseClassService.getCourseClass(request.getCourseClassId()));
        invoice.setBillingMonth(request.getBillingMonth());

        float originalAmount = request.getOriginalAmount() != 0
                ? request.getOriginalAmount()
                : invoice.getCourseClass().getTuitionFee();
        invoice.setOriginalAmount(originalAmount);

        Promotion promotion = null;
        float discountAmount = 0;
        if (request.getPromotionId() != null) {
            promotion = promotionRepository.findById(request.getPromotionId())
                    .orElseThrow(() -> new NotFoundException("Promotion not found: " + request.getPromotionId()));
            discountAmount = calculateDiscount(originalAmount, promotion);
        }

        float finalAmount = originalAmount - discountAmount;
        invoice.setPromotion(promotion);
        invoice.setDiscountAmount(discountAmount);
        invoice.setFinalAmount(finalAmount);
        invoice.setAmountPaid(0);
        invoice.setBalanceAmount(finalAmount);
        invoice.setStatus(finalAmount == 0 ? InvoiceStatus.PAID : InvoiceStatus.UNPAID);
        invoice.setDueDate(request.getDueDate());
        invoice.setNote(request.getNote());
        return toInvoiceResponse(tuitionInvoiceRepository.save(invoice));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> findInvoicesByStudent(Long studentId, String username) throws BadRequestException, NotFoundException {
        User user = authService.findActiveUserByUsername(username);
        if (user.getRole().name().equals("PARENT")) {
            studentService.getStudentForParent(studentId, user.getParent().getId());
        }
        return tuitionInvoiceRepository.findByStudentId(studentId).stream().map(this::toInvoiceResponse).toList();
    }

    @Override
    public float calculateDiscount(float originalAmount, Promotion promotion) {
        if (promotion.getDiscountType() == DiscountType.PERCENT) {
            return originalAmount * promotion.getDiscountValue() / 100;
        }
        return promotion.getDiscountValue();
    }

    @Override
    public InvoiceResponse toInvoiceResponse(TuitionInvoice item) {
        InvoiceResponse result = mapper.map(item, InvoiceResponse.class);
        result.setStudentId(item.getStudent().getId());
        result.setStudentName(item.getStudent().getFull_name());
        result.setCourseClassId(item.getCourseClass().getId());
        result.setClassName(item.getCourseClass().getName());
        result.setStatus(item.getStatus().name());
        if (item.getPromotion() != null) {
            result.setPromotionId(item.getPromotion().getId());
            result.setPromotionName(item.getPromotion().getName());
        }
        return result;
    }
}
