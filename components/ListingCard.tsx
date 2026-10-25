
import React from 'react';
import type { Listing, User } from '../types';
import { BedIcon, MapPinIcon, RupeeIcon, HeartIcon, HeartIconSolid } from './icons/Icons';

interface ListingCardProps {
  listing: Listing;
  currentUser: User | null;
  isSaved: boolean;
  onContact: (ownerId: number) => void;
  onEdit: (listing: Listing) => void;
  onDelete: (listingId: number) => void;
  onToggleSave: (listingId: number) => void;
  onViewDetails: (listing: Listing) => void;
}

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
  return 'fa-solid fa-check'; // Generic icon
};


const ListingCard: React.FC<ListingCardProps> = ({ listing, currentUser, isSaved, onContact, onEdit, onDelete, onToggleSave, onViewDetails }) => {
  const isOwner = currentUser && currentUser.id === listing.ownerId;
  const coverMedia = listing.mediaUrls?.[0] || 'https://placehold.co/600x400/EEE/31343C?text=No+Media';

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  }

  return (
    <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col cursor-pointer"
        onClick={() => onViewDetails(listing)}
    >
      <div className="relative">
        {coverMedia.startsWith('data:video') ? (
            <video src={coverMedia} autoPlay loop muted playsInline className="w-full h-48 object-cover" />
        ) : (
            <img src={coverMedia} alt={listing.title} className="w-full h-48 object-cover" />
        )}
        {listing.mediaUrls && listing.mediaUrls.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                <i className="fa-regular fa-images mr-1"></i>
                {listing.mediaUrls.length}
            </div>
        )}
        {currentUser && (
            <button
                onClick={(e) => handleButtonClick(e, () => onToggleSave(listing.id))}
                className="absolute top-2 left-2 bg-black bg-opacity-40 p-2 rounded-full text-white hover:text-red-400 hover:bg-opacity-60 transition-all duration-200"
                aria-label={isSaved ? "Unsave listing" : "Save listing"}
            >
                {isSaved ? 
                    <HeartIconSolid className="w-5 h-5 text-red-500" /> : 
                    <HeartIcon className="w-5 h-5" />
                }
            </button>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{listing.title}</h3>
        <p className="text-gray-600 mb-4 flex items-center"><MapPinIcon />{listing.location}, {listing.city}</p>
        
        <div className="flex justify-between items-center text-gray-700 mb-4">
          <span className="flex items-center font-semibold text-lg text-indigo-600"><RupeeIcon /> {listing.rent.toLocaleString('en-IN')} / month</span>
          <span className="flex items-center bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"><BedIcon />{listing.type}</span>
        </div>

        <div className="mb-4 flex-grow">
            <h4 className="font-semibold text-sm mb-2 text-gray-600">Amenities</h4>
            <div className="flex flex-wrap gap-2">
                {listing.amenities.slice(0, 4).map(amenity => (
                    <span 
                      key={amenity} 
                      className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-2"
                      title={amenity}
                    >
                        <i className={getAmenityIcon(amenity)}></i>
                        <span>{amenity}</span>
                    </span>
                ))}
                {listing.amenities.length > 4 && <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full">+{listing.amenities.length - 4} more</span>}
            </div>
        </div>
        
        <div className="mt-auto">
            {isOwner ? (
                <div className="flex gap-2">
                    <button onClick={(e) => handleButtonClick(e, () => onEdit(listing))} className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition duration-300 font-semibold">
                      Edit
                    </button>
                    <button onClick={(e) => handleButtonClick(e, () => onDelete(listing.id))} className="w-full bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition duration-300 font-semibold">
                      Delete
                    </button>
                </div>
            ) : (
                <button onClick={(e) => handleButtonClick(e, () => onContact(listing.ownerId))} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                  Contact Owner
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
