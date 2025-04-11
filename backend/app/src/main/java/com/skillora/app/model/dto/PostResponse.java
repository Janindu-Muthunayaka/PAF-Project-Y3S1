package com.skillora.app.model.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.skillora.app.model.Ish.Media;

public class PostResponse {
    
    private String id;
    private String userId;
    private String title;
    private String content;
    private List<String> categories = new ArrayList<>();
    private List<Media> media = new ArrayList<>();
    private boolean isPrivate;
    private boolean isPinned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public List<String> getCategories() {
        return categories;
    }
    
    public void setCategories(List<String> categories) {
        this.categories = categories;
    }
    
    public List<Media> getMedia() {
        return media;
    }
    
    public void setMedia(List<Media> media) {
        this.media = media;
    }
    
    public boolean isPrivate() {
        return isPrivate;
    }
    
    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }
    
    public boolean isPinned() {
        return isPinned;
    }
    
    public void setPinned(boolean isPinned) {
        this.isPinned = isPinned;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}