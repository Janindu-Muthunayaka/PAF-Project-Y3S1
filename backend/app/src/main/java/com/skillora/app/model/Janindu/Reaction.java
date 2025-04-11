package com.skillora.app.model.Janindu;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "reactions")
public class Reaction {
    
    @Id
    private String id;      // Unique reaction ID
    private String postId;  // The associated post's ID
    private String userId;  // The ID of the user who reacted
    private String type;    // The type of reaction (Liked, Learned, Inspired, etc.)

    // Constructors
    public Reaction(String postId, String userId, String type) {
        this.postId = postId;
        this.userId = userId;
        this.type = type;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}