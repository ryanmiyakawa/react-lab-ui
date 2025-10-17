const TabGroup = ({ 
  tabs = [], 
  activeTab, 
  onTabChange, 
  className = "" 
}) => {
  return (
    <div className={`bg-slate-800 border-b border-slate-700 ${className}`}>
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 border-none outline-none focus:outline-none rounded-none ${
              activeTab === tab.id
                ? 'text-blue-400 border-blue-400 bg-slate-600'
                : 'text-slate-300 border-transparent bg-transparent hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabGroup;