package com.skillora.app.model.NotifPost;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "notifposts")
public class NotifPost {
    @Id
    private String id;
    private String userId;
    private List<String> notifications;

    public NotifPost() {
        this.notifications = new ArrayList<>();
    }

    public NotifPost(String userId) {
        this.userId = userId;
        this.notifications = new ArrayList<>();
    }

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

    public List<String> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<String> notifications) {
        this.notifications = notifications;
    }

    public void addNotification(String notification) {
        this.notifications.add(notification);
    }

    public void clearNotifications() {
        this.notifications.clear();
    }
} 