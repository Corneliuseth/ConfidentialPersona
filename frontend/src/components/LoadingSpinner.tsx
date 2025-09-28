import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return { width: '20px', height: '20px' };
      case 'large':
        return { width: '60px', height: '60px' };
      default:
        return { width: '40px', height: '40px' };
    }
  };

  return (
    <div className="loading">
      <div
        className="spinner"
        style={getSpinnerSize()}
      />
      {message && <p>{message}</p>}
    </div>
  );
};