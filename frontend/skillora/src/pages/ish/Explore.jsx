import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { categoryService, postService } from '../../services/ish/api';
import PostList from '../../components/ish/PostList';

const Explore = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSkill = queryParams.get('skill');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialSkill || '');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (selectedCategory) {
          response = await postService.getPostsByCategory(selectedCategory);
        } else {
          response = await postService.getAllPosts();
        }
        
        setPosts(response.data);
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  const filteredPosts = searchTerm
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Explore Content</h1>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for posts, topics, or keywords"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Categories</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === ''
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory('')}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category.name
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold mb-2">No posts found</h3>
          <p className="text-gray-600">
            {searchTerm
              ? `No posts match your search for "${searchTerm}"`
              : selectedCategory
              ? `No posts found in the category "${selectedCategory}"`
              : 'No posts available'}
          </p>
        </div>
      ) : (
        <PostList posts={filteredPosts} />
      )}
    </div>
  );
};

export default Explore;