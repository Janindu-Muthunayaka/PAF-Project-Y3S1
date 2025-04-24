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
import com.skillora.app.service.Nadee.PlanService;
import com.skillora.app.utility.PlanCollectionException;

@RestController
public class PlanController {

    @Autowired
    private PlanRepository planRepo;

    @Autowired
    private PlanService planService;

    //Read all plans
    //Postmann: GET http://localhost:8080/plans
    @GetMapping("/plans")
    public ResponseEntity<?> getAllPlans() {
        List<Plans> plans = planService.getAllPlans();
        return new ResponseEntity<>(plans, plans.size() > 0 ? HttpStatus.OK : HttpStatus.NOT_FOUND);
    }


    //Create a plan
    //Postmann: POST http://localhost:8080/plans
    @PostMapping("/plans")
    public ResponseEntity<?> createPlan(@RequestBody Plans plan){
        try {
            planService.createPlan(plan);
            planRepo.save(plan);
            return new ResponseEntity<Plans>(plan,HttpStatus.OK);
         } catch (PlanCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
         }
    }


    //Read a single plan
    //Postmann: GET http://localhost:8080/plans/645456456456456456456456
    @GetMapping("/plans/{id}")
    public ResponseEntity<?> getSinglePlan(@PathVariable("id") String id) {
        try{
            return new ResponseEntity<>(planService.getSinglePlan(id), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        
    }

    //Update a plan
    //postmann: PUT http://localhost:8080/plans/680a8e9c8c5b732e2ef53f06
    @PutMapping("/plans/{id}")
    public ResponseEntity<?> updateById(@PathVariable("id") String id, @RequestBody Plans plan) {
        try {
            planService.updatePlan(id, plan);
            return new ResponseEntity<>("Update to do with id" +id, HttpStatus.OK);
        } catch (PlanCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }


    //Delete a plan
    //Postmann: DELETE http://localhost:8080/plans/645456456456456456456456
    @DeleteMapping("/plans/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") String id) {
       try{
            planService.deletePlanById(id);
            return new ResponseEntity<>("Succesfully deleted with id"+id, HttpStatus.OK);
       } catch (PlanCollectionException e) {
           return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
       }
    }

}
