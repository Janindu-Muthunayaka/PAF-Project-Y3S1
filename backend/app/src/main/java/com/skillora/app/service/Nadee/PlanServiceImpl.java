package com.skillora.app.service.Nadee;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillora.app.model.Nadee.Plans;
import com.skillora.app.repository.Nadee.PlanRepository;
import com.skillora.app.utility.PlanCollectionException;

@Service
public class PlanServiceImpl implements PlanService {

    @Autowired
    private PlanRepository planRepo;

    

    @Override
    public void createPlan(Plans plans) throws PlanCollectionException {
        Optional<Plans> planOptional = planRepo.findByName(plans.getName());
        if (planOptional.isPresent()) {
            throw new PlanCollectionException(PlanCollectionException.PlanAllreadyExists());
        } else {
            plans.setCreatedAt(new Date(System.currentTimeMillis()));
            plans.setUpdatedAt(new Date(System.currentTimeMillis()));
            planRepo.save(plans);
        }
    }



    @Override
    public List<Plans> getAllPlans() {
       List<Plans> plans = planRepo.findAll();
       if(plans.size() > 0){
        return plans;
       }else{
        return new ArrayList<Plans>();
       }
    }



    @Override
    public Plans getSinglePlan(String id) throws PlanCollectionException {
        Optional<Plans> optionalPlans = planRepo.findById(id);
        if (!optionalPlans.isPresent()) {
            throw new PlanCollectionException(PlanCollectionException.NotFoundException(id));
        } else {
            return optionalPlans.get();
        }
    }



    @Override
    public void updatePlan(String id, Plans plans) throws PlanCollectionException {
        Optional<Plans> planWithId = planRepo.findById(id);
        Optional<Plans> planWithSameName = planRepo.findByName(plans.getName());
        if(planWithId.isPresent()){
            if(planWithSameName.isPresent() && !planWithSameName.get().getId().equals(id)){
                throw new PlanCollectionException(PlanCollectionException.PlanAllreadyExists());
            }

            Plans updateToPlan = planWithId.get();
    
            updateToPlan.setName(plans.getName());
            updateToPlan.setDescription(plans.getDescription());
            updateToPlan.setDueDate(plans.getDueDate());
            updateToPlan.setUpdatedAt(new Date(System.currentTimeMillis()));
            
            updateToPlan.setResourceFileUrls(plans.getResourceFileUrls());  // Single resource file URL
            updateToPlan.setVideoFileUrls(plans.getVideoFileUrls());        // Single video file URL
            
            planRepo.save(updateToPlan);

        }else{
            throw new PlanCollectionException(PlanCollectionException.NotFoundException(id));
    
    }


}



    @Override
    public void deletePlanById(String id) throws PlanCollectionException {
       Optional<Plans> planOptional = planRepo.findById(id);
        if(!planOptional.isPresent()){
            throw new PlanCollectionException(PlanCollectionException.NotFoundException(id));
        }else{
            planRepo.deleteById(id);
        }
    }

}
