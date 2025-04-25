import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FiHeart, 
  FiBook, 
  FiZap, 
  FiCode, 
  FiUsers, 
  FiMessageSquare, 
  FiBookmark, 
  FiShare2, 
  FiMoreVertical, 
  FiEdit, 
  FiTrash2 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/ish/UserContext';
import { usePost } from '../../context/ish/PostContext';
import { commentService,replyService,reactionService,userService } from '../../services/ish/api';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';



// Reaction Types Configuration
const REACTION_TYPES = [
  { 
    type: 'Liked', 
    icon: FiHeart, 
    description: 'Acknowledging the effort or creativity' 
  },
  { 
    type: 'Learned', 
    icon: FiBook, 
    description: 'Content contributed to your growth' 
  },
  { 
    type: 'Inspired', 
    icon: FiZap, 
    description: 'Sparked new ideas or motivation' 
  },
  { 
    type: 'Implemented', 
    icon: FiCode, 
    description: 'Applied skills or concepts' 
  },
  { 
    type: 'Collaborated', 
    icon: FiUsers, 
    description: 'Interested in working together' 
  }
];

const PostItem = ({ post }) => {
  const { user } = useUser();
  const { deletePost } = usePost();
  const navigate = useNavigate();
  
  const [reactions, setReactions] = useState([]);
  const [userReaction, setUserReaction] = useState(null);
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  // Fetch reactions when post loads or changes
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const reactionResponse = await reactionService.getPostReactions(post.id);
        console.log('Reactions Response:', reactionResponse.data); // Check if data is as expected
        setReactions(reactionResponse.data);
  
        const userReactionResponse = await reactionService.getUserReaction(post.id, user.id);
        console.log('User Reaction Response:', userReactionResponse.data); // Check if user reaction is fetched
        setUserReaction(userReactionResponse.data);
      } catch (error) {
        console.error('Failed to fetch reactions', error);
      }
    };
  
    fetchReactions();
  }, [post.id, user.id]);

