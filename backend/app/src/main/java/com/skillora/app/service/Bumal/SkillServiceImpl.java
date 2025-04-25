package com.skillora.app.service.Bumal;

import com.skillora.app.model.Bumal.SkillDto;
import com.skillora.app.model.Bumal.Skill;
import com.skillora.app.repository.Bumal.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SkillServiceImpl implements SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Override
public Skill addSkill(SkillDto skillDto) {
    if (skillDto.getUserId() == null || skillDto.getUserId().isEmpty()) {
        throw new IllegalArgumentException("User ID cannot be null or empty");
    }

    Skill skill = new Skill(skillDto.getUserId(), skillDto.getSkillName(), skillDto.getDescription());
    return skillRepository.save(skill);
}


    @Override
    public List<Skill> getSkillsByUserId(String userId) {
        return skillRepository.findByUserId(userId);
    }

    @Override
    public Skill updateSkill(String skillId, SkillDto skillDto) {
        Optional<Skill> existingSkill = skillRepository.findById(skillId);
        if (existingSkill.isPresent()) {
            Skill skill = existingSkill.get();
            skill.setSkillName(skillDto.getSkillName());
            skill.setDescription(skillDto.getDescription());
            return skillRepository.save(skill);
        }
        return null;
    }

    @Override
    public void deleteSkill(String skillId) {
        skillRepository.deleteById(skillId);
    }
}
