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

    /**
     * Sends an email.
     *
     * @param to   the recipient's email address
     * @param body the content of the email
     * @throws MessagingException if there is an issue with sending the email
     */
    public void send(String to, String body) throws MessagingException {
        // Create a MimeMessage for the email
        MimeMessage message = javaMailSender.createMimeMessage();

        // Set sender's email address
        message.setFrom(new InternetAddress("wonglsjonathan01@gmail.com"));

        // Set recipient's email address
        message.setRecipient(MimeMessage.RecipientType.TO, new InternetAddress(to));

        // Set subject of the email
        message.setSubject("[TaskSwift] You have been invited to a project!");

        // Set the content of the email as HTML
        message.setContent(body, "text/html; charset=utf-8");

        // Send the email with JavaMailSender
        javaMailSender.send(message);
    }
}
