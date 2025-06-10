import React from 'react';

const PageLoadingSkeleton = () => {
    return (
        <div className="h-full flex">
            {/* Sidebar skeleton */}
            <div className="w-80 bg-white border-r border-gray-200 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-10 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>

            {/* Main content skeleton */}
            <div className="flex-1 p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PageLoadingSkeleton;