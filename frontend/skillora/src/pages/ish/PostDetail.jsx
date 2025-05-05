import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, 
  FiHeart, 
  FiMessageSquare, 
  FiBookmark, 
  FiShare2,
  FiMoreHorizontal,
  FiEdit,
  FiTrash2,
  FiLock,
  FiPlusCircle,
  FiTrash,
  FiSend
} from 'react-icons/fi';
import { postService } from '../../services/ish/api';
import { userService,commentService, replyService } from "../../services/ish/api";
import { useUser } from '../../context/ish/UserContext';
import { usePost } from '../../context/ish/PostContext';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ish/ui/Card';
import Avatar from '../../components/ish/ui/Avatar';
import Badge from '../../components/ish/ui/Badge';
import Button from '../../components/ish/ui/Button';
import Input from '../../components/ish/ui/Input';

//post details
const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { deletePost } = usePost();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [activeReply, setActiveReply] = useState(null);

  const [usernames, setUsernames] = useState({});
  const [postUsername, setPostUsername] = useState("");


  
  useEffect(() => {
    fetchComments();
  }, []);
  
  const fetchComments = async () => {
    try {
      const response = await commentService.getCommentsByPostId(postId);
      const commentsData = response.data;
  
      // Fetch replies for each comment and attach them
      const commentsWithReplies = await Promise.all(
        commentsData.map(async (comment) => {
          const replyResponse = await replyService.getRepliesForComment(comment.id);
          return {
            ...comment,
            replies: replyResponse.data,
          };
        })
      );
      
      setComments(commentsWithReplies);
  
      // Fetch usernames for each unique userId (both comments and replies)
      const newUsernames = {};
      for (const comment of commentsWithReplies) {
        // Get username for comment author
        const commentUserId = comment.userId;
        if (!usernames[commentUserId]) {
          const username = await getUsernameById(commentUserId);
          if (username) {
            newUsernames[commentUserId] = username;
          }
        }

        // Get usernames for reply authors
        if (comment.replies) {
          for (const reply of comment.replies) {
            const replyUserId = reply.userId;
            if (!usernames[replyUserId]) {
              const username = await getUsernameById(replyUserId);
              if (username) {
                newUsernames[replyUserId] = username;
              }
            }
          }
        }
      }
  
      // Merge with any existing usernames
      setUsernames((prev) => ({ ...prev, ...newUsernames }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  
  

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    console.log(`UserID: ${user.id}`);
    try {
      await commentService.createComment(postId, user.id, newComment);
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleUpdateComment = async (commentId,commentUserId) => {
    if (commentUserId === user.id) {
      if (!editContent.trim()) return;
      try {
        await commentService.updateComment(commentId, editContent);
        setEditingComment(null);
        setEditContent("");
        fetchComments();
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    } else {
      alert("You can only edit your own comments");
    }
  };

  const handleDeleteComment = async (commentId,commentUserId) => {
    if (commentUserId === user.id) {
      try {
        await commentService.deleteComment(commentId);
        fetchComments();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    } else {
      alert("You can only delete your own comments");
    }
  };
  
  const getUsernameById = async (userId) => {
    try {
      const response = await userService.getUserById(userId);
      return response.data?.userName;
    } catch (error) {
      console.error("Error getting username by ID:", error);
      return null;
    }
  };
  

  const handleAddReply = async (commentId) => {
    if (!replyContent.trim()) return;
    try {
      await replyService.createReply(commentId, user.id, replyContent);
      setReplyContent("");
      setActiveReply(null);
      fetchComments();
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDeleteReply = async (replyId,replyUserId) => {
    if (replyUserId === user.id) {
      try {
        await replyService.deleteReply(replyId);
        fetchComments();
      } catch (error) {
        console.error("Error deleting reply:", error);
      }
    } else {
      alert("You can only delete your own replies");
    }
  };


  useEffect(() => {
  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postService.getPostById(postId);
      const postData = response.data;
      setPost(postData);

      // Fetch username for post author
      if (postData.userId) {
        const username = await getUsernameById(postData.userId);
        if (username) {
          setUsernames(prevUsernames => ({
            ...prevUsernames,
            [postData.userId]: username
          }));
        }
      }

      setError(null);
    } catch (err) {
      setError("Failed to load post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchPost();
}, [postId]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Post unliked' : 'Post liked');
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Post removed from saved items' : 'Post saved to your profile');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const handleEdit = () => {
    navigate(`/posts/${postId}/edit`);
    setShowOptions(false);
  };

  const handleDeleteClick = () => {
    setConfirmDelete(true);
    setShowOptions(false);
  };

  const handleCancelDelete = () => {
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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    toast.info('Comment feature is not yet implemented');
    setComment('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <div className="flex flex-col items-center py-8">
          <svg className="w-16 h-16 text-red-500 dark:text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{error || 'Post not found'}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The post you're looking for might have been removed or is temporarily unavailable.</p>
          <Button 
            to="/"
            variant="primary"
            leftIcon={<FiArrowLeft />}
          >
            Back to feed
          </Button>
        </div>
      </Card>
    );
  }

  const isPostOwner = post.userId === user.id;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          to="/"
          variant="ghost"
          size="sm"
          leftIcon={<FiArrowLeft />}
          className="mr-4"
        >
          Back to feed
        </Button>
        
        {post.isPrivate && (
          <Badge
            variant="warning"
            size="lg"
            className="ml-auto"
          >
            <FiLock className="mr-1" /> Private Post
          </Badge>
        )}
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 dark:bg-dark-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <Card className="max-w-md w-full mx-auto">
              <div className="text-center">
                <FiTrash2 className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Delete Post</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this post? This action cannot be undone.
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                  <Button 
                    variant="outline"
                    onClick={handleCancelDelete}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="danger"
                    onClick={handleConfirmDelete}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card>
        <div className="flex items-center mb-6">
          <Avatar 
            name={post.userId?.charAt(0)?.toUpperCase() || 'U'} 
            size="lg"
            className="mr-4"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg text-left">{usernames[post.userId]}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{formatDate(post.createdAt)}</p>
          </div>
          
          {post.isPinned && (
            <Badge 
              variant="primary"
              className="ml-3"
            >
              Pinned
            </Badge>
          )}
          
          {isPostOwner && (
            <div className="relative ml-auto">
              <button 
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
                onClick={() => setShowOptions(!showOptions)}
                aria-label="Post options"
              >
                <FiMoreHorizontal className="h-5 w-5" />
              </button>
              
              <AnimatePresence>
                {showOptions && (
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
          )}
        </div>

        <h1 className="text-3xl font-bold mb-4  text-gray-900 dark:text-white text-left">{post.title}</h1>
        
        <div className="prose dark:prose-invert max-w-none mb-6">
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line text-left">{post.content}</p>
        </div>

        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((category, index) => (
              <span 
              key={index}
              className="px-2.5 py-2 text-xs bg-gray-700 text-gray-200 rounded-full"
            >
              {category}
            </span>
            ))}
          </div>
        )}

       
        
        {post.media && post.media.length > 0 && (
          <div className="mb-6 space-y-4">
            {post.media.map((media, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                {media.type === 'IMAGE' ? (
                  <img 
                    src={media.url} 
                    alt={`Post media ${index + 1}`} 
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <video 
                    src={media.url} 
                    controls 
                    className="w-full h-auto rounded-lg" 
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-dark-700">
          <button 
            className={`flex items-center ${liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'} hover:text-red-500`}
            onClick={handleLike}
          >
            <FiHeart className={`mr-2 ${liked ? 'fill-current' : ''}`} />
            <span>Like</span>
          </button>
          
          <button 
            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500"
            onClick={() => document.getElementById('comment-input').focus()}
          >
            <FiMessageSquare className="mr-2" />
            <span>Comment</span>
          </button>
          
          <button 
            className={`flex items-center ${bookmarked ? 'text-primary-600 dark:text-primary-500' : 'text-gray-500 dark:text-gray-400'} hover:text-primary-600 dark:hover:text-primary-500`}
            onClick={handleBookmark}
          >
            <FiBookmark className={`mr-2 ${bookmarked ? 'fill-current' : ''}`} />
            <span>Save</span>
          </button>
          
          <button 
            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500"
            onClick={handleShare}
          >
            <FiShare2 className="mr-2" />
            <span>Share</span>
          </button>
        </div>
      </Card>
      <br></br>
      {/* Comments Section */}
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-white">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray">Comments</h3>
      {comments.length === 0 ? (
        <div className="text-center py-6">
          <FiMessageSquare className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Be the first to share your thoughts on this post.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="border-b pb-4">
              {editingComment === comment.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <Button className="mt-2" onClick={() => handleUpdateComment(comment.id,comment.userId)}>
                    Update Comment
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  {/* detail of user Section */}
                  <p className="font-semibold">{usernames[comment.userId] }:</p>
                  <p>{comment.description}</p>
                </div>
              )}
              <div className="flex space-x-2 mt-2">
                <button className="text-blue-500 text-sm" onClick={() => setActiveReply(activeReply === comment.id ? null : comment.id)}>
                  Reply
                </button>
                <button className="text-green-500 text-sm" onClick={() => { setEditingComment(comment.id); setEditContent(comment.content); }}>
                  <FiEdit />
                </button>
                <button className="text-red-500 text-sm" onClick={() => handleDeleteComment(comment.id,comment.userId)}>
                  <FiTrash />
                </button>
              </div>
              {/* Reply Section */}
              {activeReply === comment.id && (
                <div className="mt-2">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                  />
                  <Button className="mt-2" onClick={() => handleAddReply(comment.id)}>
                    Submit Reply
                  </Button>
                </div>
              )}
              {/* Render Replies under the Comment */}
              {comment.replies && comment.replies.length > 0 && (
                <ul className="mt-2 space-y-2 pl-6 border-l border-gray-600">
                  {comment.replies.map((reply) => (
                    <li key={reply.id} className="flex justify-between items-center text-sm text-gray-300">
                      <p>
                        <span className="font-medium">{usernames[reply.userId] || 'User'}:</span> {reply.description}
                      </p>
                      <button className="text-red-400 text-xs" onClick={() => handleDeleteReply(reply.id,reply.userId)}>
                        <FiTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <Input
          id="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button className="mt-2" leftIcon={<FiPlusCircle />} onClick={handleAddComment}>
          Add Comment
        </Button>
      </div>
    </div>
    </div>
  );
};

export default PostDetail;