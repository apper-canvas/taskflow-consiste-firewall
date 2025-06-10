import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, type = 'button', disabled = false, whileHover, whileTap }) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            className={`transition-all ${className}`}
            disabled={disabled}
            whileHover={whileHover}
            whileTap={whileTap}
        >
            {children}
        </motion.button>
    );
};

export default Button;