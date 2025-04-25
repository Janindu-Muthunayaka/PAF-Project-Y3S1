import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Plans from './pages/Nadee/Plans';  
import ViewPlans from './pages/Nadee/ViewPlans'; // Import ViewPlans
import UpdatePlan from './pages/Nadee/UpdatePlan'; // Import UpdatePlan
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const userData = localStorage.getItem('userData');
  
  if (!userData) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  // Check if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if userData exists in localStorage
    const userData = localStorage.getItem('userData');
    setIsAuthenticated(!!userData);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <UserProvider>
          <PostProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
              } />
              <Route path="/register" element={
                isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
              } />
              
              {/* Protected routes wrapped with Layout */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
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

              <Route path="/learning-plans/create" element={
                <ProtectedRoute>
                  <Layout>
                    <Plans />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/learning-plans/view" element={
                <ProtectedRoute>
                  <Layout>
                    <ViewPlans />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Add the route for UpdatePlan */}
              <Route path="/update-plan/:planId" element={
                <ProtectedRoute>
                  <Layout>
                    <UpdatePlan />
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
              
              {/* Default redirect to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
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
      </Router>
    </ThemeProvider>
  );
}

export default App;