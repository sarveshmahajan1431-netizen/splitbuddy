


export interface LifestylePreferences {
  smoking: 'Yes' | 'No' | 'Occasionally';
  drinking: 'Yes' | 'No' | 'Socially';
  food: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggetarian';
  socialHabits: 'Party animal' | 'Quiet nights in' | 'Mix of both';
  cleanliness: 'Very tidy' | 'Moderately clean' | 'Relaxed';
}

export interface User {
  id: number;
  name: string;
  age: number;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  lookingFor: 'Male' | 'Female' | 'Any';
  profession: string;
  city: string;
  budget: number;
  imageUrl: string;
  bio: string;
  preferences: LifestylePreferences;
  email?: string;
  password?: string; // In a real app, never store plaintext passwords
  phone?: string;
}

export interface Listing {
  id: number;
  ownerId: number;
  title: string;
  city: string;
  location: string;
  rent: number;
  type: 'Private Room' | 'Shared Room' | 'Entire Flat';
  mediaUrls: string[];
  amenities: string[];
  description: string;
  phone?: string;
  preferences?: string[];
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface Message {
  id: number;
  fromId: number;
  toId: number;
  text: string;
  timestamp: number;
  readBy: number[];
}

export interface CompatibilityResult {
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
}