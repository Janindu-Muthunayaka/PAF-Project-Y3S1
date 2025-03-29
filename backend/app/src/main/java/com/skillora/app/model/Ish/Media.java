package com.skillora.app.model.Ish;

public class Media {
    
    private String url;
    private String publicId;
    private MediaType type;
    
    public enum MediaType {
        IMAGE,
        VIDEO
    }
    
    // Constructors
    public Media() {
    }
    
    public Media(String url, String publicId, MediaType type) {
        this.url = url;
        this.publicId = publicId;
        this.type = type;
    }
    
    // Getters and Setters
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
    
    public String getPublicId() {
        return publicId;
    }
    
    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }
    
    public MediaType getType() {
        return type;
    }
    
    public void setType(MediaType type) {
        this.type = type;
    }
}