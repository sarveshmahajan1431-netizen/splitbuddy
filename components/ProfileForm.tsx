

import React, { useState } from 'react';
import type { User, LifestylePreferences } from '../types';

interface ProfileFormProps {
  currentUser: User;
  onSubmit: (updatedData: Partial<User>) => void;
}

const CITIES = ['Any', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'];
const GENDER_OPTIONS: NonNullable<User['gender']>[] = ['Prefer not to say', 'Male', 'Female', 'Other'];
const LOOKING_FOR_OPTIONS: User['lookingFor'][] = ['Any', 'Male', 'Female'];
const SMOKING_OPTIONS: LifestylePreferences['smoking'][] = ['No', 'Occasionally', 'Yes'];
const DRINKING_OPTIONS: LifestylePreferences['drinking'][] = ['No', 'Socially', 'Yes'];
const FOOD_OPTIONS: LifestylePreferences['food'][] = ['Vegetarian', 'Eggetarian', 'Non-Vegetarian', 'Vegan'];
const SOCIAL_OPTIONS: LifestylePreferences['socialHabits'][] = ['Quiet nights in', 'Mix of both', 'Party animal'];
const CLEANLINESS_OPTIONS: LifestylePreferences['cleanliness'][] = ['Relaxed', 'Moderately clean', 'Very tidy'];

const ProfileForm: React.FC<ProfileFormProps> = ({ currentUser, onSubmit }) => {
  const [imageUrl, setImageUrl] = useState(currentUser.imageUrl);
  const [bio, setBio] = useState(currentUser.bio);
  const [profession, setProfession] = useState(currentUser.profession);
  const [age, setAge] = useState(currentUser.age);
  const [gender, setGender] = useState<NonNullable<User['gender']>>(currentUser.gender || 'Prefer not to say');
  const [lookingFor, setLookingFor] = useState<User['lookingFor']>(currentUser.lookingFor);
  const [city, setCity] = useState(currentUser.city);
  const [budget, setBudget] = useState(currentUser.budget);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [preferences, setPreferences] = useState<LifestylePreferences>(currentUser.preferences);
  const [loading, setLoading] = useState(false);

  const handlePreferenceChange = (key: keyof LifestylePreferences, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setImageUrl(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    }
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const updatedData: Partial<User> = {
      imageUrl,
      bio,
      profession,
      age,
      gender,
      lookingFor,
      city,
      budget,
      phone,
      preferences,
    };
    
    // Simulate async operation
    setTimeout(() => {
        onSubmit(updatedData);
        setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Profile</h2>
      <p className="text-gray-500 mb-6">Keep your information up-to-date for the best matches.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-lg bg-gray-50">
            <img src={imageUrl} alt="Profile preview" className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-200 shadow" />
            <div className="flex flex-col gap-3 text-center sm:text-left">
                <h3 className="font-semibold text-lg text-gray-800">Profile Photo</h3>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    <label htmlFor="file-upload" className="cursor-pointer bg-white text-indigo-700 font-semibold px-4 py-2 rounded-full border border-indigo-200 hover:bg-indigo-50 transition-all duration-300 text-sm">
                        Upload from Device
                    </label>
                    <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </div>
            </div>
        </div>



        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Introduction / Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            className="mt-1 input-field"
            placeholder="Tell us a little about yourself..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Profession</label>
                <input id="profession" type="text" value={profession} onChange={e => setProfession(e.target.value)} required className="mt-1 input-field" placeholder="e.g., Software Engineer" />
            </div>
             <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                <input id="age" type="number" value={age} onChange={e => setAge(Number(e.target.value))} required min="18" max="100" className="mt-1 input-field" placeholder="e.g., 25" />
            </div>
            <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                <select id="gender" value={gender} onChange={e => setGender(e.target.value as NonNullable<User['gender']>)} className="mt-1 input-field">
                    {GENDER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="lookingFor" className="block text-sm font-medium text-gray-700">Looking for</label>
                <select id="lookingFor" value={lookingFor} onChange={e => setLookingFor(e.target.value as User['lookingFor'])} className="mt-1 input-field">
                    {LOOKING_FOR_OPTIONS.map(opt => <option key={opt} value={opt}>{opt === 'Any' ? 'Any Gender' : opt}</option>)}
                </select>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 input-field" placeholder="e.g., 9876543210" />
            </div>
            <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <select id="city" value={city} onChange={e => setCity(e.target.value)} required className="mt-1 input-field">
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

        <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Your Budget (₹{budget.toLocaleString('en-IN')})</label>
            <input id="budget" type="range" min="5000" max="100000" step="1000" value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3" />
        </div>

        <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Lifestyle Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               <div>
                  <label htmlFor="food" className="block text-sm font-medium text-gray-700">Food</label>
                  <select id="food" value={preferences.food} onChange={e => handlePreferenceChange('food', e.target.value)} className="mt-1 input-field">
                    {FOOD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
               </div>
                <div>
                  <label htmlFor="smoking" className="block text-sm font-medium text-gray-700">Smoking</label>
                  <select id="smoking" value={preferences.smoking} onChange={e => handlePreferenceChange('smoking', e.target.value)} className="mt-1 input-field">
                    {SMOKING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
               </div>
               <div>
                  <label htmlFor="drinking" className="block text-sm font-medium text-gray-700">Drinking</label>
                  <select id="drinking" value={preferences.drinking} onChange={e => handlePreferenceChange('drinking', e.target.value)} className="mt-1 input-field">
                    {DRINKING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
               </div>
               <div>
                  <label htmlFor="social" className="block text-sm font-medium text-gray-700">Social Habits</label>
                  <select id="social" value={preferences.socialHabits} onChange={e => handlePreferenceChange('socialHabits', e.target.value)} className="mt-1 input-field">
                    {SOCIAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
               </div>
               <div>
                  <label htmlFor="cleanliness" className="block text-sm font-medium text-gray-700">Cleanliness</label>
                  <select id="cleanliness" value={preferences.cleanliness} onChange={e => handlePreferenceChange('cleanliness', e.target.value)} className="mt-1 input-field">
                    {CLEANLINESS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
               </div>
            </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed flex justify-center items-center min-w-[120px]"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Save Changes'}
          </button>
        </div>
      </form>
      <style>{`
          .input-field {
              display: block;
              width: 100%;
              padding: 0.5rem 0.75rem;
              border: 1px solid #d1d5db;
              border-radius: 0.375rem;
              box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
              background-color: white;
              color: #1e3a8a;
          }
          .input-field:focus {
              outline: 2px solid transparent;
              outline-offset: 2px;
              border-color: #4f46e5;
              box-shadow: 0 0 0 2px #c7d2fe;
          }
          .animate-fade-in { 
              animation: fadeIn 0.5s ease-in-out; 
          } 
          @keyframes fadeIn { 
              0% { opacity: 0; transform: translateY(-10px); } 
              100% { opacity: 1; transform: translateY(0); } 
          }
      `}</style>
    </div>
  );
};

export default ProfileForm;