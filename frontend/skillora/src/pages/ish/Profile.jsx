import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiEdit, FiDelete, FiBookOpen, FiCode, FiGrid, FiBookmark } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { sessionId } from '../../services/ish/api';
import { postService } from '../../services/ish/api';
import { userService } from '../../services/ish/api';  // Importing the userService
import PostList from '../../components/ish/PostList';
import Avatar from '../../components/ish/ui/Avatar';
import Button from '../../components/ish/ui/Button';
import SkillsSection from '../Bumal/SkillsSection';

const Profile = () => {
  const { userId } = useParams(); // viewed profile ID
  const [user, setUser] = useState(null); // currently logged in user
  const [profileData, setProfileData] = useState(null); // profile being viewed
  const [posts, setPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    password: ''
  });

  const handleEditClick = () => {
    setEditFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      password: ''
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    const updatedUser = {
      ...user,
      firstName: editFormData.firstName,
      lastName: editFormData.lastName,
      bio: editFormData.bio,
    };

    if (editFormData.password.trim() !== '') {
      updatedUser.password = editFormData.password;
    }

    try {
      await userService.updateUser(user.id, updatedUser);
      setUser(updatedUser);
      setProfileData(updatedUser);
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };





  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Get current logged-in user
        const currentUser = await sessionId.getUserData();
        setUser(currentUser);

        // 2. Fetch viewed user profile
        const userProfile = await userService.getUserById(userId);
        setProfileData(userProfile.data);

        // 3. Fetch posts and stats
        const [userPosts, userPinnedPosts, userFollowers, userFollowing] = await Promise.all([
          postService.getUserPosts(userId),
          postService.getUserPinnedPosts(userId),
          userService.getFollowers(userId),
          userService.getFollowing(userId)
        ]);

        setPosts(userPosts.data);
        setPinnedPosts(userPinnedPosts.data);
        setFollowers(userFollowers.data);
        setFollowing(userFollowing.data);
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const isCurrentUser = user && user.id === userId;

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
            <Avatar
  src={profileData?.avatar}
  name={profileData?.firstName || profileData?.displayName || 'User'}
  size="2xl"
  className="profile-avatar"
  fallback={profileData?.firstName ? profileData.firstName.charAt(0).toUpperCase() : 'U'}
/>
              </div>
            <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-white mt-2">
              {`${profileData?.firstName || ''} ${profileData?.lastName || ''}`}
            </h1>
              <p className="text-gray-400 ">@{profileData?.userName || 'username'}</p>

              <p className="text-gray-300 mt-2 max-w-2xl">
                {profileData?.bio || 'This user has no bio yet.'}
              </p>
            </div>

            {isCurrentUser && (
              <div className="flex gap-3">
                <Button variant="outline" leftIcon={<FiEdit />} onClick={handleEditClick}>
                  Edit Profile
                </Button>

                <Button
                  variant="outline"
                  leftIcon={<FiDelete />}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Profile
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
                <div className="profile-stat-value">{followers.length}</div>
                <div className="profile-stat-label">Following</div>
              </div>

              <div className="profile-stat">
                <div className="profile-stat-value">{following.length}</div>
                <div className="profile-stat-label">Followers</div>
              </div>

              <div className="profile-stat">
                <div className="profile-stat-value">0</div>
                <div className="profile-stat-label">Learning Plans</div>
              </div>
          </div>



        </div>

        <div className="border-t border-[var(--dark-border)] py-4">
          <nav className="flex overflow-x-auto ">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 px-6 py-4 mr-8 text-center font-medium flex items-center justify-center gap-2 ${
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

{activeTab === 'skills' && (
  <SkillsSection
  userId={profileData?.id} // Make sure `id` is correct, or use profileData?.userId
  skills={profileData?.skills || []}
  isCurrentUser={isCurrentUser}
  onAddSkill={(newSkill) => {
    const updatedSkills = [...(profileData?.skills || []), newSkill];
    setProfileData({ ...profileData, skills: updatedSkills });
  }}
  onDeleteSkill={(skillName) => {
    const updatedSkills = profileData?.skills?.filter(s => s.skillName !== skillName);
    setProfileData({ ...profileData, skills: updatedSkills });
  }}
/>

)}





        {showEditModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-[var(--dark-surface)] bg-opacity-90 text-white p-6 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-700 transition-all duration-300">
              <h2 className="text-xl font-semibold mb-4 text-center">Edit Profile</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <input
                    value={user.userName}
                    disabled
                    className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded-md cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    value={user.email}
                    disabled
                    className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded-md cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <input
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    value={editFormData.bio}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">New Password</label>
                  <input
                    type="password"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    placeholder="Leave blank to keep current"
                    className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}


        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-[var(--dark-surface)] p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Are you sure?</h2>
              <p className="text-gray-400 mb-6">This action will permanently delete your profile. This cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    try {
                      await userService.deleteUser(user.id);
                      // Optionally redirect or log out after deletion
                      window.location.href = "/"; // Or to login page
                    } catch (error) {
                      console.error("Delete failed:", error);
                    }
                  }}
                >
                  Yes, Delete
                </Button>
              </div>
            </div>
          </div>
        )}








    </div>
  );
};

export default Profile;
