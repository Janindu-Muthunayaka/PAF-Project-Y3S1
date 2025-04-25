package com.skillora.app.model.Nadee;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "plans")
public class Plans {

    @Id
    private String id;
    private String name;
    private String description;
    private Date dueDate;
    private Boolean completed;
    private Date createdAt;
    private Date updatedAt;

     // New fields to store resource and video URLs or paths
    private List<String> resourceFileUrls; // e.g., PDF, DOC, etc.
    private List<String> videoFileUrls;    // e.g., MP4, AVI, etc.

    // Constructor already provided by @AllArgsConstructor annotation

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<String> getResourceFileUrls() {
        return resourceFileUrls;
    }

    public void setResourceFileUrls(List<String> resourceFileUrls) {
        this.resourceFileUrls = resourceFileUrls;
    }

    public List<String> getVideoFileUrls() {
        return videoFileUrls;
    }

    public void setVideoFileUrls(List<String> videoFileUrls) {
        this.videoFileUrls = videoFileUrls;
    }

}

