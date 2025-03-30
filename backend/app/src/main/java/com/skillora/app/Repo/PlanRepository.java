package com.skillora.app.Repo;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.skillora.app.Model.PlansDTO;

@Repository
public interface PlanRepository extends MongoRepository<PlansDTO, String> {

    @Query("{'plan' : ?0}")
    Optional<PlansDTO> findByName(String name);

}
