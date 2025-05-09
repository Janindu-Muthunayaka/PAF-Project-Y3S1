package com.skillora.app.repository;

import com.skillora.app.model.NotifPost.NotifPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotifPostRepository extends MongoRepository<NotifPost, String> {
    NotifPost findByUserId(String userId);
} 