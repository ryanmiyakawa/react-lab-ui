// src/views/components/common/StatusDot.jsx
// Reusable status indicator dot component

import React from 'react';

/**
 * StatusDot - Small colored dot indicating connection/service status
 *
 * @param {'connected' | 'connecting' | 'disconnected' | 'error' | 'success' | 'warning' | 'info'} status
 * @param {'sm' | 'md' | 'lg'} size
 * @param {string} label - Optional label text
 * @param {boolean} showLabel - Whether to show the label
 * @param {Function} onClick - Click handler
 * @param {string} className - Additional CSS classes
 */
const StatusDot = ({
  status = 'disconnected',
  size = 'md',
  label,
  showLabel = true,
  onClick,
  className = '',
  title,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
      case 'success':
        return 'bg-green-500';
      case 'connecting':
      case 'warning':
        return 'bg-yellow-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      case 'disconnected':
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusTitle = (status) => {
    switch (status) {
      case 'connected':
      case 'success':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      case 'info':
        return 'Info';
      case 'disconnected':
      default:
        return 'Disconnected';
    }
  };

  const sizeStyles = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const labelSizeStyles = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const dotElement = (
    <div className={`rounded-full ${sizeStyles[size]} ${getStatusColor(status)}`} />
  );

  const tooltipTitle = title || (label ? `${label}: ${getStatusTitle(status)}` : getStatusTitle(status));

  // Without label
  if (!label || !showLabel) {
    if (onClick) {
      return (
        <button
          onClick={onClick}
          className={`p-1 bg-slate-700 hover:bg-slate-600 rounded transition-colors ${className}`}
          title={tooltipTitle}
        >
          {dotElement}
        </button>
      );
    }
    return (
      <span className={className} title={tooltipTitle}>
        {dotElement}
      </span>
    );
  }

  // With label
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded transition-colors cursor-pointer ${className}`}
        title={tooltipTitle}
      >
        {dotElement}
        <span className={`text-white font-medium ${labelSizeStyles[size]}`}>{label}</span>
      </button>
    );
  }

  return (
    <span
      className={`flex items-center gap-1.5 ${className}`}
      title={tooltipTitle}
    >
      {dotElement}
      <span className={`text-slate-200 font-medium ${labelSizeStyles[size]}`}>{label}</span>
    </span>
  );
};

/**
 * StatusDotGroup - Group of status dots with separators
 */
export const StatusDotGroup = ({
  items,
  separator = '|',
  onClick,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={item.key || index}>
          <StatusDot
            status={item.status}
            label={item.label}
            onClick={onClick}
          />
          {separator && index < items.length - 1 && (
            <span className="text-slate-500 text-xs">{separator}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatusDot;
