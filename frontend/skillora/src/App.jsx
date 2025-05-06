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
import ViewPlans from './pages/Nadee/ViewPlans';
import CreatePlan from './pages/Nadee/Plans';
import UpdatePlan from './pages/Nadee/UpdatePlan';
import { userService } from './services/ish/api';
import './App.css';

// Protected route component - checks if user is authenticated before rendering protected content
const ProtectedRoute = ({ children }) => {
  const userData = sessionStorage.getItem('userData');
  if (!userData) {
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

  return (
    <ThemeProvider>
      <UserProvider>
        <PostProvider>
          <Routes>
            {/* Public routes - accessible without authentication */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/" element={
              isAuthenticated ? (
                <Layout>
                  <Home />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/profile/:userId" element={
              isAuthenticated ? (
                <Layout>
                  <Profile />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/explore" element={
              isAuthenticated ? (
                <Layout>
                  <Explore />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/learning-plans" element={
              isAuthenticated ? (
                <Layout>
                  <LearningPlans />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/learning-plans/view" element={
              isAuthenticated ? (
                <Layout>
                  <ViewPlans />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/learning-plans/create" element={
              isAuthenticated ? (
                <Layout>
                  <CreatePlan />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/update-plan/:planId" element={
              isAuthenticated ? (
                <Layout>
                  <UpdatePlan />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/network" element={
              isAuthenticated ? (
                <Layout>
                  <Network />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/create-post" element={
              isAuthenticated ? (
                <Layout>
                  <CreatePost />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/posts/:postId" element={
              isAuthenticated ? (
                <Layout>
                  <PostDetail />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/posts/:postId/edit" element={
              isAuthenticated ? (
                <Layout>
                  <EditPost />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            
            {/* Not found route */}
            <Route path="*" element={
              isAuthenticated ? (
                <Layout>
                  <NotFound />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
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
