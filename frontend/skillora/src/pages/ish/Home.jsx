import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiImage, FiVideo, FiPaperclip, FiTrendingUp, FiUsers, FiBookOpen, FiRefreshCw, FiFilter ,FiSearch } from 'react-icons/fi';
import { useUser } from '../../context/ish/UserContext';
import { usePost } from '../../context/ish/PostContext';
import PostList from '../../components/ish/PostList';
import TrendingSkills from '../../components/ish/TrendingSkills';
import PeopleToFollow from '../../components/ish/PeopleToFollow';
import PopularLearningPlans from '../../components/ish/PopularLearningPlans';
import Avatar from '../../components/ish/ui/Avatar';
import Button from '../../components/ish/ui/Button';
import { categoryService } from '../../services/ish/api';

const Home = () => {
  const { user } = useUser();
  const { posts, loading, error, fetchPosts } = usePost();
  const navigate = useNavigate();
  console.log(" This is the working User ID:", user);
  
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  

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

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      // Filter by search term
      if (searchTerm && !post.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !post.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by category
      if (selectedCategory && !post.categories.includes(selectedCategory)) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      
      return 0;
    });
  
  const goToCreatePost = () => {
    navigate('/create-post');
  };

  const handleRefresh = () => {
    fetchPosts();
    toast.info('Feed refreshed!');
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Sidebar - User Profile */}
      <div className="lg:col-span-3 space-y-6">
        <div className="card">
          <div className="p-5">
            <div className="flex flex-col items-center mb-4">
            <Avatar
  src={user.avatar}
  name={user.firstName}
  size="xl"
  className="mb-3"
  fallback={user.firstName ? user.firstName.charAt(0).toUpperCase() : '?'}
/>
              <h2 className="text-xl font-semibold text-white">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-gray-400">@{user.userName}</p>
            </div>

            <div className="border-t border-[var(--dark-border)] border-b py-3 mb-3">
              <div className="flex justify-around">
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{user.followers ? user.followers.length : 0}</p>
                  <p className="text-gray-400 text-sm">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{user.following ? user.following.length : 0}</p>
                  <p className="text-gray-400 text-sm">Followers</p>
                </div>
              </div>
            </div>

            <Button
              to={`/profile/${user.id}`}
              variant="outline"
              fullWidth
              className="mb-8"
            >
              View profile
            </Button>

            <div className="mt-2">
              <h3 className="font-semibold text-white mb-6">Quick Links</h3>
              <ul className="space-y-4 ">
                <li>
                  <Link to="/saved-posts" className="mt-8 flex items-center text-gray-300 hover:text-white transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                    <span>Saved Posts</span>
                  </Link>
                </li>
                <li>
                  <Link to="/drafts" className="flex items-center text-gray-300 hover:text-white transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <span>My Drafts</span>
                  </Link>
                </li>
                <li>
                  <Link to="/history" className="flex items-center text-gray-300 hover:text-white transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Learning History</span>
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="flex items-center text-gray-300 hover:text-white transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Center - Posts */}
      <div className="lg:col-span-6 space-y-6">
        {/* Create Post Card */}
        <div className="card">
          <div className="p-5">
            <div className="flex items-center gap-3">
            <Avatar
  src={user.avatar}
  name={user.firstName}
  size="md"
  fallback={user.firstName ? user.firstName.charAt(0).toUpperCase() : '?'}
