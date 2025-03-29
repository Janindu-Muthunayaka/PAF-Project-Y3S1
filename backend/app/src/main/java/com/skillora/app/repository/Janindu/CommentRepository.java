package com.skillora.app.repository.Janindu;

import com.skillora.app.model.Janindu.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {


    List<Comment> findByPostId(String postId);

   //note - implement later if have time
    List<Comment> findByUserId(String userId);
}
