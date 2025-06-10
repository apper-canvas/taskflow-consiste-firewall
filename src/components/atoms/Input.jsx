import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', autoFocus, onBlur, onKeyDown, ...props }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${className}`}
            autoFocus={autoFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            {...props}
        />
    );
};

export default Input;