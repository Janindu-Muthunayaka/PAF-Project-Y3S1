import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <UserProvider>
          <PostProvider>
            <Layout>
              <Routes>
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