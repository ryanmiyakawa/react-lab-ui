import React from 'react';
import ParameterControl from './ParameterControl.jsx';

const ParameterDisplay = ({ 
  requiresHome = false, 
  isHomed = true, 
  isMoving = false, 
  ...props 
}) => {
  return (
    <ParameterControl
      {...props}
      requiresHome={requiresHome}
      isHomed={isHomed}
      isMoving={isMoving}
      showSetPositionField={false}
      showIncrementControls={false}
      showStopButton={false}
      showPositionStores={false}
    />
  );
};

export default ParameterDisplay;