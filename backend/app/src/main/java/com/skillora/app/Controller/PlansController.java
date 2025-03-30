package com.skillora.app.Controller;

import java.sql.Date;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillora.app.Model.Plans;
import com.skillora.app.Repo.PlansRepo;

@RestController
@RequestMapping(value = "api/v1/")
public class PlansController {

    @Autowired
    private PlansRepo plansRepo;

    @GetMapping("/plans")
    public ResponseEntity<?> getAllPlans() {
        List<Plans> plans = plansRepo.findAll();
        if(plans.size() > 0){
            return new ResponseEntity<List<Plans>>(plans, HttpStatus.OK);
        }else{
            return new ResponseEntity<>("No plans found", HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping("/plans")
    public ResponseEntity<?> createPlan(@RequestBody Plans plan) {
        try {
            plan.setCreatedAt(new Date(System.currentTimeMillis()));
            plansRepo.save(plan);
            return new ResponseEntity<Plans>(plan, HttpStatus.CREATED);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/plans/{planId}")
    public ResponseEntity<?> getSinglePlans(@PathVariable("planId")String planId){
        Optional<Plans> planOptional = plansRepo.findById(planId);
        if (planOptional.isPresent()) {
            return new ResponseEntity<>(planOptional.get(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>("Plans not found with id " +planId,HttpStatus.NOT_FOUND);
        }
        }


    @PutMapping("/plans/{planId}")
    public ResponseEntity<?> updateById(@PathVariable("planId") String planId, @RequestBody PlansDTO plans) {
        Optional<Plans> planOptional = plansRepo.findById(planId);
        if (planOptional.isPresent()) {
            Plans plansSave = planOptional.get();
            plansSave.setCompleted(plans.getCompleted() != null? plans.getCompleted() : plansSave.getCompleted());
            plansSave.setTitle(plans.getTitle() != null? plans.getTitle() : plansSave.getTitle());
            plansSave.setDescription(plans.getDescription() != null? plans.getDescription() : plansSave.getDescription());
            plansRepo.save(plansSave);
            return new ResponseEntity<>(plansSave, HttpStatus.OK);
    }else {
            return new ResponseEntity<>("Plan not found with id " +planId,HttpStatus.NOT_FOUND);
          }
    } 


    @DeleteMapping("/plans/{planId}")
    public ResponseEntity<?> deleteById(@PathVariable("planId") String planId) {
        try {
            plansRepo.deleteById(planId);
            return new ResponseEntity<>("Successfully delete with id" +planId, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}