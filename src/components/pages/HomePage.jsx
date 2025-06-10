import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { isToday, isPast, isFuture, parseISO } from 'date-fns';
import { taskService, categoryService } from '@/services';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import QuickAddTaskForm from '@/components/organisms/QuickAddTaskForm';
import TaskFilterBar from '@/components/organisms/TaskFilterBar';
import TaskListDisplay from '@/components/organisms/TaskListDisplay';
import PageLoadingSkeleton from '@/components/organisms/PageLoadingSkeleton';
import GlobalErrorDisplay from '@/components/organisms/GlobalErrorDisplay';

function HomePage() {
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

    useEffect(() => {
        loadData();
    }, []);

    const filteredTasks = tasks.filter(task => {
        if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) {
            return false;
        }

        if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
            return false;
        }

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

    const deleteTask = async (taskId) => {
        try {
            await taskService.delete(taskId);
            setTasks(prev => prev.filter(t => t.id !== taskId));
            toast.success('Task deleted');
        } catch (err) {
            toast.error('Failed to delete task');
        }
    };

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

    const getCategoryById = (id, cats) => {
        return cats.find(cat => cat.id === id);
    };

    const getCategoryCounts = () => {
        const counts = { all: tasks.length };
        categories.forEach(category => {
            counts[category.id] = tasks.filter(task => task.categoryId === category.id).length;
        });
        return counts;
    };

    const categoryCounts = getCategoryCounts();

    if (loading && tasks.length === 0) {
        return <PageLoadingSkeleton />;
    }

    if (error && tasks.length === 0) {
        return <GlobalErrorDisplay message={error} onRetry={loadData} />;
    }

    return (
        <div className="h-full flex">
            <CategorySidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                categoryCounts={categoryCounts}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white border-b border-gray-200 p-6">
                    <QuickAddTaskForm
                        newTaskTitle={newTaskTitle}
                        setNewTaskTitle={setNewTaskTitle}
                        newTaskPriority={newTaskPriority}
                        setNewTaskPriority={setNewTaskPriority}
                        newTaskCategory={newTaskCategory}
                        setNewTaskCategory={setNewTaskCategory}
                        newTaskDueDate={newTaskDueDate}
                        setNewTaskDueDate={setNewTaskDueDate}
                        categories={categories}
                        onSubmit={createTask}
                    />

                    <TaskFilterBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        priorityFilter={priorityFilter}
                        setPriorityFilter={setPriorityFilter}
                        dateFilter={dateFilter}
                        setDateFilter={setDateFilter}
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <TaskListDisplay
                        tasks={filteredTasks}
                        categories={categories}
                        onToggleTask={toggleTask}
                        onDeleteTask={deleteTask}
                        onUpdateTask={updateTask}
                        getCategoryById={getCategoryById}
                    />
                </div>
            </div>
        </div>
    );
}

export default HomePage;