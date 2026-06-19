package yoot.yoedu_backend.service;

import yoot.yoedu_backend.common.exception.BadRequestException;
import yoot.yoedu_backend.common.exception.NotFoundException;
import yoot.yoedu_backend.domain.entity.Promotion;
import yoot.yoedu_backend.domain.entity.TuitionInvoice;
import yoot.yoedu_backend.dto.billing.InvoiceCreateRequest;
import yoot.yoedu_backend.dto.billing.InvoiceResponse;
import yoot.yoedu_backend.dto.billing.PaymentCreateRequest;
import yoot.yoedu_backend.dto.billing.PaymentResponse;

import java.util.List;

public interface BillingService {
    InvoiceResponse createInvoice(InvoiceCreateRequest request) throws NotFoundException;

    List<InvoiceResponse> findInvoicesByStudent(Long studentId, String username) throws BadRequestException, NotFoundException;

    float calculateDiscount(float originalAmount, Promotion promotion);

    InvoiceResponse toInvoiceResponse(TuitionInvoice item);

    PaymentResponse createPayment(PaymentCreateRequest request, String username);
}
