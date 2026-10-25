

import React, { useState, useEffect } from 'react';
import type { Listing } from '../types';
import { XMarkIcon, CheckIcon } from './icons/Icons';

const CITIES = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'];
const TYPES: Listing['type'][] = ['Private Room', 'Shared Room', 'Entire Flat'];
const ALL_AMENITIES = ['WiFi', 'Kitchen', 'Washing Machine', 'AC', 'Gated Society', 'Gym', 'Pool', 'Power Backup', 'Parking'];
const ALL_PREFERENCES = ['Market nearby', 'Attached washroom', 'Close to metro station', 'Public transport nearby', 'No Restriction', 'Gym nearby', 'Park nearby'];
const MAX_FILES = 5;

interface ListingModalProps {
  onClose: () => void;
  onSubmit: (listingData: Omit<Listing, 'id' | 'ownerId'>) => void;
  listing: Listing | null;
}

const ListingModal: React.FC<ListingModalProps> = ({ onClose, onSubmit, listing }) => {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  const [location, setLocation] = useState('');
  const [rent, setRent] = useState(20000);
  const [type, setType] = useState(TYPES[0]);
  const [phone, setPhone] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (listing) {
      setTitle(listing.title);
      setCity(listing.city);
      setLocation(listing.location);
      setRent(listing.rent);
      setType(listing.type);
      setPhone(listing.phone || '');
      setSelectedAmenities(listing.amenities);
      setSelectedPreferences(listing.preferences || []);
      setDescription(listing.description);
      setMediaUrls(listing.mediaUrls);
    } else {
      // For new listings, start with an empty array
      setMediaUrls([]);
      setPhone('');
      setSelectedPreferences([]);
    }
  }, [listing]);

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
        prev.includes(amenity) 
            ? prev.filter(a => a !== amenity) 
            : [...prev, amenity]
    );
  };
  
  const handlePreferenceToggle = (preference: string) => {
    setSelectedPreferences(prev =>
        prev.includes(preference)
            ? prev.filter(p => p !== preference)
            : [...prev, preference]
    );
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const files = e.target.files;
    if (!files) return;

    if (mediaUrls.length + files.length > MAX_FILES) {
      setError(`You can only upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setMediaUrls(prev => [...prev, event.target!.result as string]);
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const removeMedia = (indexToRemove: number) => {
    setMediaUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    setError('');
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaUrls.length === 0) {
        setError('Please upload at least one image or video.');
        return;
    }
    setLoading(true);
    
    const listingData = {
      title,
      city,
      location,
      rent,
      type,
      phone,
      amenities: selectedAmenities,
      preferences: selectedPreferences,
      description,
      mediaUrls,
    };
    
    onSubmit(listingData);
    setLoading(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b z-10 p-6">
            <h2 className="text-2xl font-bold text-gray-900">{listing ? 'Edit Listing' : 'Create a Listing'}</h2>
            <p className="text-gray-500 text-sm">Fill out the details below to list your space.</p>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <XMarkIcon />
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 input-field" placeholder="e.g., Cozy Room in Central Area" />
            </div>

             <div>
                <label className="block text-sm font-medium text-gray-700">Media (Images/Videos)</label>
                <div className="mt-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {mediaUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square group">
                            {url.startsWith('data:video') ? (
                                <video src={url} className="w-full h-full object-cover rounded-md bg-gray-200" muted playsInline />
                            ) : (
                                <img src={url} alt={`preview ${index}`} className="w-full h-full object-cover rounded-md bg-gray-200" />
                            )}
                            <button 
                                type="button"
                                onClick={() => removeMedia(index)}
                                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                &#x2715;
                            </button>
                        </div>
                    ))}
                    {mediaUrls.length < MAX_FILES && (
                        <label htmlFor="file-upload" className="cursor-pointer aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors">
                            <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                            <span className="text-xs mt-1 text-center">Upload</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*,video/*" onChange={handleFileChange} />
                        </label>
                    )}
                </div>
                {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                <p className="text-xs text-gray-500 mt-1">Add up to {MAX_FILES} images or videos. The first item will be the cover.</p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <select id="city" value={city} onChange={e => setCity(e.target.value)} required className="mt-1 input-field">
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location / Area</label>
                    <input id="location" type="text" value={location} onChange={e => setLocation(e.target.value)} required className="mt-1 input-field" placeholder="e.g., Koramangala" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="rent" className="block text-sm font-medium text-gray-700">Monthly Rent (₹)</label>
                    <input id="rent" type="number" value={rent} onChange={e => setRent(Number(e.target.value))} required className="mt-1 input-field" placeholder="25000" />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Room Type</label>
                    <select id="type" value={type} onChange={e => setType(e.target.value as Listing['type'])} required className="mt-1 input-field">
                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>
            
            <div>
                <label htmlFor="phone-listing" className="block text-sm font-medium text-gray-700">Contact Phone (Optional)</label>
                <input id="phone-listing" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 input-field" placeholder="e.g., 9876543210" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Amenities</label>
                <div className="mt-2 flex flex-wrap gap-2">
                    {ALL_AMENITIES.map(amenity => (
                        <button
                            type="button"
                            key={amenity}
                            onClick={() => handleAmenityToggle(amenity)}
                            className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                                selectedAmenities.includes(amenity)
                                    ? 'bg-indigo-600 text-white shadow'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {amenity}
                        </button>
                    ))}
                </div>
            </div>

             <div>
                <label className="block text-sm font-medium text-gray-700">Preferences & Rules</label>
                <div className="mt-2 flex flex-wrap gap-2">
                    {ALL_PREFERENCES.map(preference => (
                        <button
                            type="button"
                            key={preference}
                            onClick={() => handlePreferenceToggle(preference)}
                            className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200 flex items-center gap-1.5 ${
                                selectedPreferences.includes(preference)
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {selectedPreferences.includes(preference) && <CheckIcon className="w-4 h-4 mr-0" />}
                            {preference}
                        </button>
                    ))}
                </div>
            </div>

            
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="mt-1 input-field" placeholder="Tell everyone about your space..."></textarea>
            </div>
          
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (listing ? 'Save Changes' : 'Post Listing')}
              </button>
            </div>
        </form>
      </div>
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
      `}</style>
    </div>
  );
};

export default ListingModal;