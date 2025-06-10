import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const GlobalErrorDisplay = ({ message, onRetry }) => {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="text-center">
                <ApperIcon name="AlertCircle" className="w-12 h-12 text-semantic-error mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-600 mb-4">{message}</p>
                <Button
                    onClick={onRetry}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                    Try Again
                </Button>
            </div>
        </div>
    );
};

export default GlobalErrorDisplay;