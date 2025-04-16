package com.skillora.app.controller.Ish;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.skillora.app.model.dto.PostRequest;
import com.skillora.app.model.dto.PostResponse;
import com.skillora.app.service.Ish.PostService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;



import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    
     @Autowired
    private PostService postService;
    
    @PostMapping("/{id}")  // Add PathVariable mapping
public ResponseEntity<PostResponse> createPost(
        @PathVariable String id,  // Extract userId from URL
        @RequestPart(value = "post", required = true) String postRequestJson,
        @RequestPart(value = "files", required = false) List<MultipartFile> files) {
    try {
        // Configure ObjectMapper to ignore unknown properties
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.registerModule(new JavaTimeModule()); // For handling LocalDateTime

        PostRequest postRequest = objectMapper.readValue(postRequestJson, PostRequest.class);

        // Now pass 'id' from PathVariable instead of 'userId'
        PostResponse createdPost = postService.createPost(postRequest, files, id);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    } catch (Exception e) {
        e.printStackTrace(); // Add this for better debugging
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable String id) {
        try {
            PostResponse post = postService.getPostById(id);
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        try {
            List<PostResponse> posts = postService.getAllPosts();
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getUserPosts(@PathVariable String userId) {
        try {
            List<PostResponse> posts = postService.getUserPosts(userId);
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/user/{userId}/public")
    public ResponseEntity<List<PostResponse>> getUserPublicPosts(@PathVariable String userId) {
        try {
            List<PostResponse> posts = postService.getUserPublicPosts(userId);
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/user/{userId}/pinned")
    public ResponseEntity<List<PostResponse>> getUserPinnedPosts(@PathVariable String userId) {
        try {
            List<PostResponse> posts = postService.getUserPinnedPosts(userId);
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<PostResponse>> getPostsByCategory(@PathVariable String category) {
        try {
            List<PostResponse> posts = postService.getPostsByCategory(category);
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable String id,
            @RequestPart("post") PostRequest postRequest,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        try {
            // For now, we'll use a dummy user ID
            String userId = "dummy-user-id";
            PostResponse updatedPost = postService.updatePost(id, postRequest, files, userId);
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        try {
            // For now, we'll use a dummy user ID
            String userId = "dummy-user-id";
            postService.deletePost(id, userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}