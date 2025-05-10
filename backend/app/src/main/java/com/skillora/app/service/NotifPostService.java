package com.skillora.app.service;

import com.skillora.app.model.NotifPost.NotifPost;
import com.skillora.app.repository.NotifPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotifPostService {

    @Autowired
    private NotifPostRepository notifPostRepository;

    public NotifPost createNotifPost(String userId) {
        NotifPost notifPost = new NotifPost(userId);
        return notifPostRepository.save(notifPost);
    }

    public NotifPost getNotifPostByUserId(String userId) {
        NotifPost notifPost = notifPostRepository.findByUserId(userId);
        if (notifPost == null) {
            notifPost = createNotifPost(userId);
        }
        return notifPost;
    }

    public NotifPost addNotification(String userId, String notification) {
        NotifPost notifPost = getNotifPostByUserId(userId);
        notifPost.addNotification(notification);
        return notifPostRepository.save(notifPost);
    }

    public NotifPost clearNotifications(String userId) {
        NotifPost notifPost = getNotifPostByUserId(userId);
        notifPost.clearNotifications();
        return notifPostRepository.save(notifPost);
    }

    public List<String> getNotifications(String userId) {
        NotifPost notifPost = getNotifPostByUserId(userId);
        return notifPost.getNotifications();
    }
} 