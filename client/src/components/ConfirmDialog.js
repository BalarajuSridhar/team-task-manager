import { HiExclamation } from 'react-icons/hi';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <HiExclamation className="text-red-600 text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title || 'Confirm'}</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message || 'Are you sure?'}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="btn-danger flex-1">Confirm</button>
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;