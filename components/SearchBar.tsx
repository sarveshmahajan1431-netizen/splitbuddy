import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (filters: { city: string; budget: number; lifestyle: string[] }) => void;
  showLifestyleFilter?: boolean;
}

const CITIES = ['Any', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'];
const LIFESTYLES = [
    'Vegetarian', 
    'Vegan', 
    'Eggetarian', 
    'Non-Smoker', 
    'Non-Drinker', 
    'Social Drinker',
    'Quiet Nights In',
    'Party Animal',
    'Very Tidy'
];


const SearchBar: React.FC<SearchBarProps> = ({ onSearch, showLifestyleFilter = true }) => {
  const [city, setCity] = useState('Any');
  const [budget, setBudget] = useState(100000);
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [isLifestyleOpen, setIsLifestyleOpen] = useState(false);
  const lifestyleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onSearch({ city, budget, lifestyle });
  }, [city, budget, lifestyle, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (lifestyleRef.current && !lifestyleRef.current.contains(event.target as Node)) {
            setIsLifestyleOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLifestyleChange = (option: string) => {
    setLifestyle(prev =>
        prev.includes(option)
            ? prev.filter(item => item !== option)
            : [...prev, option]
    );
  };
  
  const getLifestyleButtonText = () => {
      if (lifestyle.length === 0) return 'Any';
      if (lifestyle.length === 1) return lifestyle[0];
      return `${lifestyle.length} selected`;
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-4">
      <div className={`flex-grow w-full ${showLifestyleFilter ? 'md:w-1/3' : 'md:w-1/2'}`}>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
        <select id="city" value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-indigo-800">
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      
      <div className={`flex-grow w-full ${showLifestyleFilter ? 'md:w-1/3' : 'md:w-1/2'}`}>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Max Budget (₹{budget.toLocaleString('en-IN')})</label>
        <input id="budget" type="range" min="5000" max="100000" step="1000" value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
      </div>

      {showLifestyleFilter && (
        <div className="flex-grow w-full md:w-1/3" ref={lifestyleRef}>
          <label htmlFor="lifestyle-btn" className="block text-sm font-medium text-gray-700 mb-1">Lifestyle</label>
          <div className="relative">
            <button
              id="lifestyle-btn"
              type="button"
              onClick={() => setIsLifestyleOpen(!isLifestyleOpen)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-indigo-800 text-left flex justify-between items-center"
              aria-haspopup="listbox"
              aria-expanded={isLifestyleOpen}
            >
              <span className="truncate">{getLifestyleButtonText()}</span>
              <svg className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isLifestyleOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {isLifestyleOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                <ul className="py-1" role="listbox">
                  {LIFESTYLES.map(l => (
                    <li key={l} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleLifestyleChange(l)}>
                      <label className="flex items-center space-x-3 w-full cursor-pointer">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                          checked={lifestyle.includes(l)}
                          onChange={() => {}} // The li's onClick handles the logic
                          readOnly
                        />
                        <span className="text-gray-700">{l}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
