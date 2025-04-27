package com.skillora.app.service;

import com.skillora.app.model.Bumal.User;
import com.skillora.app.service.Bumal.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        // Check if user exists
        User existingUser = userService.findByEmail(email);
        if (existingUser == null) {
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
            userService.register(newUser);
        }

        return oAuth2User;
    }
} 