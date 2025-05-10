import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound() {
  const navigate = useNavigate();
  
  const HomeIcon = getIcon('Home');
  const FileQuestionIcon = getIcon('FileQuestion');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto text-center"
      >
        <div className="mb-8">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="inline-block"
          >
            <FileQuestionIcon className="h-24 w-24 mx-auto text-primary" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-surface-800 dark:text-surface-100">
          Page Not Found
        </h2>
        
        <p className="text-surface-600 dark:text-surface-300 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="btn btn-primary px-6 py-3 flex items-center space-x-2 mx-auto"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Back to Home</span>
        </motion.button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-16 text-surface-500 dark:text-surface-400 text-sm"
      >
        <p>&copy; {new Date().getFullYear()} NexusNote. All rights reserved.</p>
      </motion.div>
    </div>
  );
}

export default NotFound;