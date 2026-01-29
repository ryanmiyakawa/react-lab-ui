import React, { useState, useEffect, useRef } from "react";
import ConnectionIndicator from './ConnectionIndicator.jsx';

/**
 * ParameterInput
 * --------------
 * A controlled native HTML input that keeps a *local* editing buffer while staying
 * in sync with a *zustand* store.
 *
 * Props
 * -----
 * id              : string      – unique identifier for the parameter (passed to `action` on commit)
 * label           : string      – input label (displayed above input)
 * selector        : (state) => any – zustand selector returning the *external* value
 * action          : (id,value) => void – zustand action that commits the value
 * selectOnFocus   : boolean     – if true, selects all text when the input receives focus (default: false)
 * commitOnChange  : boolean     – if true, writes to zustand on every keystroke (default: false; commits on blur)
 * type            : string      – input type: "text", "numeric", or "inline"
 * widthClass      : string      – Tailwind width class for the container
 * bgColorClass    : string      – Tailwind background color class (default: "bg-slate-600")
 * textColorClass  : string      – Tailwind text color class (default: "text-white")
 *
 * How it works
 * -------------
 * • `localValue`   reflects what the user sees/edits.
 * • When *not* editing (`isEditing` = false) we mirror the zustand value ➜ localValue.
 * • While editing, zustand updates are ignored so the cursor doesn't jump.
 * • On *blur* (or immediately if `commitOnChange`) we fire `action(id, value)` to
 *   synchronize with the global store.
 */
const ParameterInput = ({
  id,
  label = "",
  selector,
  action,
  type = "text",
  selectOnFocus = false,
  commitOnChange = false,
  disabled = false,
  widthClass = null,
  bgColorClass = "bg-slate-600",
  textColorClass = "text-white",
  isConnected = null,
  isHomed = true,
  isMoving = false,
  showConnectionIndicator = false,
  ...inputProps
}) => {
  // -------- zustand subscription ----------------------------------------
  const externalValue = selector(); // selector must be a *hook* created with the store

  // -------- local edit buffer -------------------------------------------
  const [localValue, setLocalValue] = useState(externalValue ?? "");
  const isEditing = useRef(false);

  // When *external* value changes & we are *not* editing, refresh localValue
  useEffect(() => {
    if (!isEditing.current) {
      setLocalValue(externalValue ?? "");
    }
  }, [externalValue]);

  // -------- handlers ----------------------------------------------------
  const commit = (value) => action(value);

  const formatNumericValue = (value) => {
    if (type !== "numeric") return value;
    
    // Try to parse as a number and reformat scientific notation
    const num = parseFloat(value);
    if (!isNaN(num) && isFinite(num)) {
      // If the original value contained 'e' or 'E', preserve scientific notation
      if (value.toLowerCase().includes('e')) {
        return num.toExponential();
      }
      return num.toString();
    }
    return value;
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setLocalValue(v);
    if (commitOnChange) commit(v);
    isEditing.current = true;
  };

  const handleBlur = () => {
    let valueToCommit = localValue;
    
    // Format numeric values on blur
    if (type === "numeric") {
      const formatted = formatNumericValue(localValue);
      if (formatted !== localValue) {
        setLocalValue(formatted);
        valueToCommit = formatted;
      }
    }
    
    if (!commitOnChange && valueToCommit !== externalValue) {
      commit(valueToCommit);
    }
    isEditing.current = false;
  };

  const handleFocus = (e) => {
    if (selectOnFocus) {
      // defer select() so it doesn't override MUI's onFocus handling
      setTimeout(() => e.target.select(), 0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  // -------- render ------------------------------------------------------
  const baseInputClasses = `
    w-full px-3 py-2 rounded-md border border-gray-600 box-border
    font-sans text-base
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-colors duration-200
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
    ${textColorClass} ${bgColorClass}
  `;

  const numericInputClasses = `
    ${baseInputClasses} font-bold text-lg text-left
    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
  `;

  const inlineInputClasses = `
    px-2 py-0.5 rounded border border-gray-600 h-7 min-w-0 w-full box-border
    font-sans font-bold text-lg text-center
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
    transition-colors duration-200
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${textColorClass} ${bgColorClass}
    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
  `;

  switch (type) {
    case "numeric":
      return (
        <div className={`relative ${widthClass ?? 'max-w-36'}`}>
          {showConnectionIndicator && isConnected !== null && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6">
              <ConnectionIndicator isConnected={isConnected} isHomed={isHomed} isMoving={isMoving} size="w-2 h-2" />
            </div>
          )}
          {label && (
            <label className="block text-left text-sm font-medium text-gray-300 mb-1 font-sans pl-4">
              {label}
            </label>
          )}
          <input
            type="number"
            value={localValue}
            onClick={(e) => e.target.select()}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            className={numericInputClasses}
            {...inputProps}
          />
        </div>
      );

    case "text":
      return (
        <div className={widthClass ?? 'max-w-xs'}>
          {label && (
            <label className="text-left text-sm font-medium text-gray-300 mb-1 font-sans flex items-center gap-2">
              {showConnectionIndicator && isConnected !== null && (
                <ConnectionIndicator isConnected={isConnected} isHomed={isHomed} isMoving={isMoving} size="w-2 h-2" />
              )}
              <span>{label}</span>
            </label>
          )}
          <input
            type="text"
            value={localValue}
            onClick={(e) => e.target.select()}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            className={baseInputClasses}
            {...inputProps}
          />
        </div>
      );

    case "inline":
      return (
        <div className={`mx-0.5 inline-input ${widthClass ?? 'max-w-24'}`}>
          <input
            type="number"
            value={localValue}
            onClick={(e) => e.target.select()}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            className={inlineInputClasses}
            {...inputProps}
          />
        </div>
      );

    default:
      return (
        <div className={widthClass ?? 'max-w-xs'}>
          {label && (
            <label className="text-left text-sm font-medium text-gray-300 mb-1 font-sans flex items-center gap-2">
              {showConnectionIndicator && isConnected !== null && (
                <ConnectionIndicator isConnected={isConnected} isHomed={isHomed} isMoving={isMoving} size="w-2 h-2" />
              )}
              <span>{label}</span>
            </label>
          )}
          <input
            type="text"
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            className={baseInputClasses}
            {...inputProps}
          />
        </div>
      );
  }

};

export default ParameterInput;
