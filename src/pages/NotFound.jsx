import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

function NotFound() {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <motion.div
        className="text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="FileQuestion" className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/tasks"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium transition-all"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            <span>Back to Tasks</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFound;