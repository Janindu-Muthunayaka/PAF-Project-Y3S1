package com.skillora.app.Service;

import java.util.List;

import com.skillora.app.Exception.PlanCollectionException;
import com.skillora.app.Model.PlansDTO;

import jakarta.validation.ConstraintViolationException;

public interface PlanService {
    public void createPlan(PlansDTO plan) throws ConstraintViolationException, PlanCollectionException, ConstraintViolationException, PlanCollectionException;

    public List<PlansDTO> getAllPlans();

    public PlansDTO getSinglePlan(String id) throws PlanCollectionException;

    public void updatePlan(String id, PlansDTO plan) throws PlanCollectionException;

    public void deletePlanById(String id) throws PlanCollectionException;
}
