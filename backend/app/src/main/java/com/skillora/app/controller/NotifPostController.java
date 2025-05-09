package com.skillora.app.controller;

import com.skillora.app.model.NotifPost.NotifPost;
import com.skillora.app.service.NotifPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotifPostController {

    @Autowired
    private NotifPostService notifPostService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<String>> getNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notifPostService.getNotifications(userId));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<NotifPost> addNotification(
            @PathVariable String userId,
            @RequestBody String notification) {
        return ResponseEntity.ok(notifPostService.addNotification(userId, notification));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<NotifPost> clearNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notifPostService.clearNotifications(userId));
    }
} 