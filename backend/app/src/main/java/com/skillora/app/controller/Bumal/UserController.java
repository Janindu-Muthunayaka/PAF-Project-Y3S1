package com.skillora.app.controller.Bumal;

import com.skillora.app.model.Bumal.FollowDto;
import com.skillora.app.model.Bumal.GoogleSignUpDto;
import com.skillora.app.model.Bumal.LoginDto;
import com.skillora.app.model.Bumal.User;
import com.skillora.app.model.Bumal.profileUpdateDto;
import com.skillora.app.service.Bumal.UserService;

import jakarta.servlet.http.HttpSession;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.server.Session;
import org.springframework.cache.support.NullValue;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@SuppressWarnings("unused")
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Check if username or email already exists
        if (userService.findByUsername(user.getUserName()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }
        if (userService.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        }

        // Initialize required fields if null
        if (user.getBio() == null) {
            user.setBio("");
        }
        if (user.getFollowers() == null) {
            user.setFollowers(new ArrayList<>());
        }
        if (user.getFollowing() == null) {
            user.setFollowing(new ArrayList<>());
        }
        if (user.getProfilePicURL() == null) {
            user.setProfilePicURL("");
        }
        if (user.getUserType() == null) {
            user.setUserType("User");
        }

        // Register the user
        User registeredUser = userService.register(user);

        // Create HATEOAS response with self link
        EntityModel<User> resource = EntityModel.of(registeredUser);
        resource.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).registerUser(user)).withSelfRel());

        // Return the response with created status and HATEOAS links
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);
    }

    @PostMapping("/googleSignUp")
    public ResponseEntity<?> registerUserByGoogle(@RequestBody GoogleSignUpDto gUser) {
        System.out.println("heloo");
        // Check if username or email already exists
        System.out.println("\n[UserController.java] Google SignUp Request:");
        System.out.println("Location: /api/users/googleSignUp");
        System.out.println("User Details: " + gUser);
        
        User userR = userService.findByEmail(gUser.getEmail());
        System.out.println("Existing User Check: " + (userR != null ? "Found" : "Not Found"));
        
        if (userService.findByEmail(gUser.getEmail()) != null) {
            System.out.println("Returning existing user: " + userR);
            return ResponseEntity.status(HttpStatus.CREATED).body(userR);
        }
        
        User newUser = new User();
        newUser.setUserName(gUser.getUserName());
        newUser.setEmail(gUser.getEmail());
        newUser.setProfilePicURL(gUser.getProfileImageUrl() != null ? gUser.getProfileImageUrl() : "");
        newUser.setFirstName(gUser.getName());
        newUser.setUserType("User");
        newUser.setBio(gUser.getBio() != null ? gUser.getBio() : "");
        newUser.setFollowers(new ArrayList<>());
        newUser.setFollowing(new ArrayList<>());

        // Register the user
        User registeredUser = userService.register(newUser);
        System.out.println("New User Created: " + registeredUser);
        
        // Create HATEOAS response with self link
        EntityModel<User> resource = EntityModel.of(registeredUser);
        resource.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).registerUser(newUser)).withSelfRel());

        System.out.println("Final Response: " + resource);
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);
    }



    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@RequestBody LoginDto loginDto){
        User user = userService.findByEmail(loginDto.getEmail());

        if(user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        else{
            if(Objects.equals(loginDto.getPassword(), user.getPassword())){
                EntityModel<User> resource = EntityModel.of(user);
                resource.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).getUserByEmail(loginDto.getEmail())).withSelfRel());
                
                
                //storing
                ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
                attr.getRequest().getSession().setAttribute("userId", user.getId()); // Store as String
                System.out.println("Session UserId at login: " + attr.getRequest().getSession().getAttribute("userId"));
                HttpSession session = attr.getRequest().getSession(false);
                if (session != null) {
                    System.out.println("Immediately after setting: " + session.getAttribute("userId"));
                }


                // Return response with HATEOAS links
                return ResponseEntity.ok(resource);
            }
            else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password Incorrect");
            }

        }
    }

    @GetMapping("/allUsers")
    public ResponseEntity<?> getAllUsers() {
        List<User> user = userService.findAllUsers();

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Users not found");
        }

       
        
        

        
        return ResponseEntity.ok(user);
    }

    @GetMapping("/getUserByEmail/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        User user = userService.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Add self link
        EntityModel<User> resource = EntityModel.of(user);
        resource.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).getUserByEmail(email)).withSelfRel());

        // Return response with HATEOAS links
        return ResponseEntity.ok(resource);
    }

    @GetMapping("/getUserById/{Id}")
    public ResponseEntity<?> getUserById(@PathVariable ObjectId Id) {
        Optional<User> user = userService.findById(Id);

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Add self link
        EntityModel<Optional<User>> resource = EntityModel.of(user);
        resource.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).getUserById(Id)).withSelfRel());

        // Return response with HATEOAS links
        return ResponseEntity.ok(resource);
    }

    @PostMapping("/follow")
    public String followUser(@RequestBody FollowDto followDto){
        return userService.followUser(followDto.getUser1(), followDto.getUser2());
    }

    @GetMapping("/myFollowers/{userId}")
    public List<Optional<User>> myFollowers(@PathVariable String userId){
        return userService.getFollowers(userId);
    }

    @PostMapping("/unfollow")
    public String unFollowUser(@RequestBody FollowDto followDto){
        return userService.unFollowUser(followDto.getUser1(), followDto.getUser2());
    }

    @PutMapping("/{userId}")
    public String updateUser(@PathVariable String userId, @RequestBody User updatedUser) {
        // Set the ID of the updated user object to match the path variable
        updatedUser.setId(userId);
        userService.updateUser(updatedUser);
        return "User updated";
    }

    @PutMapping("/updateProfilePic/{userId}")
    public String updateProfilePic(@PathVariable String userId, @RequestBody profileUpdateDto profilePicUrl){
        Optional<User> user = userService.findById(userId);
        User updatedUser = new User();

        if(user.isPresent()){

            user.get().setProfilePicURL(profilePicUrl.getProfilePicLink());
            updatedUser = user.get();
            userService.updateUser(updatedUser);
        }
        return "profile pic updated";
    }

    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable String userId) {
        userService.deleteUserById(userId);
        return "User Deleted";
    }

    @PostMapping("/getUsersNames")
    public ResponseEntity<?> getUsernames(@RequestBody List<String> ids){
        List<String> namesArray = new ArrayList<>();
        for (String id: ids
             ) {

            Optional<User> u = userService.findById(id);

            u.ifPresent(user -> namesArray.add(user.getFirstName()));

        }
        System.out.print(namesArray);
        return ResponseEntity.ok(namesArray);
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Invalidate session
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        attr.getRequest().getSession().invalidate();

        return ResponseEntity.ok("Logout successful");
    }


    @GetMapping("/session/user")
    public ResponseEntity<?> getSessionUser() {
        System.out.println("\n[UserController.java] Getting Session User");
        System.out.println("Location: /api/users/session/user");
        
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(false);
    
        if (session == null || session.getAttribute("userId") == null) {
            System.out.println("No session or userId found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }
    
        String userId = (String) session.getAttribute("userId");
        System.out.println("Session userId: " + userId);
        
        Optional<User> user = userService.findById(userId);
        System.out.println("User found: " + (user.isPresent() ? "Yes" : "No"));

        if (user.isPresent()) {
            System.out.println("Returning user data: " + user.get());
            return ResponseEntity.ok(user.get());
        } else {
            System.out.println("User not found in database");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }


    @GetMapping("/myFollowing/{userId}")
public ResponseEntity<?> myFollowing(@PathVariable String userId) {
    try {
        List<User> following = userService.getFollowing(userId);
        return ResponseEntity.ok(following);
    } catch (Exception e) {
        e.printStackTrace(); // Debug info
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving following list");
    }
}

    @PostMapping("/updateAllUsersWithBio")
    public ResponseEntity<?> updateAllUsersWithBio() {
        List<User> allUsers = userService.findAllUsers();
        for (User user : allUsers) {
            if (user.getBio() == null) {
                user.setBio("");
                userService.updateUser(user);
            }
        }
        return ResponseEntity.ok("All users updated with bio field");
    }

}
