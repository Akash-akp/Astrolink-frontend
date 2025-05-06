import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-purple-200 border-t-purple-700`} />
    </div>
  );
};

export default LoadingSpinner;