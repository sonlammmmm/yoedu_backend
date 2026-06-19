package yoot.yoedu_backend.service;

public interface EmailService {
    void sendWelcomeEmail(String to, String username, String rawPassword);
}
