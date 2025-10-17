const ButtonToggle = ({
  getCurrent, // Get current value
  setTarget,
  status = null,
  label = 'WS Connection',
  connectedColorClass = 'bg-green-500 text-yellow-400',
  disconnectedColorClass = 'bg-gray-200 text-red-400',
  onClick = null, // Optional callback: (isConnected) => void
}) => {

  const isConnected = getCurrent();

  const toggleConnection = () => {
    const newState = !isConnected;
    setTarget(newState);

    // Optional click callback
    onClick?.(newState);
  };

  const colorClass = isConnected ? connectedColorClass : disconnectedColorClass;

  return (
    <div
      className={`relative text-center w-96 p-2.5 rounded-lg cursor-pointer ${colorClass}`}
      onClick={toggleConnection}
    >
      <div className="text-center font-bold text-2xl">
        {label}
      </div>
      <div className="absolute left-0 right-0 text-center text-xs bottom-1">
        {status}
      </div>
    </div>
  );
};

export default ButtonToggle;
