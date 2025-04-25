package com.skillora.app.service.Janindu;

import com.skillora.app.model.Janindu.Reply;
import com.skillora.app.repository.Janindu.ReplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReplyService {

    private final ReplyRepository replyRepository;

    @Autowired
    public ReplyService(ReplyRepository replyRepository) {
        this.replyRepository = replyRepository;
    }

    // Create a new reply
    public Reply createReply(String commentId, String description, String userId) {
        Reply reply = new Reply(commentId, description, userId);
        return replyRepository.save(reply);
    }

    // replies for a comment
    public List<Reply> getRepliesForComment(String commentId) {
        return replyRepository.findByCommentId(commentId);
    }

    //specific reply by ID
    public Optional<Reply> getReplyById(String id) {
        return replyRepository.findById(id);
    }

    // Delete a reply
    public void deleteReply(String id) {
        replyRepository.deleteById(id);
    }
}
