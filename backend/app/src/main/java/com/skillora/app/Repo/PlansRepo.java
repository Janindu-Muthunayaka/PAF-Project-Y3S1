package com.skillora.app.Repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillora.app.Model.Plans;

@Repository
public interface PlansRepo extends MongoRepository<Plans, String> {  

}
