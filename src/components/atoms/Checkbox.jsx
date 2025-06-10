import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ checked, onChange }) => {
    return (
        <motion.button
            onClick={onChange}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                checked
                    ? 'bg-semantic-success border-semantic-success'
                    : 'border-gray-300 hover:border-primary'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <AnimatePresence>
                {checked && (
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
    );
};

export default Checkbox;