package com.skillora.app.model.login;

import org.springframework.data.annotation.Id;

public class User {

    @Id
    private String id; // MongoDB uses String for the ID field (or ObjectId)

    private String username;
    private String password;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
