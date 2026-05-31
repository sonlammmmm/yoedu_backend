package yoot.yoedu_backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import yoot.yoedu_backend.common.ApiResponse;
import yoot.yoedu_backend.common.exception.BadRequestException;
import yoot.yoedu_backend.common.exception.NotFoundException;
import yoot.yoedu_backend.dto.parent.ParentDashboardResponse;
import yoot.yoedu_backend.service.ParentPortalService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.security.Principal;

@RestController
@RequestMapping(value = "/api/parent")
@RequiredArgsConstructor
@Tag(name = "Parent Portal", description = "Parent portal dashboard and view endpoints")
@SecurityRequirement(name = "jwt")
public class ParentPortalController {

    private final ParentPortalService parentPortalService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('PARENT')")
    public ApiResponse<ParentDashboardResponse> dashboard(Principal principal) throws BadRequestException, NotFoundException {
        return ApiResponse.success(parentPortalService.getDashboard(principal.getName()));
    }

}
