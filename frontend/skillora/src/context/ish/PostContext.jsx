import { createContext, useState, useContext, useEffect } from 'react';
import { postService } from '../../services/ish/api';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts();
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData, files) => {
    try {
      setLoading(true);
      const response = await postService.createPost(postData, files);
      setPosts([response.data, ...posts]);
      return response.data;
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id, postData, files) => {
    try {
      setLoading(true);
      const response = await postService.updatePost(id, postData, files);
      setPosts(posts.map(post => post.id === id ? response.data : post));
      return response.data;
    } catch (err) {
      setError('Failed to update post');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    try {
      setLoading(true);
      await postService.deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider 
      value={{ 
        posts, 
        loading, 
        error, 
        fetchPosts, 
        createPost,
        updatePost,
        deletePost 
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => useContext(PostContext);