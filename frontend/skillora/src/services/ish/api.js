import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Post services
export const postService = {
  getAllPosts: () => api.get('/posts'),
  getPostById: (id) => api.get(`/posts/${id}`),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  getUserPinnedPosts: (userId) => api.get(`/posts/user/${userId}/pinned`),
  getPostsByCategory: (category) => api.get(`/posts/category/${category}`),
  createPost: (postData, files) => {
    const formData = new FormData();
    const postBlob = new Blob([JSON.stringify(postData)], { type: 'application/json' });
    
    formData.append('post', postBlob);
    
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    return axios.post(`${API_URL}/posts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updatePost: (id, postData, files) => {
    const formData = new FormData();
    const postBlob = new Blob([JSON.stringify(postData)], { type: 'application/json' });
    
    formData.append('post', postBlob);
    
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    return axios.put(`${API_URL}/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deletePost: (id) => api.delete(`/posts/${id}`),
};

// Category services
export const categoryService = {
  getAllCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  getCategoryByName: (name) => api.get(`/categories/name/${name}`),
  createCategory: (category) => api.post('/categories', category),
  updateCategory: (id, category) => api.put(`/categories/${id}`, category),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export default api;