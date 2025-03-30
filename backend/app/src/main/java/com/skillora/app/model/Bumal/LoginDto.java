package com.skillora.app.model.Bumal;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@SuppressWarnings("unused")
public class LoginDto {
    private String Email;
    private String Password;

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }
}
