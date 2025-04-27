import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { UserProvider } from './context/ish/UserContext';
import { PostProvider } from './context/ish/PostContext';
import { ThemeProvider } from './context/ish/ThemeContext';
import Layout from './components/ish/Layout';
import Home from './pages/ish/Home';
import Profile from './pages/ish/Profile';
import Explore from './pages/ish/Explore';
import LearningPlans from './pages/ish/LearningPlans';
import Network from './pages/ish/Network';
import CreatePost from './pages/ish/CreatePost';
import EditPost from './pages/ish/EditPost';
import PostDetail from './pages/ish/PostDetail';
import NotFound from './pages/ish/NotFound';
import LoginPage from './pages/Bumal/LoginPage';
import RegisterPage from './pages/Bumal/Registerpage';
import { userService } from './services/ish/api';
import './App.css';

// Protected route component - checks if user is authenticated before rendering protected content
const ProtectedRoute = ({ children }) => {
  const userData = sessionStorage.getItem('userData');
  
  if (!userData) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Main App Content - handles authentication state and routing
const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  
  // Check authentication status on component mount and location change
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("\n[App.jsx] Checking Authentication");
        console.log("Location:", location.pathname);
        
        // First check session storage for normal login
        const userData = sessionStorage.getItem('userData');
        if (userData) {
          console.log("Found user data in session storage");
          setIsAuthenticated(true);
          return;
        }
        
        // If no session storage, check backend session for Google login
        try {
          const response = await userService.getSessionUser();
          console.log("Session Check Response:", response.data);
          
          if (response.data) {
            // Store user data in session storage and update auth state
            sessionStorage.setItem('userData', JSON.stringify(response.data));
            console.log("User data stored in session:", response.data);
            setIsAuthenticated(true);
          }
        } catch (sessionError) {
          console.log("No active session found");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        sessionStorage.removeItem('userData');
      }
    };

    checkAuth();
  }, [location]);

  // Don't redirect if we're on the login page or OAuth2 callback
  // This prevents redirect loops during authentication
  if (!isAuthenticated && 
      location.pathname !== '/login' && 
      location.pathname !== '/register' && 
      !location.search.includes('code=')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ThemeProvider>
      <UserProvider>
        <PostProvider>
          <Routes>
            {/* Public routes - accessible without authentication */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
            } />
            
            {/* Protected routes - require authentication */}
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
            <Route path="/profile/:userId" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/explore" element={
              <ProtectedRoute>
                <Layout>
                  <Explore />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/learning-plans" element={
              <ProtectedRoute>
                <Layout>
                  <LearningPlans />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/network" element={
              <ProtectedRoute>
                <Layout>
                  <Network />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/create-post" element={
              <ProtectedRoute>
                <Layout>
                  <CreatePost />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/posts/:postId" element={
              <ProtectedRoute>
                <Layout>
                  <PostDetail />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/posts/:postId/edit" element={
              <ProtectedRoute>
                <Layout>
                  <EditPost />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Not found route - also protected */}
            <Route path="*" element={
              <ProtectedRoute>
                <Layout>
                  <NotFound />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </PostProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;