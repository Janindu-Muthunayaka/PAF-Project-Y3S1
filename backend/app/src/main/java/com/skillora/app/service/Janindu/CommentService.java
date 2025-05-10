package com.skillora.app.service.Janindu;

import com.skillora.app.model.Janindu.Comment;
import com.skillora.app.repository.Janindu.CommentRepository;
import com.skillora.app.service.NotifPostService;
import com.skillora.app.service.Bumal.UserService;
import com.skillora.app.repository.Ish.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    @Autowired
    private NotifPostService notifPostService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostRepository postRepository;

    
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    // Create a new comment
    public Comment createComment(Comment comment, String postId) {
        comment.setPostId(postId);
        Comment savedComment = commentRepository.save(comment);

        // Get username for notification
        String username = userService.findById(comment.getUserId()).get().getUserName();
        
        // Get post owner's user ID
        String postOwnerId = postRepository.findById(postId).get().getUserId();
        
        // Add notification for the post owner
        String notification = String.format("%s commented on your post", username);
        notifPostService.addNotification(postOwnerId, notification);

        return savedComment;
    }

    // Get all comments by postId
    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    // Delete a comment by ID
    public boolean deleteComment(String commentId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        if (comment.isPresent()) {
            commentRepository.deleteById(commentId);
            return true;
        }
        return false;
    }

    // Update an existing comment
    public Comment updateComment(String commentId, Comment updatedComment) {
        Optional<Comment> existingComment = commentRepository.findById(commentId);
        if (existingComment.isPresent()) {
            Comment comment = existingComment.get();
            comment.setDescription(updatedComment.getDescription());
            comment.setEdited(true);  // Mark as edited
            return commentRepository.save(comment);
        }
        return null;
    }
}
