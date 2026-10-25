
import React from 'react';
import type { User } from '../types';
import { UserCircleIcon, HeartIcon } from './icons/Icons';

interface HeaderProps {
  user: User | null;
  setView: (view: 'home' | 'listings' | 'profiles' | 'saved' | 'myProfile') => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onPostListingClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, setView, onLoginClick, onSignupClick, onPostListingClick, onLogout }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setView('home')}
          aria-label="Splitbuddy home"
        >
          <svg className="h-9 w-auto text-indigo-600" viewBox="0 0 100 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0L0 25V30H10V80H40V50H60V80H90V30H100V25L50 0Z" />
            <g transform="translate(0, 5)">
              <circle cx="28" cy="35" r="6" fill="white"/>
              <path d="M22 42H34V60H22Z" fill="white" />
              <circle cx="72" cy="35" r="6" fill="white"/>
              <path d="M66 42H78V60H66Z" fill="white" />
            </g>
          </svg>
          <span className="text-3xl font-bold text-indigo-600">Splitbuddy</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => setView('profiles')} className="text-gray-600 hover:text-indigo-600 transition duration-300">Find a Flatmate</button>
          <button onClick={() => setView('listings')} className="text-gray-600 hover:text-indigo-600 transition duration-300">Find a Room</button>
          <button onClick={onPostListingClick} className="text-gray-600 hover:text-indigo-600 transition duration-300">Post a Listing</button>
          {user && (
            <>
              <button onClick={() => setView('saved')} className="text-gray-600 hover:text-indigo-600 transition duration-300 flex items-center gap-1.5">
                <HeartIcon /> Saved
              </button>
              <button onClick={() => setView('myProfile')} className="text-gray-600 hover:text-indigo-600 transition duration-300">My Profile</button>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700 hidden sm:flex items-center">
                <UserCircleIcon className="w-6 h-6 mr-2 text-gray-500" />
                Welcome, {user.name.split(' ')[0]}
              </span>
              <button 
                onClick={onLogout}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 transition duration-300"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button onClick={onLoginClick} className="text-gray-600 hover:text-indigo-600 transition duration-300">Log In</button>
              <button onClick={onSignupClick} className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition duration-300">Sign Up</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
