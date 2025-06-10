import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './components/ApperIcon';

function Layout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between h-full px-6">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-heading font-bold text-gray-900">TaskFlow</h1>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-sm text-gray-600">
              Today
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">T</span>
            </div>
          </motion.div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;