import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { UserProvider } from './context/ish/UserContext';
import { PostProvider } from './context/ish/PostContext';
import { ThemeProvider } from './context/ish/ThemeContext';

// Layout
import Layout from './components/ish/Layout';
import { Toaster } from 'react-hot-toast';

// Public and Private Routes
import PublicRoutes from './components/PrivateRoutes/PublicRoutes';
import UserPrivateRoute from './components/PrivateRoutes/UserPrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import UserRegisterPage from './pages/UserRegisterPage';
import UserLoginPage from './pages/UserLoginPage';
import ProfilePage from './pages/ProfilePage';
import ViewProfilePage from './pages/ViewProfilePage';
import UserSearchPage from './pages/UserSearchPage';
import Home from './pages/ish/Home';
import Profile from './pages/ish/Profile';
import Explore from './pages/ish/Explore';
import LearningPlans from './pages/ish/LearningPlans';
import Network from './pages/ish/Network';
import CreatePost from './pages/ish/CreatePost';
import EditPost from './pages/ish/EditPost';
import PostDetail from './pages/ish/PostDetail';
import NotFound from './pages/ish/NotFound';

function App() {
  return (
    <ThemeProvider>
      <Toaster />
      <Router>
        <UserProvider>
          <PostProvider>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="" element={<PublicRoutes />}>
                  <Route path="/register" element={<UserRegisterPage />} />
                  <Route path="/login" element={<UserLoginPage />} />
                </Route>

                {/* Private Routes for Users */}
                <Route path="" element={<UserPrivateRoute />}>
                  <Route index={true} path="/" element={<HomePage />} />
                  <Route path="/myprofile" element={<ProfilePage />} />
                  <Route path="/viewprofile/:id/:id2" element={<ViewProfilePage />} />
                  <Route path="/usersearch" element={<UserSearchPage />} />
                </Route>

                {/* Posting and Commenting Features */}
                <Route path="/" element={<Home />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/learning-plans" element={<LearningPlans />} />
                <Route path="/network" element={<Network />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/posts/:postId" element={<PostDetail />} />
                <Route path="/posts/:postId/edit" element={<EditPost />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
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