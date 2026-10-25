import React from 'react';
import { XMarkIcon, CheckCircleIcon } from './icons/Icons';

interface PremiumModalProps {
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md text-center p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XMarkIcon />
        </button>
        
        <div className="text-yellow-500 mb-4">
            <i className="fa-solid fa-crown fa-3x"></i>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unlock Premium Features</h2>
        <p className="text-gray-600 mb-6">Upgrade your plan to contact members directly and get full access to detailed listings.</p>

        <div className="text-left space-y-2 mb-8">
            <p className="flex items-center"><CheckCircleIcon className="text-green-500 mr-2" /> View contact details</p>
            <p className="flex items-center"><CheckCircleIcon className="text-green-500 mr-2" /> Send direct messages</p>
            <p className="flex items-center"><CheckCircleIcon className="text-green-500 mr-2" /> Get priority support</p>
        </div>
        
        <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 duration-300">
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

export default PremiumModal;