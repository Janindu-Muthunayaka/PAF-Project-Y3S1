package com.skillora.app.model.Bumal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GoogleSignUpDto {
    private String name;
    private String userName;
    private String email;
    private String profileImageUrl;
    private String bio = ""; // Initialize with empty string
}