// User data loading
const [userData, setUserData] = useState(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUserById(post.userId);
      console.log('User data fetched:', response.data); // Debug log
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch user data', error);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (post && post.userId) {
    fetchUserData();
  }
}, [post.userId]);
// End of user data loading


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const isPostOwner = post.userId === user.id;

  // Handle reaction selection
  const handleReaction = async (reactionType) => {
    try {
      // If user already has this reaction, remove it
      if (userReaction && userReaction.type === reactionType) {
        await reactionService.deleteReaction(post.id, user.id);
        setUserReaction(null);
        toast.info('Reaction removed');
      } else {
        // Add new reaction
        const response = await reactionService.addReaction(post.id, user.id, reactionType);
        setUserReaction(response.data);
        toast.success(`Reacted with: ${reactionType}`);
      }
      
      // Refresh reactions
      const updatedReactions = await reactionService.getPostReactions(post.id);
      setReactions(updatedReactions.data);
      
      setShowReactionMenu(false);
    } catch (error) {
      toast.error('Failed to process reaction');
      console.error(error);
    }
  };
  
  // Reaction Menu Dropdown
  const ReactionMenu = () => (
    <div className="absolute bottom-full left-0 mb-2 bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-2 flex space-x-2">
      {REACTION_TYPES.map(({ type, icon: Icon, description }) => (
        <div 
          key={type} 
          className="group relative"
        >
          <button
            onClick={() => handleReaction(type)}
            className={`
              p-2 rounded-full transition-all 
              ${userReaction?.type === type 
                ? 'bg-blue-500/20 text-blue-500' 
                : 'hover:bg-white/10 text-gray-300 hover:text-white'}
            `}
            title={description}
          >
            <Icon className="h-5 w-5" />
          </button>
          <span className="
            absolute -top-8 left-1/2 -translate-x-1/2 
            bg-black/70 text-white text-xs px-2 py-1 
            rounded opacity-0 group-hover:opacity-100 
            transition-opacity duration-200
          ">
            {type}
          </span>
        </div>
      ))}
    </div>
  );
  
  // Reaction Summary
  const ReactionSummary = () => {
    const reactionCounts = reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});
    
    return (
      <div className="flex space-x-2 items-center">
        {Object.entries(reactionCounts).map(([type, count]) => {
          const { icon: Icon } = REACTION_TYPES.find(r => r.type === type) || {};
          return Icon ? (
            <div key={type} className="flex items-center space-x-1">
              <Icon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">{count}</span>
            </div>
          ) : null;
        })}
      </div>
    );
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Post removed from saved items' : 'Post saved to your profile');
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/posts/${post.id}/edit`);
    setShowOptions(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setConfirmDelete(true);
    setShowOptions(false);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  const handleConfirmDelete = async (e) => {
  
    //testing to be removed

  console.log("in Post Item delete post with ID:", post.id);
  console.log("in Post Item delete post User ID:", user.id);
  console.log("Post object:", post); // ← check the full object


    e.stopPropagation();
    try {
      await deletePost(post.id, user.id); 
      toast.success('Post deleted successfully');
      
      if (window.location.pathname.includes(`/posts/${post.id}`)) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to delete post');
    }
    setConfirmDelete(false);
  };
 
  

  return (
    <div className="bg-[var(--dark-surface)] rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg border border-[var(--dark-border)] space-y-4 p-4">
      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[var(--dark-surface)] rounded-xl p-6 max-w-md w-full text-center">
              <FiTrash2 className="mx-auto h-12 w-12 text-[var(--danger)] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Delete Post</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-[var(--danger)] text-white hover:bg-opacity-90 transition"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar 
            name={post.userId?.charAt(0)?.toUpperCase() || 'U'} 
            size="md"
            className="ring-2 ring-[var(--primary)] ring-opacity-50 mb-4"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-semibold text-base" >{userData?.firstName || userData?.lastName 
    ? `${userData?.firstName ?? ""} ${userData?.lastName ?? ""}`.trim() 
    : "Unknown User"}</h3>
              {post.isPinned && (
                <Badge 
                  variant="primary"
                  className="px-2 py-0.5 text-xs"
                >
                  Pinned
                </Badge>
              )}
            </div>
            <p className="text-gray-400 text-sm pr-18">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        
        {/* Options Dropdown */}
        <div className="relative">
          <button 
            className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-700/60 rounded-full transition-colors duration-200 focus:outline-none"
            onClick={() => setShowOptions(!showOptions)}
            aria-label="Post options"
          >
            <FiMoreVertical className="h-5 w-5" />
          </button>
          
          <AnimatePresence>
            {showOptions && isPostOwner && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.97, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 5 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-1 w-56 bg-[var(--dark-surface)] rounded-xl z-20 backdrop-blur-sm bg-opacity-95"
              >
                <div className="py-2 space-y-2">
                  <button 
                    className="flex items-center w-full px-5 py-3 text-gray-300 hover:bg-gray-700/50 transition-colors duration-150 rounded-lg mx-2"
                    onClick={handleEdit}
                  >
                    <FiEdit className="mr-3.5 h-5 w-5 text-gray-400" />
                    <span className="font-medium">Edit Post</span>
                  </button>
                  
                  <button 
                    className="flex items-center w-full px-5 py-3 text-[var(--danger)] hover:bg-gray-700/50 transition-colors duration-150 rounded-lg mx-2"
                    onClick={handleDeleteClick}
                  >
                    <FiTrash2 className="mr-3.5 h-5 w-5" />
                    <span className="font-medium">Delete Post</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Post Content */}
      <Link to={`/posts/${post.id}`} className="block hover:opacity-80 transition">
        <h2 className="text-xl font-bold text-white mb-2 line-clamp-2 text-left pl-5">{post.title}</h2>
        <p className="text-gray-300 line-clamp-3 mb-4 text-left pl-5">{post.content}</p>
      </Link>
        
      {/* Media Gallery */}
      {post.media && post.media.length > 0 && (
        <Link to={`/posts/${post.id}`} className="block">
          <div className={`grid ${post.media.length > 1 ? 'grid-cols-2 gap-2' : 'grid-cols-1'} rounded-lg overflow-hidden`}>
            {post.media.slice(0, 4).map((media, index) => (
              <div 
                key={index} 
                className={`relative ${post.media.length > 1 ? 'aspect-square' : 'aspect-video'} group`}
              >
                {media.type === 'IMAGE' ? (
                  <img 
                    src={media.url} 
                    alt="Post media" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <video 
                    src={media.url} 
                    className="w-full h-full object-cover" 
                    controls={false}
                  >
                    <source src={media.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {index === 3 && post.media.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg">
                    +{post.media.length - 4} more
                  </div>
                )}
              </div>
            ))}
          </div>
        </Link>
      )}
        
      {/* Categories */}
      {post.categories && post.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {post.categories.map((category, index) => (
            <span 
              key={index}
              className="px-2.5 py-1 text-xs bg-gray-700 text-gray-200 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      )}
      
      {/* Post Actions */}
      <div className="flex justify-between items-center border-t border-[var(--dark-border)] pt-3">
        <div className="flex space-x-4 relative">
          <div className="relative">
            <button 
              className="flex items-center space-x-1.5 text-gray-400 hover:text-blue-500 transition"
              onClick={() => setShowReactionMenu(!showReactionMenu)}
            >
              {userReaction ? (
                (() => {
                  const { icon: Icon } = REACTION_TYPES.find(r => r.type === userReaction.type) || {};
                  return Icon ? <Icon className="h-5 w-5 text-blue-500" /> : null;
                })()
              ) : (
                <FiHeart className="h-5 w-5" />
              )}
              <span className="text-sm">
                {userReaction ? userReaction.type : 'React'}
              </span>
            </button>
            
            {showReactionMenu && <ReactionMenu />}
          </div>
        
          <Link to={`/posts/${post.id}`} className="flex items-center space-x-1.5 text-gray-400 hover:text-[var(--primary)] transition">
            <FiMessageSquare className="h-5 w-5" />
            <span className="text-sm">Comment</span>
          </Link>
        </div>
        
        <div className="flex space-x-4">
          <button 
            className={`flex items-center space-x-1.5 text-gray-400 hover:text-[var(--primary)] transition ${bookmarked ? 'text-[var(--primary)]' : ''}`}
            onClick={handleBookmark}
          >
            <FiBookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
            <span className="text-sm">Save</span>
          </button>
        
          <button className="flex items-center space-x-1.5 text-gray-400 hover:text-white transition">
            <FiShare2 className="h-5 w-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>

        <ReactionSummary />
      </div>
    </div>
  );
};

export default PostItem;