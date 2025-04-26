package com.skillora.app.service.Nadee;

import java.util.List;

import com.skillora.app.model.Nadee.Plans;
import com.skillora.app.utility.PlanCollectionException;


public interface PlanService {

    public void createPlan(String userId,Plans plans) throws PlanCollectionException;

    public List<Plans> getAllPlans();

    public Plans getSinglePlan(String id) throws PlanCollectionException;

    public void updatePlan(String id, Plans plans) throws PlanCollectionException;

    public void deletePlanById(String id) throws PlanCollectionException;

}
