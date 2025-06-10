import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const priorityColors = {
    high: 'bg-gradient-to-r from-semantic-error to-orange-500',
    medium: 'bg-gradient-to-r from-primary to-secondary',
    low: 'bg-gray-400'
};

const TaskCard = ({ task, category, onToggle, onDelete, onUpdate }) => {
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
                <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} />

                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <div className="space-y-3">
                            <Input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={handleKeyPress}
                                onBlur={handleSave}
                                autoFocus
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            />
                            <div className="flex space-x-2">
                                <Select
                                    value={editPriority}
                                    onChange={(e) => setEditPriority(e.target.value)}
                                    options={[
                                        { value: 'low', label: 'Low' },
                                        { value: 'medium', label: 'Medium' },
                                        { value: 'high', label: 'High' }
                                    ]}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                                <Input
                                    type="date"
                                    value={editDueDate}
                                    onChange={(e) => setEditDueDate(e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                                <Button
                                    onClick={handleSave}
                                    className="px-3 py-1 bg-semantic-success text-white rounded text-sm hover:bg-semantic-success/90"
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                                >
                                    Cancel
                                </Button>
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

                                <Badge className={`${priorityColors[task.priority]} text-white`}>
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-sm text-gray-500">
                                    {category && (
                                        <div className="flex items-center space-x-1">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: category.color }}
                                            ></div>
                                            <span>{category.name}</span>
                                        </div>
                                    )}

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

                                <div className="flex items-center space-x-1">
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="p-1 text-gray-400 hover:text-primary"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <ApperIcon name="Edit2" size={16} />
                                    </Button>
                                    <Button
                                        onClick={() => onDelete(task.id)}
                                        className="p-1 text-gray-400 hover:text-semantic-error"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <ApperIcon name="Trash2" size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;