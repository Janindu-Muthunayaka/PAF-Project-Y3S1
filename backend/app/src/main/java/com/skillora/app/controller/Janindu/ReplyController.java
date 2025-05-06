package com.skillora.app.controller.Janindu;

import com.skillora.app.model.Janindu.Reply;
import com.skillora.app.service.Janindu.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/replies")
public class ReplyController {

    private final ReplyService replyService;

    @Autowired
    public ReplyController(ReplyService replyService) {
        this.replyService = replyService;
    }

    // Create a reply
    @PostMapping
    public ResponseEntity<Reply> createReply(@RequestBody Reply reply) {
        Reply createdReply = replyService.createReply(reply.getCommentId(), reply.getDescription(), reply.getUserId());
        return ResponseEntity.ok(createdReply);
    }

    //replies for a comment
    @GetMapping("/comment/{commentId}")
    public ResponseEntity<List<Reply>> getRepliesForComment(@PathVariable String commentId) {
        List<Reply> replies = replyService.getRepliesForComment(commentId);
        return ResponseEntity.ok(replies);
    }

    // reply by ID
    @GetMapping("/{id}")
    public ResponseEntity<Reply> getReplyById(@PathVariable String id) {
        Optional<Reply> reply = replyService.getReplyById(id);
        return reply.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //delete a reply
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReply(@PathVariable String id) {
        replyService.deleteReply(id);
        return ResponseEntity.noContent().build();
    }
}
