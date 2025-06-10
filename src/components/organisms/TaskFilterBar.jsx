import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const TaskFilterBar = ({
    searchTerm,
    setSearchTerm,
    priorityFilter,
    setPriorityFilter,
    dateFilter,
    setDateFilter
}) => {
    const priorityOptions = [
        { value: 'all', label: 'All Priorities' },
        { value: 'high', label: 'High Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'low', label: 'Low Priority' }
    ];

    const dateOptions = [
        { value: 'all', label: 'All Dates' },
        { value: 'today', label: 'Due Today' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'no-date', label: 'No Due Date' }
    ];

    return (
        <div className="flex space-x-4">
            <div className="flex-1 relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tasks..."
                    className="pl-10 pr-4 py-2"
                />
            </div>

            <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                options={priorityOptions}
                className="px-3 py-2"
            />

            <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                options={dateOptions}
                className="px-3 py-2"
            />
        </div>
    );
};

export default TaskFilterBar;