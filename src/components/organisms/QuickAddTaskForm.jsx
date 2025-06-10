import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const QuickAddTaskForm = ({
    newTaskTitle,
    setNewTaskTitle,
    newTaskPriority,
    setNewTaskPriority,
    newTaskCategory,
    setNewTaskCategory,
    newTaskDueDate,
    setNewTaskDueDate,
    categories,
    onSubmit
}) => {
    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
    ];

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.name
    }));

    return (
        <form onSubmit={onSubmit} className="mb-6">
            <div className="flex space-x-3">
                <div className="flex-1">
                    <Input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Add a new task..."
                    />
                </div>
                <Select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    options={priorityOptions}
                    className="px-3 py-3"
                />
                <Select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    options={categoryOptions}
                    className="px-3 py-3"
                />
                <Input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="px-3 py-3"
                />
                <Button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!newTaskTitle.trim()}
                >
                    Add Task
                </Button>
            </div>
        </form>
    );
};

export default QuickAddTaskForm;