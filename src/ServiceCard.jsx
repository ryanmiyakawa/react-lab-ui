// src/views/components/common/ServiceCard.jsx
// Reusable service/connection status card component

import React from 'react';
import Button from './Button';
import StatusIndicator from './StatusIndicator';

/**
 * ServiceCard - Display connection status for a service with actions
 *
 * @param {Object} props
 * @param {string} props.name - Service display name
 * @param {string} props.description - Service description
 * @param {string} props.url - Service URL (optional)
 * @param {'connected' | 'connecting' | 'disconnected' | 'error'} props.status - Connection status
 * @param {'websocket' | 'http'} props.type - Connection type
 * @param {string} props.error - Error message (optional)
 * @param {number} props.lastChecked - Timestamp of last check (optional)
 * @param {number} props.reconnectAttempts - Number of reconnect attempts (optional)
 * @param {Function} props.onConnect - Connect handler (optional)
 * @param {Function} props.onDisconnect - Disconnect handler (optional)
 * @param {Function} props.onCheck - Check status handler (optional)
 * @param {React.ReactNode} props.actions - Custom action buttons (optional)
 * @param {string} props.className - Additional CSS classes
 */
const ServiceCard = ({
  name,
  description,
  url,
  status = 'disconnected',
  type = 'http',
  error,
  lastChecked,
  reconnectAttempts = 0,
  onConnect,
  onDisconnect,
  onCheck,
  actions,
  className = '',
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'border-green-500 bg-green-900/20';
      case 'connecting':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'error':
        return 'border-red-500 bg-red-900/20';
      case 'disconnected':
      default:
        return 'border-slate-600 bg-slate-800';
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      case 'disconnected':
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Error';
      case 'disconnected':
      default:
        return 'Disconnected';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-green-400';
      case 'connecting':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      case 'disconnected':
      default:
        return 'text-slate-400';
    }
  };

  const isWebSocket = type === 'websocket';

  // Default actions if none provided
  const renderDefaultActions = () => {
    if (actions) return actions;

    return (
      <div className="flex gap-2">
        {isWebSocket ? (
          // WebSocket services auto-connect on startup - show status info instead of buttons
          <div className="text-xs text-slate-400 py-2">
            {status === 'connected' ? (
              'Auto-connected • Will reconnect if disconnected'
            ) : status === 'connecting' ? (
              'Connecting automatically...'
            ) : (
              'Will auto-reconnect with exponential backoff'
            )}
          </div>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            disabled={status === 'connecting'}
            loading={status === 'connecting'}
            loadingText="Checking..."
            onClick={onCheck}
          >
            Refresh
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${getStatusColor(status)} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusDotColor(status)}`} />
          <h3 className="font-semibold text-white">{name}</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${
          isWebSocket ? 'bg-purple-600/50 text-purple-200' : 'bg-blue-600/50 text-blue-200'
        }`}>
          {isWebSocket ? 'WebSocket' : 'HTTP'}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-slate-400 mb-2">{description}</p>
      )}

      {/* URL */}
      {url && (
        <div className="text-xs font-mono text-slate-500 mb-3 break-all">
          {url}
        </div>
      )}

      {/* Status and Last Checked */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm ${getStatusTextColor(status)}`}>
          {getStatusText(status)}
        </span>
        {lastChecked && (
          <span className="text-xs text-slate-500">
            Checked {new Date(lastChecked).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-xs text-red-400 bg-red-900/30 p-2 rounded mb-3">
          {error}
        </div>
      )}

      {/* Reconnect attempts for WebSocket */}
      {isWebSocket && reconnectAttempts > 0 && (
        <div className="text-xs text-yellow-400 mb-3">
          Reconnect attempts: {reconnectAttempts}
        </div>
      )}

      {/* Actions */}
      {renderDefaultActions()}
    </div>
  );
};

/**
 * ServiceCardCompact - Smaller version for inline display
 */
export const ServiceCardCompact = ({
  name,
  status = 'disconnected',
  onClick,
  className = '',
}) => {
  const getStatusDotColor = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      case 'disconnected':
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded transition-colors ${className}`}
    >
      <div className={`w-2 h-2 rounded-full ${getStatusDotColor(status)}`} />
      <span className="text-sm text-slate-300">{name}</span>
    </button>
  );
};

export default ServiceCard;
