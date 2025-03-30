package com.skillora.app.Controller;

import java.util.List;
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

import com.skillora.app.Exception.PlanCollectionException;
import com.skillora.app.Model.PlansDTO;
import com.skillora.app.Repo.PlanRepository;
import com.skillora.app.Service.PlanService;

import jakarta.validation.ConstraintViolationException;

@RestController
public class PlanController {

    @Autowired
    private PlanRepository planRepo;

    @Autowired
    private PlanService planService;

    @GetMapping("/plans")
    public ResponseEntity<?> getAllPlans() {
        List<PlansDTO> plans = planService.getAllPlans();
        return new ResponseEntity<>(plans, plans.size() > 0 ? HttpStatus.OK : HttpStatus.NOT_FOUND);    
    }

    @PostMapping("/plans")
    public  ResponseEntity<?> createPlan(@RequestBody PlansDTO plan) {
        try{
            
            planService.createPlan(plan);
            return new ResponseEntity<PlansDTO>(plan, HttpStatus.OK);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (PlanCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/plans/{id}")
    public ResponseEntity<?> getSinglePlan(@PathVariable("id") String id) {
        try {
            return new ResponseEntity<>(planService.getSinglePlan(id), HttpStatus.OK);
        } catch (PlanCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<?> updateById(@PathVariable("id") String id, @RequestBody PlansDTO plan) {
       try {
            planService.updatePlan(id, plan);
            return new ResponseEntity<>("Successfully plan updated with id." +id, HttpStatus.OK);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (PlanCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/plans/{id}")
        public ResponseEntity<?> deleteById(@PathVariable("id") String id) {
            try {
                planService.deletePlanById(id);
                return new ResponseEntity<>("Successfully plan deleted with id."+id, HttpStatus.OK);
            } catch (PlanCollectionException e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            }
        }

}
