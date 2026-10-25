import React from 'react';
import type { User } from '../types';
import { BriefcaseIcon, MapPinIcon, RupeeIcon, ChatBubbleIcon } from './icons/Icons';

interface ProfileCardProps {
  user: User;
  onContact: (userId: number) => void;
  onViewDetails: (user: User) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onContact, onViewDetails }) => {

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  }

  return (
    <div 
        className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col cursor-pointer"
        onClick={() => onViewDetails(user)}
    >
      <div className="relative">
        <img src={user.imageUrl} alt={user.name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-sm px-2 py-1 rounded-full font-semibold">{user.age} yrs</div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 text-center">{user.name}</h3>
        <p className="text-gray-500 text-sm text-center flex items-center justify-center gap-1 mb-2"><BriefcaseIcon />{user.profession}</p>
        
        <p className="text-sm text-gray-700 italic text-center my-4 flex-grow">
            "{user.bio}"
        </p>

        <div className="text-sm text-gray-600 space-y-1 my-3">
            <p className="flex items-center gap-2"><MapPinIcon />{user.city}</p>
            <p className="flex items-center gap-2"><RupeeIcon />Budget: ₹{user.budget.toLocaleString('en-IN')}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 text-xs mb-4">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">{user.preferences.food}</span>
            <span className={`px-2 py-1 rounded-full ${user.preferences.smoking === 'No' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                {user.preferences.smoking === 'No' ? 'Non-smoker' : 'Smoker'}
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{user.preferences.drinking}</span>
            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full">Seeking: {user.lookingFor}</span>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
            <button 
                onClick={(e) => handleButtonClick(e, () => onContact(user.id))}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold flex items-center justify-center gap-2"
            >
                <ChatBubbleIcon /> Contact User
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;