import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/skills';

// Fetch user skills
export const getSkills = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching skills:", error);
        return [];
    }
};

// Add a new skill
export const addSkill = async (skillData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}`, skillData);
        return response.data;
    } catch (error) {
        console.error("Error adding skill:", error);
        throw error;
    }
};

// Update a skill
export const updateSkill = async (skillId, skillData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${skillId}`, skillData);
        return response.data;
    } catch (error) {
        console.error("Error updating skill:", error);
        throw error;
    }
};

// Delete a skill
export const deleteSkill = async (skillId) => {
    try {
        await axios.delete(`${API_BASE_URL}/${skillId}`);
    } catch (error) {
        console.error("Error deleting skill:", error);
        throw error;
    }
};
