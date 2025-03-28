package com.skillora.app.service;

import com.skillora.app.model.Media;
import com.skillora.app.model.Post;
import com.skillora.app.model.dto.PostRequest;
import com.skillora.app.model.dto.PostResponse;
import com.skillora.app.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    public PostResponse createPost(PostRequest postRequest, List<MultipartFile> files, String userId) throws IOException {
        Post post = new Post();
        post.setUserId(userId);
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setCategories(postRequest.getCategories());
        post.setPrivate(postRequest.isPrivate());
        post.setPinned(postRequest.isPinned());
        
        // If this post is pinned, unpin other posts from this user
        if (post.isPinned()) {
            unpinOtherPosts(userId);
        }
        
        // Upload media files if provided
        if (files != null && !files.isEmpty()) {
            List<Media> uploadedMedia = cloudinaryService.uploadMultipleMedia(files);
            post.setMedia(uploadedMedia);
        }
        
        Post savedPost = postRepository.save(post);
        
        return convertToDto(savedPost);
    }
    
    public PostResponse getPostById(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        
        return convertToDto(post);
    }
    
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<PostResponse> getUserPosts(String userId) {
        return postRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<PostResponse> getUserPublicPosts(String userId) {
        return postRepository.findByUserIdAndIsPrivate(userId, false).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<PostResponse> getUserPinnedPosts(String userId) {
        return postRepository.findByUserIdAndIsPinned(userId, true).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<PostResponse> getPostsByCategory(String category) {
        return postRepository.findByCategories(category).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public PostResponse updatePost(String id, PostRequest postRequest, List<MultipartFile> files, String userId) throws IOException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        
        // Check if the user is the owner of the post
        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to update this post");
        }
        
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setCategories(postRequest.getCategories());
        post.setPrivate(postRequest.isPrivate());
        
        // Handle pinning
        if (!post.isPinned() && postRequest.isPinned()) {
            unpinOtherPosts(userId);
        }
        post.setPinned(postRequest.isPinned());
        
        post.setUpdatedAt(LocalDateTime.now());
        
        // If new media files are provided, delete old ones and upload new ones
        if (files != null && !files.isEmpty()) {
            // Delete old media files
            for (Media media : post.getMedia()) {
                cloudinaryService.deleteMedia(media.getPublicId(), media.getType());
            }
            
            // Upload new media files
            List<Media> uploadedMedia = cloudinaryService.uploadMultipleMedia(files);
            post.setMedia(uploadedMedia);
        }
        
        Post updatedPost = postRepository.save(post);
        
        return convertToDto(updatedPost);
    }
    
    public void deletePost(String id, String userId) throws IOException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        
        // Check if the user is the owner of the post
        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this post");
        }
        
        // Delete media files from Cloudinary
        for (Media media : post.getMedia()) {
            cloudinaryService.deleteMedia(media.getPublicId(), media.getType());
        }
        
        postRepository.delete(post);
    }
    
    private void unpinOtherPosts(String userId) {
        List<Post> pinnedPosts = postRepository.findByUserIdAndIsPinned(userId, true);
        for (Post pinnedPost : pinnedPosts) {
            pinnedPost.setPinned(false);
            pinnedPost.setUpdatedAt(LocalDateTime.now());
            postRepository.save(pinnedPost);
        }
    }
    
    private PostResponse convertToDto(Post post) {
        PostResponse dto = new PostResponse();
        dto.setId(post.getId());
        dto.setUserId(post.getUserId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setCategories(post.getCategories());
        dto.setMedia(post.getMedia());
        dto.setPrivate(post.isPrivate());
        dto.setPinned(post.isPinned());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }
}