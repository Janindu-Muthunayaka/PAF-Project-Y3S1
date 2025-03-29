package com.skillora.app.service.Janindu;

import com.skillora.app.model.Janindu.Reaction;
import com.skillora.app.repository.Janindu.ReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReactionService {

    @Autowired
    private ReactionRepository reactionRepository;

    // Add or update a reaction
    public Reaction addOrUpdateReaction(Reaction reaction) {
        Optional<Reaction> existingReaction = reactionRepository.findByPostIdAndUserId(reaction.getPostId(), reaction.getUserId());

        if (existingReaction.isPresent()) {
            Reaction updatedReaction = existingReaction.get();
            updatedReaction.setType(reaction.getType()); // Update reaction type
            return reactionRepository.save(updatedReaction);
        }

        return reactionRepository.save(reaction); // Create new reaction
    }

    // Get all reactions for a specific post
    public List<Reaction> getReactionsByPostId(String postId) {
        return reactionRepository.findByPostId(postId);
    }

    // Get a user's reaction on a specific post
    public Optional<Reaction> getReactionByPostAndUser(String postId, String userId) {
        return reactionRepository.findByPostIdAndUserId(postId, userId);
    }

    // Remove a reaction (if user wants to undo it)
    public void deleteReaction(String postId, String userId) {
        Optional<Reaction> reaction = reactionRepository.findByPostIdAndUserId(postId, userId);
        reaction.ifPresent(reactionRepository::delete);
    }
}
