import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiCompass, 
  FiBook, 
  FiUsers, 
  FiSearch, 
  FiBell, 
  FiPlus, 
  FiX,
  FiMenu,
  FiUser,
  FiSettings,
  FiLogOut,
  FiCode,
  FiTrello
} from 'react-icons/fi';
import { useUser } from '../../context/ish/UserContext';
import Avatar from './ui/Avatar';
import { userService } from '../../services/ish/api';
import NotificationDropdown from '../NotificationDropdown';

const Layout = ({ children }) => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close menus when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-container') && showUserMenu) {
        setShowUserMenu(false);
      }
      if (!e.target.closest('.create-menu-container') && showCreateMenu) {
        setShowCreateMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showCreateMenu]);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { path: '/', icon: <FiHome className="w-5 h-5" />, text: 'Home' },
    { path: '/explore', icon: <FiCompass className="w-5 h-5" />, text: 'Explore' },
    { path: '/learning-plans', icon: <FiBook className="w-5 h-5" />, text: 'Learning Plans' },
    { path: '/network', icon: <FiUsers className="w-5 h-5" />, text: 'Network' },
  ];

  const handleLogout = async () => {
    try {
      console.log("\n[Layout.jsx] Logging out");
      await userService.logout();
      console.log("Logout successful");
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--dark-bg)] ">
      {/* Navigation Bar */}
      <nav className={`sticky top-0 z-50 bg-[var(--dark-surface)] ${scrolled ? 'shadow-lg' : 'shadow-sm'} border-b border-[var(--dark-border)] transition-all duration-200 `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 ">
          <div className="flex justify-between h-16 ">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center">
                <div className="flex items-center">
                  <FiCode className="h-8 w-8 text-[var(--primary)]" />
                  <span className="ml-2 text-lg font-bold text-white">Skillora</span>
                </div>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-8 md:flex md:space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
                      isActive(link.path)
                        ? 'bg-[var(--dark-surface-light)] text-white'
                        : 'text-gray-300 hover:bg-[var(--dark-surface-light)] hover:text-white'
                    }`}
                  >
                    {link.icon}
                    <span>{link.text}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <NotificationDropdown userId={user.id} />

              {/* Create Menu */}
              <div className="relative create-menu-container">
                <button 
                  className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-[var(--dark-surface-light)]"
                  onClick={() => {
                    setShowCreateMenu(!showCreateMenu);
                    setShowUserMenu(false);
                  }}
                >
                  <FiPlus className="h-6 w-6" />
                </button>
                
                {showCreateMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[var(--dark-surface)] ring-1 ring-black ring-opacity-5 z-50 py-1 overflow-hidden">
                    <div className="py-1">
                      <Link
                        to="/create-post"
                        className="group flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-[var(--dark-surface-light)] hover:text-white"
                        onClick={() => setShowCreateMenu(false)}
                      >
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--primary)] bg-opacity-20 flex items-center justify-center text-[var(--primary-light)] group-hover:bg-opacity-30 mr-3">
                          <FiCode className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Create Post</p>
                          <p className="text-xs text-gray-500">Share knowledge or ask a question</p>
                        </div>
                      </Link>

                      <Link
                         to="/learning-plans/create"
                        className="group flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-[var(--dark-surface-light)] hover:text-white"
                        onClick={() => setShowCreateMenu(false)}
                      >
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--secondary)] bg-opacity-20 flex items-center justify-center text-[var(--secondary-light)] group-hover:bg-opacity-30 mr-3">
                          <FiTrello className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Create Learning Plan</p>
                          <p className="text-xs text-gray-500">Organize your learning journey</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative user-menu-container ml-3">
                <button
                  className="flex rounded-full bg-[var(--dark-surface-light)] text-sm focus:outline-none"
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowCreateMenu(false);
                  }}
                >
                  <Avatar
  src={user.avatar}
  name={user.firstName}
  size="sm"
  fallback={user.firstName ? user.firstName.charAt(0).toUpperCase() : '?'}
/>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[var(--dark-surface)] ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1 border-b border-[var(--dark-border)]">
                      <div className="px-4 py-3">
                        <p className="text-sm leading-5 font-medium text-white">{`${user.firstName} ${user.lastName}`}</p>
                        <p className="text-xs leading-4 text-gray-400">@{user.userName}</p>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        to={`/profile/${user.id}`}
                        className="flex px-4 py-2 text-sm text-gray-300 hover:bg-[var(--dark-surface-light)] hover:text-white"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FiUser className="mr-3 h-5 w-5 text-gray-400" />
                        Profile
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex px-4 py-2 text-sm text-gray-300 hover:bg-[var(--dark-surface-light)] hover:text-white"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FiSettings className="mr-3 h-5 w-5 text-gray-400" />
                        Settings
                      </Link>
                    </div>
                    
                    <div className="py-1 border-t border-[var(--dark-border)]">
                      <button
                        className="flex w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[var(--dark-surface-light)] hover:text-white"
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                      >
                        <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-[var(--dark-surface-light)]"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? (
                  <FiX className="block h-6 w-6" />
                ) : (
                  <FiMenu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-[var(--dark-border)] bg-[var(--dark-surface)]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                    isActive(link.path)
                      ? 'bg-[var(--dark-surface-light)] text-white'
                      : 'text-gray-300 hover:bg-[var(--dark-surface-light)] hover:text-white'
                  }`}
                >
                  {link.icon}
                  <span className="ml-3">{link.text}</span>
                </Link>
              ))}
            </div>
            
            <div className="pt-4 pb-3 border-t border-[var(--dark-border)]">
              <div className="px-2 space-y-1">
                <Link
                  to={`/profile/${user.id}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[var(--dark-surface-light)] hover:text-white flex items-center"
                >
                  <FiUser className="mr-3 h-5 w-5" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[var(--dark-surface-light)] hover:text-white flex items-center"
                >
                  <FiSettings className="mr-3 h-5 w-5" />
                  Settings
                </Link>
                <button
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[var(--dark-surface-light)] hover:text-white flex items-center"
                >
                  <FiLogOut className="mr-3 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-0">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-[var(--dark-surface)] border-t border-[var(--dark-border)] mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
            <div>
              <div className="flex items-center">
                <FiCode className="h-6 w-6 text-[var(--primary)]" />
                <span className="ml-2 text-lg font-bold text-white">Skillora</span>
              </div>
              <p className="mt-2 text-sm text-gray-400 max-w-md">
                A programming-based education platform for sharing knowledge and creating personalized learning paths.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Features</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Learning Paths
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Code Examples
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Community
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Connect</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Feedback
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[var(--dark-border)] flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Skillora. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;