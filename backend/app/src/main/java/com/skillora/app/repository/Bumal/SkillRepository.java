package com.skillora.app.repository.Bumal;

import com.skillora.app.model.Bumal.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SkillRepository extends MongoRepository<Skill, String> {
    List<Skill> findByUserId(String userId); // Fetch skills for a specific user
}
