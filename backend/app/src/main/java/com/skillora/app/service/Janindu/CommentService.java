package com.skillora.app.service.Janindu;

import com.skillora.app.model.Janindu.Comment;
import com.skillora.app.repository.Janindu.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    // Create a new comment
    public Comment createComment(Comment comment, String postId) {
        comment.setPostId(postId);
        return commentRepository.save(comment);
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
