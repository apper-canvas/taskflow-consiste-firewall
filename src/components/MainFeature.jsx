import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import ApperIcon from './ApperIcon';

const priorityColors = {
  high: 'bg-gradient-to-r from-semantic-error to-orange-500',
  medium: 'bg-gradient-to-r from-primary to-secondary',
  low: 'bg-gray-400'
};

const priorityTextColors = {
  high: 'text-semantic-error',
  medium: 'text-primary',
  low: 'text-gray-500'
};

function TaskItem({ task, category, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

  const handleSave = () => {
    if (editTitle.trim() !== task.title || editPriority !== task.priority || editDueDate !== (task.dueDate || '')) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        priority: editPriority,
        dueDate: editDueDate || null
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));
  const isDueToday = task.dueDate && isToday(parseISO(task.dueDate));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all ${
        task.completed ? 'opacity-60' : ''
      }`}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <motion.button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-semantic-success border-semantic-success'
              : 'border-gray-300 hover:border-primary'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence>
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <ApperIcon name="Check" size={16} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSave}
                autoFocus
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <div className="flex space-x-2">
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-semantic-success text-white rounded text-sm hover:bg-semantic-success/90"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 
                  className={`font-medium break-words ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}
                  onDoubleClick={() => setIsEditing(true)}
                >
                  {task.title}
                </h3>
                
                {/* Priority Badge */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]} text-white`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  {/* Category */}
                  {category && (
                    <div className="flex items-center space-x-1">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span>{category.name}</span>
                    </div>
                  )}

                  {/* Due Date */}
                  {task.dueDate && (
                    <div className={`flex items-center space-x-1 ${
                      isOverdue ? 'text-semantic-error' : isDueToday ? 'text-accent' : 'text-gray-500'
                    }`}>
                      <ApperIcon name="Calendar" size={14} />
                      <span>
                        {isToday(parseISO(task.dueDate)) 
                          ? 'Today' 
                          : format(parseISO(task.dueDate), 'MMM d')
                        }
                      </span>
                      {isOverdue && <ApperIcon name="AlertCircle" size={14} />}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1">
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-gray-400 hover:text-primary transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </motion.button>
                  <motion.button
                    onClick={() => onDelete(task.id)}
                    className="p-1 text-gray-400 hover:text-semantic-error transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MainFeature({ tasks, categories, onToggleTask, onDeleteTask, onUpdateTask, getCategoryById, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="animate-pulse flex space-x-3">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-16"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="CheckSquare" className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        </motion.div>
        <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-600 mb-6">
          Get started by adding your first task above
        </p>
        <motion.div
          className="text-6xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          📝
        </motion.div>
      </motion.div>
    );
  }

  // Separate completed and active tasks
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div>
          <motion.h2 
            className="text-lg font-heading font-semibold text-gray-900 mb-4 flex items-center space-x-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <ApperIcon name="Clock" size={20} className="text-primary" />
            <span>Active Tasks ({activeTasks.length})</span>
          </motion.h2>
          
          <motion.div className="space-y-3">
            <AnimatePresence>
              {activeTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TaskItem
                    task={task}
                    category={getCategoryById(task.categoryId)}
                    onToggle={onToggleTask}
                    onDelete={onDeleteTask}
                    onUpdate={onUpdateTask}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <motion.h2 
            className="text-lg font-heading font-semibold text-gray-900 mb-4 flex items-center space-x-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ApperIcon name="CheckCircle" size={20} className="text-semantic-success" />
            <span>Completed ({completedTasks.length})</span>
          </motion.h2>
          
          <motion.div className="space-y-3">
            <AnimatePresence>
              {completedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TaskItem
                    task={task}
                    category={getCategoryById(task.categoryId)}
                    onToggle={onToggleTask}
                    onDelete={onDeleteTask}
                    onUpdate={onUpdateTask}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default MainFeature;