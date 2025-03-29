package com.skillora.app.repository.Janindu;

import com.skillora.app.model.Janindu.Reaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ReactionRepository extends MongoRepository<Reaction, String> {

    // Find all reactions for a specific post
    List<Reaction> findByPostId(String postId);

    // Find a reaction by postId and userId (to check if the user already reacted)
    Optional<Reaction> findByPostIdAndUserId(String postId, String userId);
}
