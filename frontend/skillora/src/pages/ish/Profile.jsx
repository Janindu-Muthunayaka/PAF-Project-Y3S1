import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiEdit, FiSettings, FiBookOpen, FiCode, FiGrid, FiBookmark } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useUser } from '../../context/ish/UserContext';
import { postService } from '../../services/ish/api';
import PostList from '../../components/ish/PostList';
import Avatar from '../../components/ish/ui/Avatar';
import Button from '../../components/ish/ui/Button';

const Profile = () => {
  const { userId } = useParams();
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const [postsResponse, pinnedPostsResponse] = await Promise.all([
          postService.getUserPosts(userId),
          postService.getUserPinnedPosts(userId)
        ]);
        
        setPosts(postsResponse.data);
        setPinnedPosts(pinnedPostsResponse.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  const isCurrentUser = user.id === userId;

  const tabs = [
    { id: 'posts', label: 'Posts', icon: <FiGrid /> },
    { id: 'learning', label: 'Learning Plans', icon: <FiBookOpen /> },
    { id: 'skills', label: 'Skills', icon: <FiCode /> },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card overflow-hidden mb-8">
        <div className="profile-header-bg"></div>
        <div className="p-8 pt-4 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="flex-shrink-0">
              <Avatar name={user.displayName} size="2xl" className="profile-avatar" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white mt-2">{user.displayName}</h1>
              <p className="text-gray-400">@{user.username}</p>
              <p className="text-gray-300 mt-2 max-w-2xl">
                Passionate developer and educator sharing knowledge about programming and technology.
              </p>
            </div>
            {isCurrentUser && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  leftIcon={<FiEdit />}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<FiSettings />}
                >
                  Settings
                </Button>
              </div>
            )}
          </div>
          
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-value">0</div>
              <div className="profile-stat-label">Posts</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">0</div>
              <div className="profile-stat-label">Followers</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">0</div>
              <div className="profile-stat-label">Following</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">0</div>
              <div className="profile-stat-label">Learning Plans</div>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--dark-border)]">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 px-6 py-4 text-center font-medium flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-[var(--dark-surface-light)]'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Pinned Posts (if any) */}
      {pinnedPosts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FiBookmark className="text-[var(--primary)] mr-2" />
            <h2 className="text-xl font-semibold text-white">Pinned Posts</h2>
          </div>
          <PostList posts={pinnedPosts} />
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'posts' && (
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="card">
              <div className="p-8 text-center">
                <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                <p className="text-gray-400 mb-6">
                  {isCurrentUser
                    ? "You haven't shared any posts yet."
                    : "This user hasn't shared any posts yet."}
                </p>
                {isCurrentUser && (
                  <Button
                    variant="primary"
                    to="/create-post"
                  >
                    Create Your First Post
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <PostList posts={posts} />
          )}
        </div>
      )}

      {activeTab === 'learning' && (
        <div className="card">
          <div className="p-8 text-center">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No learning plans yet</h3>
            <p className="text-gray-400 mb-6">
              {isCurrentUser
                ? "You haven't created any learning plans yet."
                : "This user hasn't created any learning plans yet."}
            </p>
            {isCurrentUser && (
              <Button
                variant="primary"
                to="/create-learning-plan"
              >
                Create Learning Plan
              </Button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="card">
          <div className="p-8 text-center">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No skills added yet</h3>
            <p className="text-gray-400 mb-6">
              {isCurrentUser
                ? "You haven't added any skills to your profile yet."
                : "This user hasn't added any skills to their profile yet."}
            </p>
            {isCurrentUser && (
              <Button
                variant="primary"
              >
                Add Skills
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;