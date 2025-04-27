package com.skillora.app.controller;

import com.skillora.app.model.Bumal.User;
import com.skillora.app.service.Bumal.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Map;

@RestController
@RequestMapping("/api/oauth2")
public class OAuth2Controller {

    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public User getOAuth2User(@AuthenticationPrincipal OAuth2User principal, HttpSession session) {
        if (principal == null) {
            return null;
        }

        Map<String, Object> attributes = principal.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");

        // Check if user exists
        User existingUser = userService.findByEmail(email);
        if (existingUser != null) {
            // Store user ID in session
            session.setAttribute("userId", existingUser.getId());
            return existingUser;
        }

        // Create new user
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setFirstName(name);
        newUser.setUserName(email.split("@")[0]); // Use email prefix as username
        newUser.setProfilePicURL(picture);
        newUser.setUserType("User");
        newUser.setBio("");
        newUser.setFollowers(new ArrayList<>());
        newUser.setFollowing(new ArrayList<>());

        User savedUser = userService.register(newUser);
        // Store user ID in session
        session.setAttribute("userId", savedUser.getId());
        return savedUser;
    }
} 