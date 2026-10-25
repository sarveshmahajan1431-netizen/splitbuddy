import React, { useEffect, useState } from 'react';
import type { Toast as ToastType } from '../types';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from './icons/Icons';

interface ToastProps {
  toast: ToastType;
  onClose: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const { id, message, type } = toast;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setVisible(true);

    const timer = setTimeout(() => {
      handleClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setVisible(false);
    // Allow animation to finish before removing from DOM
    setTimeout(() => onClose(id), 300); 
  };

  const icon = type === 'success' 
    ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> 
    : <XCircleIcon className="w-6 h-6 text-red-500" />;

  const progressColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div 
        role="alert"
        aria-live="assertive"
        className={`
            max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden
            transition-all duration-300 ease-in-out
            ${visible ? 'transform-gpu opacity-100 translate-y-0' : 'transform-gpu opacity-0 -translate-y-full'}
        `}
    >
        <div className="p-4">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {icon}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                        {type === 'success' ? 'Success' : 'Error'}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        {message}
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        onClick={handleClose}
                        className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
        <div className="h-1 w-full bg-gray-200">
            <div 
                className={`h-full ${progressColor} animate-progress`}
                style={{ animationDuration: '5s' }}
            ></div>
        </div>
        <style>{`
            @keyframes progress {
                from { width: 100%; }
                to { width: 0%; }
            }
            .animate-progress {
                animation: progress linear forwards;
            }
        `}</style>
    </div>
  );
};

export default Toast;
