package com.skillora.app.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.skillora.app.model.Bumal.User;
import com.skillora.app.service.Bumal.UserService;

@RequestMapping("/api")
@RestController 
public class SessionDataFetch {
    
    @Autowired
    private UserService userService;

    @GetMapping("/getUserData")
    public ResponseEntity<?> getUserData() {
        

        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        String userId = (String) attr.getRequest().getSession().getAttribute("userId"); 

        //only use for testing
        System.out.println("Session UserId in fetcher: " + attr.getRequest().getSession().getAttribute("userId"));

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        // Use Optional to check if user is found
        Optional<User> user = userService.findById(userId);
        if (!user.isPresent()) {  // Correct way to check if user is present
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        return ResponseEntity.ok(user.get());  // Use user.get() to get the User object from Optional
    }
}
