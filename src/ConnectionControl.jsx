import React from 'react';

const ConnectionControl = ({
  isConnected = false,
  isConnecting = false,
  onConnect,
  onDisconnect,
  connectLabel = 'Connect',
  disconnectLabel = 'Disconnect',
  statusLabels = {
    connected: 'Connected',
    connecting: 'Connecting...',
    disconnected: 'Disconnected'
  }
}) => {
  const handleToggle = () => {
    if (isConnected) {
      onDisconnect?.();
    } else {
      onConnect?.();
    }
  };

  const getStatusColor = () => {
    if (isConnecting) return 'bg-yellow-500';
    if (isConnected) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (isConnecting) return statusLabels.connecting;
    if (isConnected) return statusLabels.connected;
    return statusLabels.disconnected;
  };

  const getButtonText = () => {
    if (isConnecting) return statusLabels.connecting;
    return isConnected ? disconnectLabel : connectLabel;
  };

  const getButtonColor = () => {
    if (isConnecting) return 'bg-gray-500 cursor-not-allowed';
    return isConnected 
      ? 'bg-red-600 hover:bg-red-700' 
      : 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        <span className="text-sm">{getStatusText()}</span>
      </div>
      
      <button
        onClick={handleToggle}
        disabled={isConnecting}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors text-white ${getButtonColor()}`}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default ConnectionControl;