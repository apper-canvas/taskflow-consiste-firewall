import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TaskCard from '@/components/molecules/TaskCard';

const TaskListDisplay = ({ tasks, categories, onToggleTask, onDeleteTask, onUpdateTask, getCategoryById }) => {
    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

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

    return (
        <div className="space-y-6">
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
                                    <TaskCard
                                        task={task}
                                        category={getCategoryById(task.categoryId, categories)}
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
                                    <TaskCard
                                        task={task}
                                        category={getCategoryById(task.categoryId, categories)}
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
};

export default TaskListDisplay;