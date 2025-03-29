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
//Reaction service
export const reactionService = {
  addReaction: (postId, userId, type) => {
    const reaction = { postId, userId, type };
    return axios.post(`${API_URL}/reactions`, reaction);
  },
  
  getPostReactions: (postId) => {
    return axios.get(`${API_URL}/reactions/post/${postId}`);
  },
  
  getUserReaction: (postId, userId) => {
    return axios.get(`${API_URL}/reactions/post/${postId}/user/${userId}`);
  },
  
  deleteReaction: (postId, userId) => {
    return axios.delete(`${API_URL}/reactions/post/${postId}/user/${userId}`);
  }
};
// Comment Service
export const commentService = {

  createComment: (postId, userId, description) => {
    const comment = { postId, userId, description };
    console.log("Comment payload:", comment);
    return axios.post(`${API_URL}/comments/${postId}`, comment);
  },


  getCommentsByPostId: (postId) => {
    return axios.get(`${API_URL}/comments/${postId}`);
  },

  deleteComment: (commentId) => {
    return axios.delete(`${API_URL}/comments/${commentId}`);
  },

  updateComment: (commentId, updatedContent) => {
    const updatedComment = { description: updatedContent };
    console.log("Comment payload:", updatedComment);
    return axios.put(`${API_URL}/comments/${commentId}`, updatedComment);
  }
};
// Reply Service
export const replyService = {

  createReply: (commentId, userId, description) => {
    return axios.post(`${API_URL}/replies?commentId=${commentId}&description=${description}&userId=${userId}`);
  },

  getRepliesForComment: (commentId) => {
    return axios.get(`${API_URL}/replies/comment/${commentId}`);
  },

  getReplyById: (id) => {
    return axios.get(`${API_URL}/replies/${id}`);
  },

  deleteReply: (id) => {
    return axios.delete(`${API_URL}/replies/${id}`);
  }
};


export default api;