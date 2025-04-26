package com.skillora.app.controller.Bumal;

import com.skillora.app.model.Bumal.SkillDto;
import com.skillora.app.model.Bumal.Skill;
import com.skillora.app.service.Bumal.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "http://localhost:3000")  // Allow frontend access
public class SkillController {

    @Autowired
    private SkillService skillService;

    @PostMapping
    public Skill addSkill(@RequestBody SkillDto skillDto) {
        return skillService.addSkill(skillDto);
    }

    @GetMapping("/user/{userId}")  // Change endpoint
public List<Skill> getSkillsByUserId(@PathVariable String userId) {
    return skillService.getSkillsByUserId(userId);
}


    @PutMapping("/{skillId}")
    public Skill updateSkill(@PathVariable String skillId, @RequestBody SkillDto skillDto) {
        return skillService.updateSkill(skillId, skillDto);
    }

    @DeleteMapping("/{skillId}")
    public void deleteSkill(@PathVariable String skillId) {
        skillService.deleteSkill(skillId);
    }
}
