import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isPast, isFuture, parseISO } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';
import { taskService, categoryService } from '../services';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tasksResult, categoriesResult] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ]);
        setTasks(tasksResult);
        setCategories(categoriesResult);
        if (categoriesResult.length > 0 && !newTaskCategory) {
          setNewTaskCategory(categoriesResult[0].id);
        }
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    // Category filter
    if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) {
      return false;
    }
    
    // Search filter
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      if (!task.dueDate) return dateFilter === 'no-date';
      
      const dueDate = parseISO(task.dueDate);
      switch (dateFilter) {
        case 'today':
          return isToday(dueDate);
        case 'overdue':
          return isPast(dueDate) && !isToday(dueDate);
        case 'upcoming':
          return isFuture(dueDate);
        default:
          return true;
      }
    }
    
    return true;
  });

  // Create new task
  const createTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const newTask = await taskService.create({
        title: newTaskTitle.trim(),
        priority: newTaskPriority,
        categoryId: newTaskCategory,
        dueDate: newTaskDueDate || null,
        completed: false
      });
      
      setTasks(prev => [newTask, ...prev]);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed
      });
      
      setTasks(prev => 
        prev.map(t => t.id === taskId ? updatedTask : t)
      );
      
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  // Update task
  const updateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => 
        prev.map(t => t.id === taskId ? updatedTask : t)
      );
      toast.success('Task updated');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  // Get category by id
  const getCategoryById = (id) => {
    return categories.find(cat => cat.id === id);
  };

  // Get task counts by category
  const getCategoryCounts = () => {
    const counts = { all: tasks.length };
    categories.forEach(category => {
      counts[category.id] = tasks.filter(task => task.categoryId === category.id).length;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  if (loading && tasks.length === 0) {
    return (
      <div className="h-full flex">
        {/* Sidebar skeleton */}
        <div className="w-80 bg-white border-r border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Main content skeleton */}
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-semantic-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Category Sidebar */}
      <motion.div 
        className="w-80 bg-white border-r border-gray-200 overflow-y-auto"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">Categories</h2>
          
          {/* All Tasks */}
          <motion.button
            onClick={() => setSelectedCategory('all')}
            className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition-all ${
              selectedCategory === 'all' 
                ? 'bg-primary text-white' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <ApperIcon name="Inbox" size={20} />
              <span className="font-medium">All Tasks</span>
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${
              selectedCategory === 'all' 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {categoryCounts.all}
            </span>
          </motion.button>

          {/* Category List */}
          <div className="space-y-2">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  selectedCategory === category.id 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={{
                  borderLeft: selectedCategory !== category.id ? `4px solid ${category.color}` : 'none'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  selectedCategory === category.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {categoryCounts[category.id] || 0}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Filter Bar */}
        <motion.div 
          className="bg-white border-b border-gray-200 p-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Quick Add Task */}
          <form onSubmit={createTask} className="mb-6">
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new task..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <motion.button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!newTaskTitle.trim()}
              >
                Add Task
              </motion.button>
            </div>
          </form>

          {/* Search and Filters */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="all">All Dates</option>
              <option value="today">Due Today</option>
              <option value="overdue">Overdue</option>
              <option value="upcoming">Upcoming</option>
              <option value="no-date">No Due Date</option>
            </select>
          </div>
        </motion.div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6">
          <MainFeature 
            tasks={filteredTasks}
            categories={categories}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onUpdateTask={updateTask}
            getCategoryById={getCategoryById}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;