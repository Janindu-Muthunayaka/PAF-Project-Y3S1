package com.skillora.app.repository.Ish;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillora.app.model.Ish.Post;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    
    List<Post> findByUserId(String userId);
    
    List<Post> findByUserIdAndIsPrivate(String userId, boolean isPrivate);
    
    List<Post> findByUserIdAndIsPinned(String userId, boolean isPinned);
    
    List<Post> findByCategories(String category);
}