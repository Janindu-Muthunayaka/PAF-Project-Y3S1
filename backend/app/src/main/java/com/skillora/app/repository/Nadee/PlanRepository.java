package com.skillora.app.repository.Nadee;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillora.app.model.Nadee.Plans;

@Repository
public interface PlanRepository extends MongoRepository<Plans, String> {

}
