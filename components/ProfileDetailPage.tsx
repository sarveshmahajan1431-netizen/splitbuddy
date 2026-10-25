import React from 'react';
import type { User } from '../types';
import { BriefcaseIcon, MapPinIcon, RupeeIcon, PhoneIcon, ChatBubbleIcon } from './icons/Icons';

interface ProfileDetailPageProps {
  user: User;
  onContact: () => void;
  onBack: () => void;
}

const ProfileDetailPage: React.FC<ProfileDetailPageProps> = ({ user, onContact, onBack }) => {

  const preferences = [
      { label: 'Food', value: user.preferences.food, icon: 'fa-solid fa-utensils' },
      { label: 'Smoking', value: user.preferences.smoking, icon: 'fa-solid fa-smoking' },
      { label: 'Drinking', value: user.preferences.drinking, icon: 'fa-solid fa-martini-glass' },
      { label: 'Social Habits', value: user.preferences.socialHabits, icon: 'fa-solid fa-users' },
      { label: 'Cleanliness', value: user.preferences.cleanliness, icon: 'fa-solid fa-broom' }
  ];

  return (
    <div className="animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Back
        </button>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Left Sidebar */}
                <div className="md:col-span-1 p-8 bg-gray-50 border-r flex flex-col items-center text-center">
                    <img src={user.imageUrl} alt={user.name} className="w-40 h-40 rounded-full object-cover ring-4 ring-indigo-200 shadow-lg"/>
                    <h1 className="text-3xl font-bold text-gray-900 mt-6">{user.name}</h1>
                    <p className="text-gray-500">
                        {user.age} years old
                        {user.gender && user.gender !== 'Prefer not to say' && (
                            <>
                                <span className="mx-1">·</span><span>{user.gender}</span>
                            </>
                        )}
                    </p>
                    <p className="text-gray-600 mt-2 flex items-center justify-center gap-1.5"><BriefcaseIcon />{user.profession}</p>
                    
                    <div className="w-full border-t my-6"></div>

                    <div className="text-left space-y-2 text-gray-700 w-full">
                        <p className="flex items-center gap-2"><MapPinIcon />Lives in {user.city}</p>
                        <p className="flex items-center gap-2"><RupeeIcon />Budget: ₹{user.budget.toLocaleString('en-IN')}</p>
                        <p className="flex items-center gap-2">
                            <i className="fa-solid fa-users-viewfinder w-5 text-center text-gray-500"></i>
                            <span>Looking for: <strong>{user.lookingFor}</strong> flatmate</span>
                        </p>
                        {user.phone && (
                            <p className="flex items-center gap-2">
                                <PhoneIcon />
                                <a href={`tel:${user.phone}`} className="hover:underline">{user.phone}</a>
                            </p>
                        )}
                    </div>

                    <div className="mt-8 w-full flex flex-col gap-3">
                        <button 
                            onClick={onContact}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold flex items-center justify-center gap-2"
                        >
                            <ChatBubbleIcon /> Contact User
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">About Me</h2>
                    <p className="text-gray-700 leading-relaxed text-lg italic border-l-4 border-indigo-200 pl-4">
                        "{user.bio}"
                    </p>

                    <div className="border-t my-8"></div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Lifestyle & Preferences</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {preferences.map(pref => (
                            <div key={pref.label} className="bg-indigo-50 p-4 rounded-lg flex items-start gap-4">
                                <i className={`${pref.icon} text-indigo-500 text-2xl w-8 text-center mt-1`}></i>
                                <div>
                                    <h4 className="font-semibold text-gray-500">{pref.label}</h4>
                                    <p className="text-gray-900 font-bold text-lg">{pref.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }`}</style>
    </div>
  );
};

export default ProfileDetailPage;