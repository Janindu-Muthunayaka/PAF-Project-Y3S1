import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiImage, FiVideo, FiX, FiChevronDown, FiHash, FiLock, FiUnlock, FiSend } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { usePost } from '../../context/ish/PostContext';
import { postService, categoryService } from '../../services/ish/api';
import { BsPinAngle } from 'react-icons/bs';
import { useUser } from '../../context/ish/UserContext';

const EditPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useUser();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [files, setFiles] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState(null);
  const [keepExistingMedia, setKeepExistingMedia] = useState(true);

  // Fetch post data and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postResponse, categoriesResponse] = await Promise.all([
          postService.getPostById(postId),
          categoryService.getAllCategories()
        ]);
        
        const postData = postResponse.data;
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setSelectedCategories(postData.categories || []);
        setIsPrivate(postData.isPrivate);
        setIsPinned(postData.isPinned);
        
        setCategories(categoriesResponse.data);
        
        // If there's media, show it
        if (postData.media && postData.media.length > 0) {
          const existingMedia = postData.media.map(m => ({
            url: m.url,
            type: m.type.toLowerCase(),
            existing: true,
            publicId: m.publicId,
            name: m.name || 'Existing Media'
          }));
          setPreviewUrls(existingMedia);
        }
      } catch (err) {
        setError('Failed to load post data');
        toast.error('Failed to load post data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  // Create preview URLs for the selected files
  useEffect(() => {
    if (files.length > 0) {
      const newPreviewUrls = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video',
        name: file.name,
        existing: false
      }));
      
      // If we're not keeping existing media, replace all previews
      if (!keepExistingMedia) {
        setPreviewUrls(newPreviewUrls);
      } else {
        // Otherwise add new previews to existing ones
        setPreviewUrls(prev => 
          prev.filter(p => p.existing).concat(newPreviewUrls)
        );
      }
      
      // Clean up URLs when component unmounts
      return () => {
        newPreviewUrls.forEach(item => URL.revokeObjectURL(item.url));
      };
    }
  }, [files, keepExistingMedia]);

  const handleCategoryChange = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validation checks
    if (selectedFiles.some(file => file.type.startsWith('image/')) && 
        selectedFiles.some(file => file.type.startsWith('video/'))) {
      setError('You cannot mix images and videos in the same post');
      toast.error('You cannot mix images and videos in the same post');
      return;
    }
    
    const imagesCount = selectedFiles.filter(file => file.type.startsWith('image/')).length;
    const videosCount = selectedFiles.filter(file => file.type.startsWith('video/')).length;
    
    if (imagesCount > 0 && imagesCount > 5) {
      setError('You can upload a maximum of 5 images');
      toast.error('Maximum 5 images allowed');
      return;
    }
    
    if (videosCount > 0 && videosCount > 1) {
      setError('You can upload only 1 video');
      toast.error('Only 1 video allowed');
      return;
    }
    
    setFiles(selectedFiles);
    setKeepExistingMedia(false);
    setError(null);
  };

  const removeFile = (index) => {
    // If it's an existing file, just remove it from preview
    if (previewUrls[index].existing) {
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
      return;
    }

    // If it's a new file, remove from files array too
    const fileIndex = previewUrls
      .slice(0, index)
      .filter(p => !p.existing)
      .length;
      
    const newFiles = [...files];
    newFiles.splice(fileIndex, 1);
    setFiles(newFiles);
    
    // Remove from preview
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      toast.error('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      setError('Content is required');
      toast.error('Please enter some content');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const postData = {
        title,
        content,
        categories: selectedCategories,
        private: isPrivate,
        pinned: isPinned
      };
      
      // If we're keeping existing media and not adding new files, just update post data
      if (keepExistingMedia && files.length === 0) {
        await postService.updatePost(user.id,postId, postData, []);
      } else {
        
        await postService.updatePost(user.id,postId, postData, files);
      }
      
      toast.success('Post updated successfully!');
      navigate(`/posts/${postId}`);
    } catch (err) {
      setError('Failed to update post. Please try again.');
      toast.error('Failed to update post');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="max-w-3xl mx-auto bg-red-100 p-4 rounded-md text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card mb-6">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Edit Post</h1>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#471F1F] border border-[#D95757] text-white px-4 py-3 rounded mb-6"
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-xl font-bold text-white border-none focus:outline-none focus:ring-0 p-0 mb-4 placeholder-gray-500"
              />
              
              <textarea
                placeholder="What's on your mind? Edit your post..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="create-post-textarea"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.map((category) => (
                  <div 
                    key={category}
                    className="bg-[var(--primary)] bg-opacity-20 text-[var(--primary-light)] px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    <FiHash className="mr-1" />
                    {category}
                    <button
                      type="button"
                      className="ml-2 text-[var(--primary-light)] hover:text-white"
                      onClick={() => handleCategoryChange(category)}
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center text-gray-400 hover:text-white px-3 py-1.5 rounded-md border border-[var(--dark-border)] bg-[var(--dark-surface-light)] hover:bg-opacity-90"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <FiHash className="mr-2" />
                  Add Categories
                  <FiChevronDown className="ml-2" />
                </button>
                
                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-[var(--dark-surface)] border border-[var(--dark-border)] z-10"
                    >
                      <div className="p-2 max-h-60 overflow-y-auto">
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <div 
                              key={category.id}
                              className="flex items-center px-2 py-1.5 rounded hover:bg-[var(--dark-surface-light)] cursor-pointer"
                              onClick={() => handleCategoryChange(category.name)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.name)}
                                onChange={() => {}}
                                className="mr-2"
                              />
                              <span className="text-gray-300">{category.name}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-2 text-gray-400">No categories found</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {previewUrls.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Media Preview</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {previewUrls.map((file, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden group">
                      {file.type === 'image' ? (
                        <img 
                          src={file.url} 
                          alt={`Preview ${index}`}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <video
                          src={file.url}
                          className="w-full h-32 object-cover"
                          controls
                        />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <button
                          type="button"
                          className="self-end bg-red-500 text-white rounded-full p-1"
                          onClick={() => removeFile(index)}
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                        <div className="text-white text-xs truncate">{file.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 mb-4">
                  <button
                    type="button"
                    className="text-blue-400 hover:underline"
                    onClick={() => {
                      setPreviewUrls([]);
                      setFiles([]);
                      setKeepExistingMedia(false);
                    }}
                  >
                    Remove all media
                  </button>
                </div>
              </div>
            )}
            
            <div className="border-t border-b border-[var(--dark-border)] py-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <label 
                  className="flex items-center text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-[var(--dark-surface-light)] cursor-pointer"
                >
                  <FiImage className="mr-2" />
                  Add Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                
                <label 
                  className="flex items-center text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-[var(--dark-surface-light)] cursor-pointer"
                >
                  <FiVideo className="mr-2" />
                  Add Video
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                
                <button
                  type="button"
                  className={`flex items-center px-3 py-2 rounded-md hover:bg-[var(--dark-surface-light)] ${isPrivate ? 'text-[var(--primary-light)]' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setIsPrivate(!isPrivate)}
                >
                  {isPrivate ? <FiLock className="mr-2" /> : <FiUnlock className="mr-2" />}
                  {isPrivate ? 'Private' : 'Public'}
                </button>
                
                <button
                  type="button"
                  className={`flex items-center px-3 py-2 rounded-md hover:bg-[var(--dark-surface-light)] ${isPinned ? 'text-[var(--primary-light)]' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setIsPinned(!isPinned)}
                >
                  <BsPinAngle className="mr-2" />
                  {isPinned ? 'Pinned' : 'Pin to Profile'}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-[var(--dark-border)] text-gray-300 hover:bg-[var(--dark-surface-light)]"
                onClick={() => navigate(`/posts/${postId}`)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] flex items-center"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="spinner spinner-sm mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Update
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;