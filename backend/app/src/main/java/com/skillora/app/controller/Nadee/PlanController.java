package com.skillora.app.controller.Nadee;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.skillora.app.model.Nadee.Plans;
import com.skillora.app.repository.Nadee.PlanRepository;

@RestController
public class PlanController {

    @Autowired
    private PlanRepository planRepo;

    //Read all plans
    //Postmann: GET http://localhost:8080/plans
    @GetMapping("/plans")
    public ResponseEntity<?> getAllPlans() {
        List<Plans> plans = planRepo.findAll();
        if (plans.size() > 0) {
            return new ResponseEntity<List<Plans>>(plans,HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("No plans available",HttpStatus.NOT_FOUND);
        }
    }


    //Create a plan
    //Postmann: POST http://localhost:8080/plans
    @PostMapping("/plans")
    public ResponseEntity<?> createPlan(@RequestBody Plans plan){
        try {
            plan.setCreatedAt(new Date(System.currentTimeMillis()));
            planRepo.save(plan);
            return new ResponseEntity<Plans>(plan,HttpStatus.OK);
         } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
         }
    }


    //Read a single plan
    //Postmann: GET http://localhost:8080/plans/645456456456456456456456
    @GetMapping("/plans/{id}")
    public ResponseEntity<?> getSinglePlan(@PathVariable("id") String id) {
        Optional<Plans> planOptional = planRepo.findById(id);
        if (planOptional.isPresent()) {
            return new ResponseEntity<>(planOptional.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No plan available with id" +id, HttpStatus.NOT_FOUND);
        }
    }


    //Update a plan
    //Postmann: PUT http://localhost:8080/plans/645456456456456456456456
    @PutMapping("/plans/{id}")
    public ResponseEntity<?> updateById(@PathVariable("id") String id, @RequestBody Plans plan) {
        Optional<Plans> planOptional = planRepo.findById(id);
        if (planOptional.isPresent()) {
            Plans planToSave = planOptional.get();
            planToSave.setName(plan.getName());
            planToSave.setDescription(plan.getDescription() != null ? plan.getDescription() : planToSave.getDescription()); 
            planToSave.setDueDate(plan.getDueDate());
            planToSave.setCompleted(plan.getCompleted() != null ? plan.getCompleted() : planToSave.getCompleted());
            planToSave.setUpdatedAt(new Date(System.currentTimeMillis()));

            // Update resource and video URLs if provided
        if (plan.getResourceFileUrls() != null) {
            planToSave.setResourceFileUrls(plan.getResourceFileUrls());
        }
        if (plan.getVideoFileUrls() != null) {
            planToSave.setVideoFileUrls(plan.getVideoFileUrls());
        }

            planRepo.save(planToSave);
            return new ResponseEntity<>(planToSave, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No plan available with id" +id, HttpStatus.NOT_FOUND);
        }
    }


    //Delete a plan
    //Postmann: DELETE http://localhost:8080/plans/645456456456456456456456
    @DeleteMapping("/plans/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") String id) {
       try{
        planRepo.deleteById(id);
        return new ResponseEntity<>("Succesfully deleted with id"+id, HttpStatus.OK);
       } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
       }
    }

}
