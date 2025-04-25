import { motion } from 'framer-motion';
import PostItem from './PostItem';

const PostList = ({ posts }) => {
  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <PostItem post={post} />
        </motion.div>
      ))}
    </div>
  );
};

export default PostList;