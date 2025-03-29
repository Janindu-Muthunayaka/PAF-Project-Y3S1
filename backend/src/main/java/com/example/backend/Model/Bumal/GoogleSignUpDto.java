package com.example.backend.Model.Bumal;

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
}
