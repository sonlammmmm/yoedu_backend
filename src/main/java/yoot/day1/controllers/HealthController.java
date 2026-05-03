package yoot.day1.controllers;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import yoot.day1.common.ApiResponse;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public ApiResponse<String> health() {
        return ApiResponse.success("YOEDU backend is running");
    }

    @PostMapping("/api/health/echo")
    public ApiResponse<String> echo(@Valid @RequestBody EchoRequest request) {
        return ApiResponse.success(request.message());
    }

    public record EchoRequest(@NotBlank (message = "message must no be blank") String message) {
    }
}
