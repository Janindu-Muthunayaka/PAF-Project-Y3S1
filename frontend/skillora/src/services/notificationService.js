import axios from 'axios';

const API_URL = 'http://localhost:8080/api/notifications';

export const notificationService = {
    getNotifications: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    addNotification: async (userId, notification) => {
        try {
            const response = await axios.post(`${API_URL}/${userId}`, notification);
            return response.data;
        } catch (error) {
            console.error('Error adding notification:', error);
            throw error;
        }
    },

    clearNotifications: async (userId) => {
        try {
            const response = await axios.delete(`${API_URL}/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error clearing notifications:', error);
            throw error;
        }
    }
}; 