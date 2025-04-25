import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiEdit, FiSettings, FiBookOpen, FiCode, FiGrid, FiBookmark } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useUser } from '../../context/ish/UserContext';
import { postService } from '../../services/ish/api';
import { userService } from '../../services/ish/api';  // Importing the userService
import PostList from '../../components/ish/PostList';
import Avatar from '../../components/ish/ui/Avatar';
import Button from '../../components/ish/ui/Button';

const Profile = () => {
  const { userId } = useParams();
  console.log("User ID:", userId);
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [profileData, setProfileData] = useState(null);  // New state to hold user profile data
  const [followersCount, setFollowersCount] = useState(0);  // State to hold follower count
  const [followingCount, setFollowingCount] = useState(0);  // State to hold following count

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const [postsResponse, pinnedPostsResponse, userResponse, followersResponse, followingResponse] = await Promise.all([
          postService.getUserPosts(userId),
          postService.getUserPinnedPosts(userId),
          userService.getUserById(userId),  // Fetching user details by ID
          userService.getFollowers(userId),  // Fetching followers count
          userService.getUsernames([userId])  // Fetching following count (or use another endpoint if needed)
        ]);

        setPosts(postsResponse.data);
        setPinnedPosts(pinnedPostsResponse.data);
        setProfileData(userResponse.data);  // Setting user details
        setFollowersCount(followersResponse.data.length);  // Set followers count
        setFollowingCount(followingResponse.data.length);  // Set following count
      } catch (error) {
        console.error('Error fetching user data:', error);
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
              <Avatar name={profileData?.displayName || "User"} size="2xl" className="profile-avatar" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white mt-2">{profileData?.displayName || "User"}</h1>
              <p className="text-gray-400">@{profileData?.username || "Username"}</p>
              <p className="text-gray-300 mt-2 max-w-2xl">
                {profileData?.bio || "Passionate developer and educator sharing knowledge about programming and technology."}
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
              <div className="profile-stat-value">{posts.length}</div>
              <div className="profile-stat-label">Posts</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{followersCount}</div>
              <div className="profile-stat-label">Followers</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{followingCount}</div>
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
    </div>
  );
};

export default Profile;
