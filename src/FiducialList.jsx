import React from 'react';

const FiducialList = ({
  fiducials = [],
  onDeleteFiducial,
  backgroundColorClass = 'bg-slate-600',
  textColorClass = 'text-white'
}) => {
  return (
    <div className={`p-4 ${backgroundColorClass} ${textColorClass}`}>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-3">Fiducial Coordinates</h3>
        
        {fiducials.length === 0 ? (
          <div className="text-center text-slate-300 py-8">
            No fiducials defined yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-500">
                  <th className="text-left py-2 px-3 font-medium text-sm">Computed Coordinates</th>
                  <th className="text-left py-2 px-3 font-medium text-sm">Stage Coordinates</th>
                  <th className="text-center py-2 px-3 font-medium text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {fiducials.map((fiducial, index) => (
                  <tr key={fiducial.id || index} className="border-b border-slate-600 hover:bg-slate-500 transition-colors">
                    <td className="py-2 px-3">
                      <div className="font-mono text-sm">
                        X: {fiducial.computed?.x?.toFixed(3) || '---'}, 
                        Y: {fiducial.computed?.y?.toFixed(3) || '---'}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="font-mono text-sm">
                        X: {fiducial.stage?.x?.toFixed(3) || '---'}, 
                        Y: {fiducial.stage?.y?.toFixed(3) || '---'}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => onDeleteFiducial?.(fiducial.id || index)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {fiducials.length > 0 && (
        <div className="text-sm text-slate-300 mt-4">
          Total fiducials: {fiducials.length}
        </div>
      )}
    </div>
  );
};

export default FiducialList;