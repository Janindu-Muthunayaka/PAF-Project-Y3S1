import { useEffect, useState } from 'react';
import { FiSearch, FiUserPlus, FiUserCheck } from 'react-icons/fi';
import { userService, sessionId } from '../../services/ish/api';

const Network = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [userFollowersMap, setUserFollowersMap] = useState({});
  const [userFollowingMap, setUserFollowingMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionUser = await sessionId.getUserData();
        setCurrentUser(sessionUser);

        const all = await userService.getAllUsers();
        const filtered = all.data.filter(u => u.id !== sessionUser.id);
        setAllUsers(filtered);

        // Get current user's following and followers
        const following = await userService.getFollowing(sessionUser.id);
        const followers = await userService.getFollowers(sessionUser.id);
        const followingIds = following.data.map(u => u.id);
        
        setFollowingIds(followingIds);
        setFollowingCount(followingIds.length);
        setFollowersCount(followers.data.length);

        // Get followers and following counts for all users
        const followersMap = {};
        const followingMap = {};
        for (const user of filtered) {
          const followersRes = await userService.getFollowers(user.id);
          const followingRes = await userService.getFollowing(user.id);
          followersMap[user.id] = followersRes.data.length;
          followingMap[user.id] = followingRes.data.length;
        }
        setUserFollowersMap(followersMap);
        setUserFollowingMap(followingMap);
      } catch (err) {
        console.error('Error loading network data:', err);
      }
    };

    fetchData();
  }, []);

  const isFollowing = (userId) => followingIds.includes(userId);

  const handleFollowToggle = async (targetUserId) => {
    if (!currentUser) return;

    try {
      if (isFollowing(targetUserId)) {
        await userService.unfollowUser(currentUser.id, targetUserId);
        setFollowingIds(prev => prev.filter(id => id !== targetUserId));
        setFollowingCount(prev => prev - 1);
        setUserFollowersMap(prev => ({
          ...prev,
          [targetUserId]: Math.max(0, (prev[targetUserId] || 0) - 1)
        }));
      } else {
        await userService.followUser(currentUser.id, targetUserId);
        setFollowingIds(prev => [...prev, targetUserId]);
        setFollowingCount(prev => prev + 1);
        setUserFollowersMap(prev => ({
          ...prev,
          [targetUserId]: (prev[targetUserId] || 0) + 1
        }));
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  const filteredUsers = searchTerm
    ? allUsers.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allUsers;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Network</h1>

      {/* Current User Stats */}
      <div className="mb-4">
        <p className="text-gray-700 text-lg">
          You are following <span className="font-semibold">{followingCount}</span> {followingCount === 1 ? 'person' : 'people'} and have <span className="font-semibold">{followersCount}</span> {followersCount === 1 ? 'follow' : 'followers'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for people by name, role, or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">People You May Know</h2>

        {filteredUsers.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No matches found for "{searchTerm}"</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center">
                  {user.profilePicLink ? (
                    <img
                      src={user.profilePicLink}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-12 w-12 rounded-full mr-4 object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                      {user.firstName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-gray-500">
                      {userFollowersMap[user.id] || 0} followers • {userFollowingMap[user.id] || 0} following
                    </p>
                  </div>
                </div>
                <button
                  className={`flex items-center px-3 py-1 border rounded-full text-sm transition ${
                    isFollowing(user.id)
                      ? 'border-green-400 text-green-600 hover:bg-green-50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleFollowToggle(user.id)}
                >
                  {isFollowing(user.id) ? (
                    <>
                      <FiUserCheck className="mr-1" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="mr-1" />
                      Follow
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Network;
