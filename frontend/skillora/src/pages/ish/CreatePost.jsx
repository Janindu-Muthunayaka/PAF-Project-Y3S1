import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiImage, FiVideo, FiX, FiChevronDown, FiHash, FiLock, FiUnlock, FiSend } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { usePost } from '../../context/ish/PostContext';
import { categoryService } from '../../services/ish/api';
import Button from '../../components/ish/ui/Button';
import { BsPinAngle } from 'react-icons/bs';
import { useUser } from '../../context/ish/UserContext';

const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost } = usePost();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [files, setFiles] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useUser();
  
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Create preview URLs for the selected files
    if (files.length > 0) {
      const newPreviewUrls = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video',
        name: file.name
      }));
      
      setPreviewUrls(newPreviewUrls);
      
      // Clean up URLs when component unmounts
      return () => {
        newPreviewUrls.forEach(item => URL.revokeObjectURL(item.url));
      };
    }
  }, [files]);

  // Close dropdown 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryChange = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleVideoUpload = () => {
    videoInputRef.current?.click();
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
    setError(null);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index].url);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
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
      setLoading(true);
      setError(null);
      
      const postData = {
        title,
        content,
        categories: selectedCategories,
        private: isPrivate,
        pinned: isPinned
      };
      
      const createdPost = await createPost(user.id,postData, files);
      toast.success('Post created successfully!');
      navigate(`/posts/${createdPost.id}`);
    } catch (err) {
      setError('Failed to create post. Please try again.');
      toast.error('Failed to create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card mb-6">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Create a New Post</h1>
          
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
                placeholder="What's on your mind? Share your knowledge or ask a question..."
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
              
              <div className="relative" ref={categoryDropdownRef}>
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
              </div>
            )}
            
            <div className="border-t border-b border-[var(--dark-border)] py-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  className="flex items-center text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-[var(--dark-surface-light)]"
                  onClick={handleImageUpload}
                >
                  <FiImage className="mr-2" />
                  Add Images
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                <button
                  type="button"
                  className="flex items-center text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-[var(--dark-surface-light)]"
                  onClick={handleVideoUpload}
                >
                  <FiVideo className="mr-2" />
                  Add Video
                </button>
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
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
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner spinner-sm mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Publish
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

export default CreatePost;