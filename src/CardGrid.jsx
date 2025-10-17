const CardGrid = ({ 
  columns = "auto", 
  gap = "6", 
  children, 
  className = "" 
}) => {
  // Map common column counts to Tailwind classes
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 lg:grid-cols-2", 
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    "auto": "grid-cols-1 lg:grid-cols-2"
  };

  const gridCols = columnClasses[columns] || columnClasses["auto"];
  
  return (
    <div className={`grid ${gridCols} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

export default CardGrid;