package yoot.yoedu_backend.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import yoot.yoedu_backend.service.EmailService;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender emailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendWelcomeEmail(String to, String username, String rawPassword) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Welcome to YoEdu - Your Account Details");
            message.setText("Hello,\n\n" +
                    "Welcome to YoEdu! Your account has been successfully created.\n\n" +
                    "Here are your login details:\n" +
                    "Username: " + username + "\n" +
                    "Password: " + rawPassword + "\n\n" +
                    "Please keep these details safe and change your password after logging in.\n\n" +
                    "Best regards,\n" +
                    "YoEdu Team");
            
            emailSender.send(message);
            log.info("Welcome email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}", to, e);
        }
    }
}
