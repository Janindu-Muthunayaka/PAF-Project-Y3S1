package com.skillora.app.service;

import com.skillora.app.model.Bumal.User;
import com.skillora.app.service.Bumal.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserService userService;

    @Autowired
    private HttpSession session;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("\n[CustomOAuth2UserService.java] Loading OAuth2 User");
        OAuth2User oauth2User = super.loadUser(userRequest);
        System.out.println("OAuth2 User Attributes: " + oauth2User.getAttributes());

        // Extract user info from OAuth2 response
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");
        
        System.out.println("Extracted User Info:");
        System.out.println("Email: " + email);
        System.out.println("Name: " + name);
        System.out.println("Picture: " + picture);

        // Check if user exists in database
        User user = userService.findByEmail(email);
        System.out.println("Database Check: " + (user != null ? "User Found" : "User Not Found"));

        if (user == null) {
            // Create new user
            System.out.println("Creating new user...");
            user = new User();
            user.setEmail(email);
            user.setFirstName(name);
            user.setUserName(email.split("@")[0]); // Use email prefix as username
            user.setProfilePicURL(picture);
            user.setUserType("User");
            user.setBio("");
            user = userService.register(user);
            System.out.println("New user created: " + user);
        } else {
            System.out.println("Existing user found: " + user);
        }

        // Store user ID in session
        session.setAttribute("userId", user.getId());
        System.out.println("User ID stored in session: " + user.getId());

        return oauth2User;
    }
} 