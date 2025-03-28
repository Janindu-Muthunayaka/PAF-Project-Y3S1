package com.skillora.app.controller.Janindu;

import com.skillora.app.model.Janindu.Reaction;
import com.skillora.app.service.Janindu.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reactions")
public class ReactionController {

    @Autowired
    private ReactionService reactionService;

    // Add or update a reaction
    @PostMapping
    public ResponseEntity<Reaction> addOrUpdateReaction(@RequestBody Reaction reaction) {
        Reaction savedReaction = reactionService.addOrUpdateReaction(reaction);
        return ResponseEntity.ok(savedReaction);
    }

    // Get all reactions for a specific post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Reaction>> getReactionsByPostId(@PathVariable String postId) {
        List<Reaction> reactions = reactionService.getReactionsByPostId(postId);
        return ResponseEntity.ok(reactions);
    }

    // Get a user's reaction to a specific post
    @GetMapping("/post/{postId}/user/{userId}")
    public ResponseEntity<Optional<Reaction>> getReactionByPostAndUser(
            @PathVariable String postId,
            @PathVariable String userId) {
        Optional<Reaction> reaction = reactionService.getReactionByPostAndUser(postId, userId);
        return ResponseEntity.ok(reaction);
    }

    // Remove a reaction
    @DeleteMapping("/post/{postId}/user/{userId}")
    public ResponseEntity<String> deleteReaction(
            @PathVariable String postId,
            @PathVariable String userId) {
        reactionService.deleteReaction(postId, userId);
        return ResponseEntity.ok("Reaction removed successfully");
    }
}
