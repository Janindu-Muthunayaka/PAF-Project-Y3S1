package com.skillora.app.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillora.app.Exception.PlanCollectionException;
import com.skillora.app.Model.PlansDTO;
import com.skillora.app.Repo.PlanRepository;

import jakarta.validation.ConstraintViolationException;

@Service
public class PlanServiceImpl implements PlanService {

    @Autowired
    private PlanRepository planRepo;

    @Override
    public void createPlan(PlansDTO plan) throws ConstraintViolationException, PlanCollectionException { 
        Optional<PlansDTO> planOptional = planRepo.findByName(plan.getName()); 
       
        if (planOptional.isPresent()) {
            throw new PlanCollectionException("Plan with the same name already exists!"); 
        } else {
            plan.setCreatedAt(new Date(System.currentTimeMillis())); 
            planRepo.save(plan);
        }
    }

    @Override
    public List<PlansDTO> getAllPlans() {
        List<PlansDTO> plans = planRepo.findAll();
        if(plans.size() > 0) {
            return plans;
        } else {
            return new ArrayList<PlansDTO>();
        }
    }

    @Override
    public PlansDTO getSinglePlan(String id) throws PlanCollectionException {
        Optional<PlansDTO> optionalPlan = planRepo.findById(id);
        if (!optionalPlan.isPresent()) {
            throw new PlanCollectionException(PlanCollectionException.NotFoundException(id));
        } else {
            return optionalPlan.get();
        }
    }

    @Override
    public void updatePlan(String id, PlansDTO plan) throws PlanCollectionException {
       Optional<PlansDTO> planWithId = planRepo.findById(id);
        Optional<PlansDTO> planWithSameName = planRepo.findByName(plan.getName());
        
        if (planWithId.isPresent()) {
            if (planWithSameName.isPresent() && !planWithSameName.get().getId().equals(id)) {
                throw new PlanCollectionException("Plan with the same name already exists!");
            }

            PlansDTO planToUpdate = planWithId.get();

            planToUpdate.setName(plan.getName());
            planToUpdate.setDescription(plan.getDescription());
            planToUpdate.setCompleted(plan.getCompleted());
            planToUpdate.setUpdatedAt(new Date(System.currentTimeMillis()));
            planToUpdate.setDueDate(plan.getDueDate());
            planToUpdate.setPriority(plan.getPriority());
            planRepo.save(planToUpdate);
        } else {
            throw new PlanCollectionException(PlanCollectionException.NotFoundException(id));
        }
    }
    @Override
    public void deletePlanById(String id) throws PlanCollectionException {
         Optional<PlansDTO> planOptional = planRepo.findById(id);
         if (!planOptional.isPresent()) {
            throw new PlanCollectionException(PlanCollectionException.NotFoundException(id));
         } else {
            planRepo.deleteById(id);
         }
    }

}
