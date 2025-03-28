package com.skillora.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillora.app.model.Category;

import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    
    Optional<Category> findByName(String name);
}