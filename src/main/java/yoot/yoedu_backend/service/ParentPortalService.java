package yoot.yoedu_backend.service;

import yoot.yoedu_backend.common.exception.BadRequestException;
import yoot.yoedu_backend.common.exception.NotFoundException;
import yoot.yoedu_backend.dto.parent.ParentDashboardResponse;

public interface ParentPortalService {
    ParentDashboardResponse getDashboard(String username) throws BadRequestException, NotFoundException;
}