/>
              <div 
                onClick={goToCreatePost}
                className="flex-1 bg-[var(--dark-surface-light)] rounded-full py-3 px-5 text-gray-400 cursor-pointer hover:bg-opacity-80 transition-colors"
              >
                Share a skill or knowledge...
              </div>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-[var(--dark-border)]">
              <div className="flex space-x-4">
                <button onClick={goToCreatePost} className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <FiImage className="mr-2" />
                  <span>Image</span>
                </button>
                <button onClick={goToCreatePost} className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <FiVideo className="mr-2" />
                  <span>Video</span>
                </button>
                <button onClick={goToCreatePost} className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <FiPaperclip className="mr-2" />
                  <span>Attach</span>
                </button>
              </div>
              <Button
                variant="primary"
                onClick={goToCreatePost}
              >
                Create Post
              </Button>
            </div>
          </div>
        </div>

        {/* Post Feed Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FiFilter />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FiRefreshCw />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input py-2 px-4 pl-9 w-full"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="card">
            <div className="p-5">
              <h3 className="font-medium text-white mb-4">Filter Posts</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        selectedCategory === '' 
                          ? 'bg-[var(--primary)] text-white' 
                          : 'bg-[var(--dark-surface-light)] text-gray-300 hover:bg-opacity-80'
                      } transition-colors`}
                      onClick={() => setSelectedCategory('')}
                    >
                      All
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          selectedCategory === category.name 
                            ? 'bg-[var(--primary)] text-white' 
                            : 'bg-[var(--dark-surface-light)] text-gray-300 hover:bg-opacity-80'
                        } transition-colors`}
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                  <div className="flex space-x-2">
                    <button
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        sortBy === 'newest' 
                          ? 'bg-[var(--primary)] text-white' 
                          : 'bg-[var(--dark-surface-light)] text-gray-300 hover:bg-opacity-80'
                      } transition-colors`}
                      onClick={() => setSortBy('newest')}
                    >
                      Newest
                    </button>
                    <button
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        sortBy === 'oldest' 
                          ? 'bg-[var(--primary)] text-white' 
                          : 'bg-[var(--dark-surface-light)] text-gray-300 hover:bg-opacity-80'
                      } transition-colors`}
                      onClick={() => setSortBy('oldest')}
                    >
                      Oldest
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post Feed */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="card p-5 bg-[#471F1F] border border-[#D95757] text-white">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-[#F87171] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Error Loading Posts</h3>
              <p className="text-[#FDA5A5] mb-4">{error}</p>
              <Button 
                variant="primary"
                onClick={handleRefresh}
                leftIcon={<FiRefreshCw />}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="card">
            <div className="p-8 text-center">
              <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm 
                  ? `No results found for "${searchTerm}"`
                  : selectedCategory
                  ? `No posts found in category "${selectedCategory}"`
                  : "Be the first to share your knowledge!"}
              </p>
              <Button
                variant="primary"
                onClick={goToCreatePost}
              >
                Create Your First Post
              </Button>
            </div>
          </div>
        ) : (
          <PostList posts={filteredPosts} />
        )}
      </div>

      {/* Right Sidebar - Trending & Recommendations */}
      <div className="lg:col-span-3 space-y-6">
        <div className="card">
          <div className="">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FiTrendingUp className="text-[var(--primary)] mr-3 mb-3" />
                <h3 className="text-base font-semibold text-white">Trending Skills</h3>
              </div>
             
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-200">React Native</span>
                  <span className="ml-3 text-xs font-medium px-1.5 py-0.5 rounded bg-[var(--success)] bg-opacity-20 text-[var(--success)]">+15%</span>
                </div>
                <Link to="/explore?skill=react-native" className="text-[var(--primary-light)] hover:underline text-xs">
                  Explore
                </Link>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-200">Data Visual</span>
                  <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded bg-[var(--success)] bg-opacity-20 text-[var(--success)]">+8%</span>
                </div>
                <Link to="/explore?skill=data-visualization" className="text-[var(--primary-light)] hover:underline text-xs">
                  Explore
                </Link>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-200">JAVA</span>
                  <span className="ml-10 text-xs font-medium px-1.5 py-0.5 rounded bg-[var(--success)] bg-opacity-20 text-[var(--success)]">+12%</span>
                </div>
                <Link to="/explore?skill=aws-lambda" className="text-[var(--primary-light)] hover:underline text-xs">
                  Explore
                </Link>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-200">TypeScript</span>
                  <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded bg-[var(--success)] bg-opacity-20 text-[var(--success)]">+10%</span>
                </div>
                <Link to="/explore?skill=typescript" className="text-[var(--primary-light)] hover:underline text-xs">
                  Explore
                </Link>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-200">User Research</span>
                  <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded bg-[var(--success)] bg-opacity-20 text-[var(--success)]">+7%</span>
                </div>
                <Link to="/explore?skill=user-research" className="text-[var(--primary-light)] hover:underline text-xs">
                  Explore
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FiUsers className="text-[var(--secondary)] mr-3 mb-3" />
                <h3 className="text-base font-semibold text-white ">People Follow</h3>
              </div>
              <Link to="/network" className="text-[var(--primary-light)] hover:underline text-xs mb-3">
                See All
              </Link>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar name="Madusanka HPI" size="md" className="mr-3 mb-4" />
                  <div>
                    <Link to="/profile/1" className="font-medium text-white hover:underline">Ish Madus</Link>
                    <p className="text-gray-400 text-xs">Data Scientist</p>
                  </div>
                </div>
                <Button variant="outline" size="xs"  className="mb-4">
                  Follow
                </Button>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar name="Dewmini S" size="md" className="mr-3 mb-4" />
                  <div>
                    <Link to="/profile/1" className="font-medium text-white hover:underline">Dewmini S</Link>
                    <p className="text-gray-400 text-xs">Data Engineer</p>
                  </div>
                </div>
                <Button variant="outline" size="xs"  className="mb-4">
                  Follow
                </Button>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar name="Janindu M" size="md" className="mr-3 mb-4" />
                  <div>
                    <Link to="/profile/1" className="font-medium text-white hover:underline">Janindu M</Link>
                    <p className="text-gray-400 text-xs">CEO & Tech Billonaire Data Scientist</p>
                  </div>
                </div>
                <Button variant="outline" size="xs"  className="mb-4">
                  Follow
                </Button>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar name="Erandi R" size="md" className="mr-3 mb-4" />
                  <div>
                    <Link to="/profile/1" className="font-medium text-white hover:underline">Erandi R</Link>
                    <p className="text-gray-400 text-xs">Senior Finance Executive</p>
                  </div>
                </div>
                <Button variant="outline" size="xs"  className="mb-4">
                  Follow
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FiBookOpen className="text-[var(--primary)] mr-3 mb-3 w-12" />
                <h3 className="text-lg font-semibold text-white">Learning</h3>
              </div>
              <Link to="/learning-plans" className="text-[var(--primary-light)] hover:underline text-xs mb-3">
                Browse All
              </Link>
            </div>
            <ul className="space-y-4">
              <li className="border-b border-[var(--dark-border)] pb-4 last:border-0 last:pb-0">
                <Link to="/learning-plans/1" className="block group">
                  <h3 className="font-small text-white group-hover:text-[var(--primary-light)]">Machine Learning Fundamentals</h3>
                  <p className="text-gray-400 text-sm mt-1">by Emma Thompson</p>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i}
                          className={`w-4 h-4 ${i < 5 ? 'text-amber-400' : 'text-gray-600'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs ml-2">(128 reviews)</span>
                    <span className="text-gray-400 text-xs ml-3">1.2k enrolled</span>
                  </div>
                </Link>
              </li>
              <li className="border-b border-[var(--dark-border)] pb-4 last:border-0 last:pb-0">
                <Link to="/learning-plans/2" className="block group">
                  <h3 className="font-medium text-white group-hover:text-[var(--primary-light)]">Web Accessibility Masterclass</h3>
                  <p className="text-gray-400 text-sm mt-1">by Carlos Rodriguez</p>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i}
                          className={`w-4 h-4 ${i < 4 ? 'text-amber-400' : 'text-gray-600'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs ml-2">(95 reviews)</span>
                    <span className="text-gray-400 text-xs ml-3">842 enrolled</span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;