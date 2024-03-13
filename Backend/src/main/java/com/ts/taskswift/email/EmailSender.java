package com.ts.taskswift.email;

public interface EmailSender {
    void send(String to, String emailContent);
}
