import React from 'react';

interface HeroProps {
  onFindFlatmateClick: () => void;
  onFindRoomClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onFindFlatmateClick, onFindRoomClick }) => {
  return (
    <div 
      className="relative bg-cover bg-center text-white py-32 px-4 -mt-8" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')" }}
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 bg-stone-900 opacity-60"></div>
      <div className="relative container mx-auto text-center z-10">
        <h1 id="hero-title" className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Find Your Perfect Flatmate</h1>
        <p className="text-lg md:text-xl mb-10 drop-shadow-md max-w-3xl mx-auto">The #1 brokerage-free platform for finding compatible roommates and shared homes in India.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onFindFlatmateClick}
            className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-3 text-lg transform hover:scale-105 shadow-lg"
          >
            <i className="fa-solid fa-users"></i>
            I'm Looking for a Flatmate
          </button>
          <button
            onClick={onFindRoomClick}
            className="w-full sm:w-auto bg-white text-indigo-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 text-lg transform hover:scale-105 shadow-lg"
          >
            <i className="fa-solid fa-house"></i>
            I'm Looking for a Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
