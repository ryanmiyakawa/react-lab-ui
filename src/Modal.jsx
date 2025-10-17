import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmButtonClass = 'bg-blue-600 hover:bg-blue-700 text-white',
  cancelButtonClass = 'bg-gray-600 hover:bg-gray-700 text-white',
  showConfirmButton = true,
  showCancelButton = true,
  size = 'md' // sm, md, lg
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg'
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-slate-800 border border-slate-600 rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4`}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-slate-600">
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors p-1 rounded-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 text-slate-100">
          {children}
        </div>

        {/* Footer */}
        {(showConfirmButton || showCancelButton) && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-600">
            {showCancelButton && (
              <button
                onClick={handleCancel}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${cancelButtonClass}`}
              >
                {cancelText}
              </button>
            )}
            {showConfirmButton && (
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${confirmButtonClass}`}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;