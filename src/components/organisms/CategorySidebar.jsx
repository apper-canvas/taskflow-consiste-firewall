import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory, categoryCounts }) => {
    return (
        <motion.div
            className="w-80 bg-white border-r border-gray-200 overflow-y-auto"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="p-6">
                <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">Categories</h2>

                <Button
                    onClick={() => onSelectCategory('all')}
                    className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 ${
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
                </Button>

                <div className="space-y-2">
                    {categories.map((category, index) => (
                        <motion.button
                            key={category.id}
                            onClick={() => onSelectCategory(category.id)}
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
    );
};

export default CategorySidebar;