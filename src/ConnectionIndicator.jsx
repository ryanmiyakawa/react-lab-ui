import React from 'react';

const ConnectionIndicator = ({ 
  isConnected = false, 
  isHomed = true,
  isMoving = false,
  size = 'w-2 h-2',
  className = '' 
}) => {
  const getColor = () => {
    if (!isConnected) return 'bg-red-500';      // Not connected: red
    if (isMoving) return 'bg-yellow-500';       // Moving: yellow
    if (!isHomed) return 'bg-purple-500';       // Not homed: purple
    return 'bg-green-500';                      // Connected and ready: green
  };

  return (
    <div className={`rounded-full ${size} ${getColor()} ${className}`}></div>
  );
};

export default ConnectionIndicator;