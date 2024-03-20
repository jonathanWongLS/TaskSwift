package com.ts.taskswift.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailService {
    @Autowired
    private final JavaMailSender javaMailSender;

    public void send(String to, String body) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        message.setFrom(new InternetAddress("wonglsjonathan01@gmail.com"));
        message.setRecipient(MimeMessage.RecipientType.TO, new InternetAddress(to));
        message.setSubject("[TaskSwift] You have been invited to a project!");
        message.setContent(body, "text/html; charset=utf-8");
        javaMailSender.send(message);
    }
}
