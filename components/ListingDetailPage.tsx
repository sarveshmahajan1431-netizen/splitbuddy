

import React, { useState, useRef, useEffect } from 'react';
import type { Listing, User } from '../types';
import { BedIcon, MapPinIcon, RupeeIcon, HeartIcon, HeartIconSolid, PhoneIcon, CheckIcon } from './icons/Icons';

const getAmenityIcon = (amenity: string): string => {
  const lowerAmenity = amenity.toLowerCase();
  if (lowerAmenity.includes('wifi')) return 'fa-solid fa-wifi';
  if (lowerAmenity.includes('kitchen')) return 'fa-solid fa-kitchen-set';
  if (lowerAmenity.includes('washing')) return 'fa-solid fa-soap';
  if (lowerAmenity.includes('ac')) return 'fa-solid fa-snowflake';
  if (lowerAmenity.includes('gated')) return 'fa-solid fa-shield-halved';
  if (lowerAmenity.includes('gym')) return 'fa-solid fa-dumbbell';
  if (lowerAmenity.includes('pool')) return 'fa-solid fa-water-ladder';
  if (lowerAmenity.includes('power') || lowerAmenity.includes('backup')) return 'fa-solid fa-bolt';
  if (lowerAmenity.includes('parking')) return 'fa-solid fa-square-p';
  return 'fa-solid fa-check';
};

interface ListingDetailPageProps {
  listing: Listing;
  owner: User;
  currentUser: User | null;
  isSaved: boolean;
  onContact: () => void;
  onToggleSave: (listingId: number) => void;
  onBack: () => void;
  onViewProfile: (user: User) => void;
}

const ListingDetailPage: React.FC<ListingDetailPageProps> = ({ listing, owner, currentUser, isSaved, onContact, onToggleSave, onBack, onViewProfile }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Effect to play/pause videos when the active slide changes
    videoRefs.current.forEach((videoEl, index) => {
        if (videoEl) {
            if (index === currentMediaIndex) {
                videoEl.play().catch(e => console.error("Video play failed:", e));
            } else {
                videoEl.pause();
                videoEl.currentTime = 0;
            }
        }
    });
  }, [currentMediaIndex]);


  const nextMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % listing.mediaUrls.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex - 1 + listing.mediaUrls.length) % listing.mediaUrls.length);
  };

  return (
    <div className="animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Back
        </button>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Media Carousel */}
            <div className="relative w-full h-64 md:h-96 bg-gray-900">
                {listing.mediaUrls.map((url, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${index === currentMediaIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        {url.startsWith('data:video') ? (
                           <video
                                // FIX: Callback refs should not return a value. Wrapped the assignment in braces to ensure an implicit return of undefined.
                                ref={el => { videoRefs.current[index] = el; }}
                                src={url}
                                controls
                                muted
                                playsInline
                                className="w-full h-full object-contain"
                            />
                        ) : (
                             <img 
                                src={url} 
                                alt={`${listing.title} media ${index + 1}`} 
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                ))}
                {listing.mediaUrls.length > 1 && (
                    <>
                        <button onClick={prevMedia} className="absolute z-20 left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none">
                            &#10094;
                        </button>
                        <button onClick={nextMedia} className="absolute z-20 right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none">
                            &#10095;
                        </button>
                        <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {listing.mediaUrls.map((_, index) => (
                                <div key={index} className={`w-2.5 h-2.5 rounded-full ${index === currentMediaIndex ? 'bg-white' : 'bg-white/50'}`}></div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <span className="flex items-center bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded w-fit mb-2"><BedIcon />{listing.type}</span>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{listing.title}</h1>
                    <p className="text-gray-600 mt-2 flex items-center text-lg"><MapPinIcon />{listing.location}, {listing.city}</p>
                    
                    <div className="border-t my-6"></div>

                    <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
                    
                    <div className="border-t my-6"></div>

                    <h2 className="text-xl font-bold text-gray-800 mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
                        {listing.amenities.map(amenity => (
                            <div key={amenity} className="flex items-center gap-3">
                                <i className={`${getAmenityIcon(amenity)} text-indigo-500 w-5 text-center`}></i>
                                <span>{amenity}</span>
                            </div>
                        ))}
                    </div>

                    {listing.preferences && listing.preferences.length > 0 && (
                        <>
                            <div className="border-t my-6"></div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Preferences & Rules</h2>
                            <div className="flex flex-wrap gap-2">
                                {listing.preferences.map(pref => (
                                    <span key={pref} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                        <CheckIcon className="w-4 h-4 text-green-600 mr-0" />
                                        {pref}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-28 bg-gray-50 p-6 rounded-lg border">
                        <p className="text-2xl font-bold text-gray-900 mb-4 flex items-center"><RupeeIcon className="w-7 h-7" /> {listing.rent.toLocaleString('en-IN')} <span className="text-base font-normal text-gray-500 ml-1">/ month</span></p>
                        
                        <div className="border-t my-4"></div>
                        
                        <h3 className="font-semibold text-gray-800 mb-3">Posted by</h3>
                        <div 
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => onViewProfile(owner)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewProfile(owner); }}
                            aria-label={`View profile of ${owner.name}`}
                        >
                            <img src={owner.imageUrl} alt={owner.name} className="w-12 h-12 rounded-full object-cover"/>
                            <div>
                                <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{owner.name}</p>
                                <p className="text-sm text-gray-500">{owner.profession}</p>
                            </div>
                        </div>
                        
                        {listing.phone && (
                            <>
                                <div className="border-t my-4"></div>
                                <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
                                <a href={`tel:${listing.phone}`} className="flex items-center gap-2 text-indigo-600 font-semibold hover:underline">
                                    <PhoneIcon />
                                    <span>{listing.phone}</span>
                                </a>
                            </>
                        )}


                        <div className="mt-6 flex flex-col gap-3">
                             {currentUser?.id !== owner.id && (
                                <button onClick={onContact} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold">
                                    Contact Owner
                                </button>
                             )}
                            {currentUser && (
                                <button onClick={() => onToggleSave(listing.id)} className="w-full bg-gray-200 text-gray-800 py-2.5 rounded-lg hover:bg-gray-300 transition duration-300 font-semibold flex items-center justify-center gap-2">
                                    {isSaved ? <HeartIconSolid className="text-red-500"/> : <HeartIcon />}
                                    {isSaved ? 'Saved' : 'Save Listing'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }`}</style>
    </div>
  );
};

export default ListingDetailPage;