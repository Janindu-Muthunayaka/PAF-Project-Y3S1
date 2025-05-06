package com.skillora.app.model.Bumal;

public class SkillDto {
    private String userId;
    private String skillName;
    private String description;

    // Constructors
    public SkillDto() {}

    public SkillDto(String userId, String skillName, String description) {
        this.userId = userId;
        this.skillName = skillName;
        this.description = description;
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

