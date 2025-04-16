package com.skillora.app.repository.Bumal;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillora.app.model.Bumal.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByUserName(String username);
    User findByEmail(String email);
}
