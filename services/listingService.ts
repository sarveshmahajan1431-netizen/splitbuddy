import type { Listing } from '../types';

const LISTINGS_KEY = 'splitbuddy_listings';

const getCachedListings = (): Listing[] => {
  try {
    const stored = localStorage.getItem(LISTINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const setCachedListings = (listings: Listing[]) => {
  try {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
  } catch (e) {}
};

export const fetchListingsAsync = async (): Promise<Listing[]> => {
  try {
    const res = await fetch('/api/listings');
    if (res.ok) {
      const listings: Listing[] = await res.json();
      setCachedListings(listings);
      return listings;
    }
  } catch (err) {
    console.warn('API fetch listings failed, falling back to cache:', err);
  }
  return getCachedListings();
};

export const getListings = (): Listing[] => {
  fetchListingsAsync().catch(() => {});
  return getCachedListings();
};

export const saveListings = (listings: Listing[]) => {
  setCachedListings(listings);
};

export const addListing = (listing: Listing): Listing[] => {
  const listings = getCachedListings();
  const newListings = [...listings, listing];
  setCachedListings(newListings);

  fetch('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listing)
  })
    .then(res => res.json())
    .then(savedListing => {
      if (savedListing && savedListing.id) {
        const current = getCachedListings();
        const updated = current.map(l => l.id === listing.id ? savedListing : l);
        setCachedListings(updated);
      }
    })
    .catch(err => console.error('Failed to sync new listing to DB:', err));

  return newListings;
};

export const updateListing = (updatedListing: Listing): Listing[] => {
  const listings = getCachedListings();
  const newListings = listings.map(l => l.id === updatedListing.id ? updatedListing : l);
  setCachedListings(newListings);

  fetch(`/api/listings/${updatedListing.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedListing)
  }).catch(err => console.error('Failed to sync listing update to DB:', err));

  return newListings;
};

export const deleteListing = (listingId: number): Listing[] => {
  const listings = getCachedListings();
  const newListings = listings.filter(l => l.id !== listingId);
  setCachedListings(newListings);

  fetch(`/api/listings/${listingId}`, {
    method: 'DELETE'
  }).catch(err => console.error('Failed to delete listing from DB:', err));

  return newListings;
};