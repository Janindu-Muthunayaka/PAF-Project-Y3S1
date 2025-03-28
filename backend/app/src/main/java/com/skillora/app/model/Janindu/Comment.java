package com.skillora.app.model.Janindu;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    @Field("description")
    private String description;

    @Field("user_id")
    private String userId;

    @Field("post_id")
    private String postId;

    @Field("edited")
    private boolean edited;  // Flag to check if comment was edited

    // Constructors
    public Comment() {
        this.edited = false;  // By default, comments are not edited
    }

    public Comment(String postId, String description, String userId) {
        this.postId = postId;
        this.description = description;
        this.userId = userId;
        this.edited = false;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public boolean isEdited() {
        return edited;
    }

    public void setEdited(boolean edited) {
        this.edited = edited;
    }
}
