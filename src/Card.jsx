const Card = ({ 
  title, 
  subtitle, 
  children, 
  className = "", 
  contentClassName = "" 
}) => {
  return (
    <div className={`bg-slate-700 p-6 rounded-lg ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          )}
          {subtitle && (
            <p className="text-slate-300">{subtitle}</p>
          )}
        </div>
      )}
      
      {children && (
        <div className={`bg-slate-600 p-4 rounded ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Card;