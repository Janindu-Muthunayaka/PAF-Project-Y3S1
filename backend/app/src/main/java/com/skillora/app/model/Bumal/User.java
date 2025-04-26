package com.skillora.app.model.Bumal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "Users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String password;
    private String profilePicURL;
    private String userType;
    private String bio;
    private List<String> followers = new ArrayList<>();
    private List<String> following = new ArrayList<>();

}