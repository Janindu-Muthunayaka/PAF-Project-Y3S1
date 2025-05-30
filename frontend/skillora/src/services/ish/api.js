import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This makes sure cookies are sent with the request
});

// Post services
export const postService = {
  getAllPosts: () => api.get('/posts'),
  getPostById: (id) => api.get(`/posts/${id}`),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  getUserPinnedPosts: (userId) => api.get(`/posts/user/${userId}/pinned`),
  getPostsByCategory: (category) => api.get(`/posts/category/${category}`),
  createPost: (id, postData, files) => {
    const formData = new FormData();
    const postBlob = new Blob([JSON.stringify(postData)], { type: 'application/json' });
    
    formData.append('post', postBlob);
    
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    return axios.post(`${API_URL}/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updatePost: (userId, id, postData, files) => {
    const formData = new FormData();
    const postBlob = new Blob([JSON.stringify(postData)], { type: 'application/json' });

    formData.append('post', postBlob);

    //testing to be removed
    console.log("Updating post with ID:", id);
    console.log("User ID:", userId);
    console.log("Post Data:", postData);

    if (files && files.length > 0) {
        files.forEach(file => {
            formData.append('files', file);
        });
    }

    return axios.put(`${API_URL}/posts/${id}`, formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
          'userId': userId, // Include userId as a header
      },
  });
  
},
deletePost: (userId, id) => {
  //testing to be removed
  console.log("Updating post with ID:", id);
  console.log("User ID:", userId);

  return api.delete(`/posts/${id}`, {
  headers: { 'userId': userId },
  }).catch(err => {
    console.error("Delete failed in api.js:", err);
    throw err; // rethrow so it's caught in the frontend try/catch
  });
},
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
    const replyData = { commentId, userId, description };
    return axios.post(`${API_URL}/replies`, replyData);
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
// User services
export const userService = {
  // Registration
  register: (userData) => api.post('/users/register', userData),
  
  // Google sign up
  googleSignUp: (googleUserData) => api.post('/users/googleSignUp', googleUserData),
  
  // Login
  login: (credentials) => api.post('/users/login', credentials),
  
  // Logout
  logout: () => {
    sessionStorage.removeItem('userData');
    return api.post('/users/logout');
  },
  
  // Get session user
  getSessionUser: () => api.get('/users/session/user'),
  
  // Get all users
  getAllUsers: () => api.get('/users/allUsers'),
  
  // Get user by email
  getUserByEmail: (email) => api.get(`/users/getUserByEmail/${email}`),
  
  // Get user by ID
  getUserById: (id) => api.get(`/users/getUserById/${id}`),
  
  // Follow a user
  followUser: (user1Id, user2Id) => {
    const followData = { user1: user1Id, user2: user2Id };
    return api.post('/users/follow', followData);
  },
  
  // Get followers
  getFollowers: (userId) => api.get(`/users/myFollowers/${userId}`),

  // Get following
  getFollowing: (userId) => api.get(`/users/myFollowing/${userId}`),
  
  // Unfollow a user
  unfollowUser: (user1Id, user2Id) => {
    const unfollowData = { user1: user1Id, user2: user2Id };
    return api.post('/users/unfollow', unfollowData);
  },
  
  // Update user
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  
  // Update profile picture
  updateProfilePic: (userId, profilePicLink) => {
    const profileData = { profilePicLink };
    return api.put(`/users/updateProfilePic/${userId}`, profileData);
  },
  
  // Delete user
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  
  // Get usernames by IDs
  getUsernames: (userIds) => api.post('/users/getUsersNames', userIds),

  // OAuth2 user data
  getOAuth2User: () => api.get('/oauth2/user'),
};


//Plans Services
export const planService = {
  // Create a new plan
  createPlan: async (formData) => {
    const res = await api.post('/plans', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Get all plans
  getAllPlans: async () => {
    const res = await api.get('/plans');
    return res.data;
  },

  // Get a single plan by ID
  getSinglePlan: async (id) => {
    const res = await api.get(`/plans/${id}`);
    return res.data;
  },

  // Update a plan
  updatePlan: async (id, formData) => {
    const res = await api.put(`/plans/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Delete a plan by ID
  deletePlanById: async (id) => {
    const res = await api.delete(`/plans/${id}`);
    return res.data;
  },
};
// Function to get user data from the session
export const sessionId = {
  getUserData: () => fetch('/api/users/session/user', {
    credentials: 'include' // 
  }).then(res => {
    if (!res.ok) throw new Error('Failed to fetch session user'); // proper error handling
    return res.json(); //  parse JSON if successful
  }),
};

export default api;