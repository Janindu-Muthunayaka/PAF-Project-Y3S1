package com.skillora.app.controller.Nadee;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.skillora.app.model.Nadee.Plans;
import com.skillora.app.service.Nadee.PlanService;
import com.skillora.app.utility.PlanCollectionException;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/plans")
public class PlanController {

    @Autowired
    private PlanService planService;

    // Get all plans
    @GetMapping
    public ResponseEntity<?> getAllPlans() {
        List<Plans> plans = planService.getAllPlans();
        return new ResponseEntity<>(plans, plans.size() > 0 ? HttpStatus.OK : HttpStatus.NOT_FOUND);
    }

    // Get single plan
    @GetMapping("/{id}")
    public ResponseEntity<?> getSinglePlan(@PathVariable("id") String id) {
        try {
            Plans plan = planService.getSinglePlan(id);
            return new ResponseEntity<>(plan, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Create a plan
    @PostMapping
    public ResponseEntity<?> createPlan(@RequestBody Plans plan,@RequestHeader("user-id") String userId) {
        System.out.println("User ID: " + userId);
        System.out.println("IN post controller: " );
        try {
            planService.createPlan(userId,plan);
            return new ResponseEntity<>(plan, HttpStatus.CREATED);
        } catch (PlanCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    // Update a plan
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlan(@PathVariable("id") String id, @RequestBody Plans plan) {
        try {
            planService.updatePlan(id, plan);
            return new ResponseEntity<>("Updated plan with ID " + id, HttpStatus.OK);
        } catch (PlanCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete a plan
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") String id) {
        try {
            planService.deletePlanById(id);
            return new ResponseEntity<>("Successfully deleted plan with ID " + id, HttpStatus.OK);
        } catch (PlanCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
