package com.skillora.app.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PostRequest {
    
    private String title;
    private String content;
    private List<String> categories = new ArrayList<>();
    
    // Use @JsonProperty to handle both "private" and "isPrivate" in JSON
    @JsonProperty(value = "private")
    private boolean isPrivate;
    
    // Use @JsonProperty to handle both "pinned" and "isPinned" in JSON
    @JsonProperty(value = "pinned")
    private boolean isPinned;
    
    // Setter that can handle both "private" and "isPrivate"
    @JsonProperty("isPrivate")
    public void setIsPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }
    
    // Setter that can handle both "pinned" and "isPinned"
    @JsonProperty("isPinned")
    public void setIsPinned(boolean isPinned) {
        this.isPinned = isPinned;
    }
    
    // Regular getters and setters
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
}