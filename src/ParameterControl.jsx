import React, { useState } from 'react';

import ParameterInput from './ParameterInput.jsx';
import ConnectionIndicator from './ConnectionIndicator.jsx';
import Modal from './Modal.jsx';
import StopIcon from '@mui/icons-material/Stop';
import HomeIcon from '@mui/icons-material/Home';

const ParameterControl = ({
  device, // State slice representing device, e.g. Grating.X
  deviceName,
  setTarget,
  setIncrement,
  backgroundColorClass = 'bg-slate-600',
  labelColorClass = 'text-slate-100',
  buttonColorClass = 'bg-slate-300',

  currentValueTextColorClass = 'text-yellow-300',
  currentValueBackgroundColorClass = 'bg-red-700',
  targetValueTextColorClass = 'text-blue-700',
  targetValueBackgroundColorClass = 'bg-orange-200',
  incrementValueBackgroundColorClass = 'bg-yellow-200',
  currenValueBfOff = false,

  showUnits = true,
  showPositionStores = true,
  showIncrementControls = true,
  showStopButton = true,
  showHomeButton = false,
  showSetPositionField = true,
  showLabel = true,
  label = 'Motor Axis',
  onHome = null,
  onStop = null,
  onValidationError = null, // Optional callback: ({ deviceName, requested, min, max, clamped, unit, error }) => void

  // Status indicator props
  requiresHome = false,
  isMoving = false,

  widthNameClass = 'w-36',
}) => {
  // Device state
  const currentPositionRaw  = device?.current ?? 0;
  const config              = device?.config ?? {};
  const isConnected         = device?.isConnected ?? false;
  const target              = device?.target ?? 0;
  const increment           = device?.increment ?? 1;
  const isHomed             = device?.isHomed ?? true;
  
  // Calculate if inputs should be disabled (not homed when homing is required)
  const isInputDisabled = requiresHome && !isHomed;


  // Local state
  const [unitSelectedIndex, setUnitSelectedIndex] = useState(0); 
  const [storeSelectedIndex, setStoreSelectedIndex] = useState(0);
  const [validationError, setValidationError] = useState(null);
  const [showHomeModal, setShowHomeModal] = useState(false);

  
  if (!isConnected){
    currentValueBackgroundColorClass = 'bg-cb'
    currentValueTextColorClass = 'text-gray-300'
  }


  const handleDecrement = () => {
    const proposedValue = rawToCalibrated(Number(target)) - increment;
    const validation = validatePositionRange(proposedValue, true);
    
    // Always set the target to the validated value (either original or clamped)
    setTarget(displayToRaw(validation.value));
    
    if (validation.isValid) {
      setValidationError(null);
    } else {
      setValidationError(validation.error);
      setTimeout(() => setValidationError(null), 3000);
    }
  };

  const handleIncrement = () => {
    const proposedValue = rawToCalibrated(Number(target)) + increment;
    const validation = validatePositionRange(proposedValue, true);
    
    // Always set the target to the validated value (either original or clamped)
    setTarget(displayToRaw(validation.value));
    
    if (validation.isValid) {
      setValidationError(null);
    } else {
      setValidationError(validation.error);
      setTimeout(() => setValidationError(null), 3000);
    }
  };

  const handleStop = () => {
    if (onStop) {
      onStop();
    }
  };

  const handleHomeClick = () => {
    setShowHomeModal(true);
  };

  const handleHomeConfirm = () => {
    if (onHome) {
      onHome();
    }
    setShowHomeModal(false);
  };

  const handleHomeCancel = () => {
    setShowHomeModal(false);
  };

  const handleUnitDropdownChange = (event) => {
    const index = event.target.selectedIndex;
    setUnitSelectedIndex(index);
    console.log(`${deviceName}: Selected unit index:`, index);
  };

  const handleStoreDropdownChange = (event) => {
    const index = event.target.selectedIndex;
    setStoreSelectedIndex(index);

    const stores = config?.stores;
    if (!stores) {
      return;
    }
    const store = stores[storeSelectedIndex];
    const validation = validatePositionRange(rawToCalibrated(store.raw), true);
    
    // Always set the target to the validated value (either original or clamped)
    setTarget(displayToRaw(validation.value));
    
    if (validation.isValid) {
      setValidationError(null);
    } else {
      setValidationError(validation.error);
      setTimeout(() => setValidationError(null), 3000);
    }

    console.log(`${deviceName}: Selected store index:`, index);
  };

  const validatePositionRange = (displayValue, returnValidation = false) => {
    const min = config?.min;
    const max = config?.max;
    
    // Convert display value to raw value for validation
    const rawValue = displayToRaw(displayValue);
    
    if (returnValidation) {
      if (min !== undefined && rawValue < min) {
        const clampedRaw = min;
        const clampedDisplay = rawToCalibrated(clampedRaw);
        const units = config?.units?.[unitSelectedIndex];
        const unitName = units?.name || '';
        
        const error = `Value ${displayValue.toFixed(3)}${unitName} is below minimum limit of ${rawToCalibrated(min).toFixed(3)}${unitName}`;

        // Optional validation error callback
        onValidationError?.({
          deviceName,
          requested: displayValue,
          min: rawToCalibrated(min),
          max: rawToCalibrated(max ?? Infinity),
          clamped: clampedDisplay,
          unit: unitName,
          error
        });

        return {
          isValid: false,
          value: clampedDisplay,
          error
        };
      }
      if (max !== undefined && rawValue > max) {
        const clampedRaw = max;
        const clampedDisplay = rawToCalibrated(clampedRaw);
        const units = config?.units?.[unitSelectedIndex];
        const unitName = units?.name || '';
        
        const error = `Value ${displayValue.toFixed(3)}${unitName} is above maximum limit of ${rawToCalibrated(max).toFixed(3)}${unitName}`;

        // Optional validation error callback
        onValidationError?.({
          deviceName,
          requested: displayValue,
          min: rawToCalibrated(min ?? -Infinity),
          max: rawToCalibrated(max),
          clamped: clampedDisplay,
          unit: unitName,
          error
        });

        return {
          isValid: false,
          value: clampedDisplay,
          error
        };
      }
      return { isValid: true, value: displayValue, error: null };
    }
    
    // Legacy behavior for backward compatibility - validate raw value
    if (min !== undefined && rawValue < min) {
      return rawToCalibrated(min);
    }
    if (max !== undefined && rawValue > max) {
      return rawToCalibrated(max);
    }
    return displayValue;
  };

  const rawToCalibrated = (value, toPrecisionString = false) => {
    const units = config?.units;
    if (!units) {
      return value;
    }
    const unit = units[unitSelectedIndex];

    if (toPrecisionString) {
      return (value * unit.slope + unit.offset).toFixed(unit.precision);
    } else {
      return (value * unit.slope + unit.offset);
    }
  };

  const displayToRaw = (value) => {
    const units = config?.units;
    if (!units) {
      return value;
    }
    const unit = units[unitSelectedIndex];

    return (value - unit.offset) / unit.slope;
  };


  return (
    <div className={`flex items-center relative  text-black p-1 rounded-md`}>
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
        <ConnectionIndicator 
          isConnected={isConnected} 
          isHomed={requiresHome ? isHomed : true}
          isMoving={isMoving}
        />
      </div>
      {showLabel && (
        <div className={`p-0 ml-6 mr-1 ${widthNameClass} ${labelColorClass} text-left font-medium text-lg`}>
          {label}
        </div>
      )}
  
      <div className={` p-0 ml-1 w-24 rounded text-center text-lg font-bold ${!currenValueBfOff && currentValueBackgroundColorClass} ${currentValueTextColorClass}`}>
        {rawToCalibrated(currentPositionRaw, true)}
      </div>
  
      {showSetPositionField && (
        <div className="mx-2 w-24">
          <ParameterInput
            id="target"
            label=""
            selector={() => rawToCalibrated(target, true)}
            action={(value) => {
              const proposedValue = Number(value);
              const validation = validatePositionRange(proposedValue, true);
              
              // Always set the target to the validated value (either original or clamped)
              setTarget(displayToRaw(validation.value));
              
              if (validation.isValid) {
                setValidationError(null);
              } else {
                setValidationError(validation.error);
                setTimeout(() => setValidationError(null), 3000);
              }
            }}
            type="inline"
            bgColorClass={targetValueBackgroundColorClass}
            textColorClass={targetValueTextColorClass}
            selectOnFocus = {true}
            commitOnChange = {false}
            disabled={isInputDisabled}
          />
        </div>
      )}
  
      {showIncrementControls && (
        <button
          className={`p-1 mx-1 border rounded w-8 h-full flex items-center text-sm font-bold justify-center ${buttonColorClass} ${isInputDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleDecrement}
          disabled={isInputDisabled}
        >
          -
        </button>
      )}
  
      {showIncrementControls && (
        <div className="w-16">
          <ParameterInput
            id="increment"
            selector={() => increment.toString()}
            action={(value) => {
              setIncrement(Number(value));
            }}
            widthClass = 'max-w-24'
            type="inline"
            bgColorClass={incrementValueBackgroundColorClass}
            textColorClass='#78350f'
            selectOnFocus = {true}
            commitOnChange = {false}
            disabled={isInputDisabled}
          />
        </div>
      )}
  
      {showIncrementControls && (
        <button
          className={`p-1 mx-1 rounded w-8 h-full flex items-center font-bold  text-sm justify-center ${buttonColorClass} ${isInputDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleIncrement}
          disabled={isInputDisabled}
        >
          +
        </button>
      )}
  
      {showUnits && config?.units && (
        <div className="p-1 mx-1">
          <select onChange={handleUnitDropdownChange} className="border rounded w-full px-1 py-1 text-sm">
            {config.units.map((unit, idx) => (
              <option key={`unit-${idx}`} value={unit.name}>{unit.name}</option>
            ))}
          </select>
        </div>
      )}
  
      {showPositionStores && config?.stores && (
        <div className="p-1 mx-1">
          <select onChange={handleStoreDropdownChange} className="border rounded w-full px-1 py-1 text-sm">
            {config.stores.map((store, idx) => (
              <option key={`store-${idx}`} value={store.name}>{store.name}</option>
            ))}
          </select>
        </div>
      )}
  
      {showStopButton && (
        <button
          className="p-1 mx-1 border rounded bg-red-500 hover:bg-red-600 text-white h-full text-sm flex items-center justify-center min-w-[2rem]"
          onClick={handleStop}
          title="Stop Motor"
        >
          <StopIcon fontSize="small" />
        </button>
      )}

      {showHomeButton && (
        <button
          className="p-1 mx-1 border rounded bg-purple-500 hover:bg-purple-600 text-white h-full text-sm flex items-center justify-center min-w-[2rem]"
          onClick={handleHomeClick}
          title="Home Motor"
        >
          <HomeIcon fontSize="small" />
        </button>
      )}
      
      {validationError && (
        <div className="absolute z-20 mt-12 p-2 bg-red-600 text-white text-xs rounded shadow-lg whitespace-nowrap border border-red-400 max-w-xs">
          <div className="flex items-center">
            <span className="mr-1">⚠️</span>
            <span>{validationError}</span>
          </div>
        </div>
      )}

      <Modal
        isOpen={showHomeModal}
        onClose={handleHomeCancel}
        onConfirm={handleHomeConfirm}
        onCancel={handleHomeCancel}
        title="Home Motor"
        confirmText="Home"
        confirmButtonClass="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <p className="text-slate-200">
          Are you sure you want to home the <strong className="text-slate-100">{label}</strong> axis? 
          This will move the motor to its home position.
        </p>
      </Modal>
    </div>
  );
};

export default ParameterControl;
