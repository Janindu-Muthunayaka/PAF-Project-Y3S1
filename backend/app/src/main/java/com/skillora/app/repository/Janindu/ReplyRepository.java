package com.skillora.app.repository.Janindu;

import com.skillora.app.model.Janindu.Reply;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends MongoRepository<Reply, String> {

    // Custom query to find replies by commentId
    List<Reply> findByCommentId(String commentId);
}
