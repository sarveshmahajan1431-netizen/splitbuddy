import React from 'react';
import type { Listing, User } from '../types';
import ListingCard from './ListingCard';

interface FeaturedListingsProps {
  listings: Listing[];
  currentUser: User | null;
  savedListings: number[];
  onContact: (ownerId: number) => void;
  onEdit: (listing: Listing) => void;
  onDelete: (listingId: number) => void;
  onToggleSave: (listingId: number) => void;
  onViewMore: () => void;
  onViewDetails: (listing: Listing) => void;
}

const FeaturedListings: React.FC<FeaturedListingsProps> = ({ listings, currentUser, savedListings, onContact, onEdit, onDelete, onToggleSave, onViewMore, onViewDetails }) => {
  return (
    <section className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Featured Listings</h2>
        <button 
          onClick={onViewMore}
          className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
        >
          View More &rarr;
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map(listing => (
          <ListingCard 
            key={listing.id} 
            listing={listing}
            currentUser={currentUser}
            isSaved={savedListings.includes(listing.id)}
            onContact={onContact} 
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleSave={onToggleSave}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedListings;