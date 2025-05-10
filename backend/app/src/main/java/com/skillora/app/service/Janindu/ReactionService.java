package com.skillora.app.service.Janindu;

import com.skillora.app.model.Janindu.Reaction;
import com.skillora.app.repository.Janindu.ReactionRepository;
import com.skillora.app.service.NotifPostService;
import com.skillora.app.service.Bumal.UserService;
import com.skillora.app.repository.Ish.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReactionService {

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private NotifPostService notifPostService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostRepository postRepository;

    // Add or update a reaction
    public Reaction addOrUpdateReaction(Reaction reaction) {
        Optional<Reaction> existingReaction = reactionRepository.findByPostIdAndUserId(reaction.getPostId(), reaction.getUserId());

        if (existingReaction.isPresent()) {
            Reaction updatedReaction = existingReaction.get();
            updatedReaction.setType(reaction.getType()); // Update reaction type
            return reactionRepository.save(updatedReaction);
        }

        // Get username for notification
        String username = userService.findById(reaction.getUserId()).get().getUserName();
        
        // Get post owner's user ID
        String postOwnerId = postRepository.findById(reaction.getPostId()).get().getUserId();
        
        // Add notification for the post owner
        String notification = String.format("%s reacted to your post with %s", username, reaction.getType());
        notifPostService.addNotification(postOwnerId, notification);

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
