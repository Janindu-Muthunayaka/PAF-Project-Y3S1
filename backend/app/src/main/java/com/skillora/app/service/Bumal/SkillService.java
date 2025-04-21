package com.skillora.app.service.Bumal;

import com.skillora.app.model.Bumal.SkillDto;
import com.skillora.app.model.Bumal.Skill;
import java.util.List;

public interface SkillService {
    Skill addSkill(SkillDto skillDto);
    List<Skill> getSkillsByUserId(String userId);
    Skill updateSkill(String skillId, SkillDto skillDto);
    void deleteSkill(String skillId);
}
