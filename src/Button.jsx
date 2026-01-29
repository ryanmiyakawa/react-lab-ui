// src/views/components/common/Button.jsx
// Reusable dark mode button component with multiple variants

import React from 'react';

/**
 * Button - Versatile dark mode button component
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state (shows loading text)
 * @param {string} props.loadingText - Text to show when loading
 * @param {boolean} props.fullWidth - Full width button
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText = '...',
  fullWidth = false,
  className = '',
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  // Base styles for all buttons
  const baseStyles = 'font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';

  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-500 disabled:bg-blue-600/50',
    secondary: 'bg-slate-600 hover:bg-slate-500 text-white focus:ring-slate-500 disabled:bg-slate-600/50',
    success: 'bg-green-600 hover:bg-green-500 text-white focus:ring-green-500 disabled:bg-green-600/50',
    danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 disabled:bg-red-600/50',
    warning: 'bg-amber-600 hover:bg-amber-500 text-white focus:ring-amber-500 disabled:bg-amber-600/50',
    ghost: 'bg-transparent hover:bg-slate-700 text-slate-300 hover:text-white focus:ring-slate-500',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const isDisabled = disabled || loading;

  const combinedClassName = [
    baseStyles,
    variantStyles[variant] || variantStyles.primary,
    sizeStyles[size] || sizeStyles.md,
    fullWidth ? 'w-full' : '',
    isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
};

/**
 * ButtonGroup - Container for grouping buttons together
 */
export const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {children}
    </div>
  );
};

/**
 * IconButton - Button with just an icon
 */
export const IconButton = ({
  icon,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  return (
    <Button
      variant={variant}
      className={`${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
};

export default Button;
