

import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import ListingCard from './components/ListingCard';
import ProfileCard from './components/ProfileCard';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import ListingModal from './components/ListingModal';
import Toast from './components/Toast';
import FeaturedListings from './components/FeaturedListings';
import FeaturedProfiles from './components/FeaturedProfiles';
import ListingDetailPage from './components/ListingDetailPage';
import ProfileDetailPage from './components/ProfileDetailPage';
import ChatPage from './components/ChatPage';
import ProfileForm from './components/ProfileForm';
import ChatLauncher from './components/ChatLauncher';
import { MOCK_LISTINGS } from './constants';
import * as authService from './services/authService';
import * as userService from './services/userService';
import * as chatService from './services/chatService';
import * as listingService from './services/listingService';
import { clearAllData } from './services/resetService';
import type { User, Listing, Toast as ToastType } from './types';

type View = 'home' | 'listings' | 'profiles' | 'saved' | 'listingDetail' | 'profileDetail' | 'chat' | 'myProfile';
type ModalView = 'login' | 'signup' | 'listing' | null;

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [modal, setModal] = useState<ModalView>(null);
  const [filters, setFilters] = useState({ city: 'Any', budget: 100000, lifestyle: [] as string[] });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingToEdit, setListingToEdit] = useState<Listing | null>(null);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [savedListings, setSavedListings] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<Listing | User | null>(null);
  const [previousView, setPreviousView] = useState<View>('home');
  const [chatPartner, setChatPartner] = useState<User | null>(null);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [previousListing, setPreviousListing] = useState<Listing | null>(null);

  const refreshUnreadCount = () => {
    if (currentUser) {
        const count = chatService.getTotalUnreadCount(currentUser.id);
        setTotalUnreadCount(count);
    } else {
        setTotalUnreadCount(0);
    }
  };


  useEffect(() => {
    // Load all users and listings into state from SQLite database backend
    const loadInitialData = async () => {
      const loadedUsers = await userService.fetchUsersAsync();
      const loadedListings = await listingService.fetchListingsAsync();
      setUsers(loadedUsers);
      setListings(loadedListings);

      const user = authService.getCurrentUserFromSession();
      if (user) {
        setCurrentUser(user);
        const saved = await userService.fetchSavedListingsAsync(user.id);
        setSavedListings(saved);
      }
    };

    loadInitialData();
  }, []);
  
  useEffect(() => {
    refreshUnreadCount();

    const intervalId = setInterval(() => {
        refreshUnreadCount();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const addToast = (message: string, type: ToastType['type'] = 'success') => {
      const id = Date.now();
      setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: number) => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };


  const handleSearch = (newFilters: { city: string; budget: number; lifestyle: string[] }) => {
    setFilters(newFilters);
  };
  
  const handleStartChat = (partnerId: number) => {
    if (!currentUser) {
        setModal('login');
        addToast('Please log in to start a chat.', 'error');
        return;
    }
    const partner = users.find(u => u.id === partnerId);
    if (partner) {
        setPreviousView(view);
        setChatPartner(partner);
        setView('chat');
        window.scrollTo(0, 0);
    } else {
        addToast('Could not find the user to chat with.', 'error');
    }
  };


  const handleLogin = async (email: string, password: string): Promise<User> => {
    const user = await authService.login(email, password);
    setCurrentUser(user);
    setSavedListings(userService.getSavedListings(user.id));
    setModal(null);
    return user;
  };

  const handleSignup = async (name: string, email: string, password: string): Promise<User> => {
    const user = await authService.register({ name, email, password });
    setCurrentUser(user);
    // New user starts with no saved listings
    setSavedListings([]);
    // Add the new user to our users state
    setUsers(prevUsers => [...prevUsers, user]);
    setModal(null);
    return user;
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setSavedListings([]);
    setView('home');
  };

  const handlePostListingClick = () => {
    if (!currentUser) {
      setModal('login');
      return;
    }
    setListingToEdit(null);
    setModal('listing');
  };
  
  const handleEditListingClick = (listing: Listing) => {
    setListingToEdit(listing);
    setModal('listing');
  };

  const handleDeleteListing = (listingId: number) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
        const updatedListings = listingService.deleteListing(listingId);
        setListings(updatedListings);
    }
  };

  const handleListingSubmit = (listingData: Omit<Listing, 'id' | 'ownerId'>) => {
    if (!currentUser) return;
    
    const isEditing = !!listingToEdit;

    if(isEditing) {
        // Update existing listing
        const updatedListing = { ...listingToEdit, ...listingData };
        const updatedListings = listingService.updateListing(updatedListing);
        setListings(updatedListings);
    } else {
        // Add new listing
        const newListing: Listing = {
            ...listingData,
            id: Date.now(),
            ownerId: currentUser.id,
        };
        const updatedListings = listingService.addListing(newListing);
        setListings(updatedListings);
    }
    setModal(null);
    setListingToEdit(null);
    addToast(isEditing ? 'Listing successfully updated!' : 'Listing successfully posted!');
  };
  
  const handleProfileUpdate = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser: User = { ...currentUser, ...updatedData, preferences: { ...currentUser.preferences, ...updatedData.preferences }};
    const newUsers = userService.updateUser(updatedUser);

    setUsers(newUsers);
    setCurrentUser(updatedUser);
    
    addToast('Profile updated successfully!');
    // Navigate to profile detail page to see changes
    setSelectedItem(updatedUser);
    setView('profileDetail');
  };


  const handleToggleSaveListing = (listingId: number) => {
    if (!currentUser) {
        setModal('login');
        addToast('You must be logged in to save listings.', 'error');
        return;
    }
    const isSaved = savedListings.includes(listingId);
    const newSaved = isSaved
        ? savedListings.filter(id => id !== listingId)
        : [...savedListings, listingId];
    
    setSavedListings(newSaved);
    userService.updateSavedListings(currentUser.id, newSaved);
    addToast(isSaved ? 'Listing unsaved.' : 'Listing saved!', 'success');
  };

  const handleViewListing = (listing: Listing) => {
    setPreviousView(view);
    setSelectedItem(listing);
    setView('listingDetail');
    window.scrollTo(0, 0);
  };

  const handleViewProfile = (user: User) => {
    setPreviousView(view);
    if (view === 'listingDetail' && selectedItem && 'price' in selectedItem) {
      setPreviousListing(selectedItem);
    }
    setSelectedItem(user);
    setView('profileDetail');
  };  const handleGoBack = () => {
    if (view === 'chat' && chatPartner) {
      // If we're going back from chat, find the user profile and set it as selected item
      const userProfile = users.find(u => u.id === chatPartner.id);
      setSelectedItem(userProfile || null);
    } else if (view === 'profileDetail' && previousListing) {
      // If we're going back from a profile and have a previous listing, restore it
      setSelectedItem(previousListing);
      setPreviousListing(null);
    } else {
      setSelectedItem(null);
    }
    setView(previousView);
    setChatPartner(null);
  };
  
  const navigate = (newView: View) => {
    setPreviousView(view);
    if (newView !== 'listingDetail' && newView !== 'profileDetail') {
        setSelectedItem(null);
    }
     if (newView !== 'chat') {
        setChatPartner(null);
    }
    setView(newView);
  }

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const cityMatch = filters.city === 'Any' || listing.city.toLowerCase() === filters.city.toLowerCase();
      const budgetMatch = listing.rent <= filters.budget;
      const lifestyleMatch = filters.lifestyle.length === 0 ? true : filters.lifestyle.every(filter => {
        // If no preferences are set for the listing, don't filter it out
        if (!listing.preferences) return true;
        
        // Check if the listing preferences match the filter
        switch (filter) {
          case 'Vegetarian':
          case 'Vegan':
          case 'Eggetarian':
            return listing.preferences.includes(filter);
          case 'Non-Smoker':
            return listing.preferences.includes('No smoking');
          case 'Non-Drinker':
            return listing.preferences.includes('No alcohol');
          case 'Social Drinker':
            return listing.preferences.includes('Social drinking');
          case 'Quiet Nights In':
            return listing.preferences.includes('Quiet environment');
          case 'Party Animal':
            return listing.preferences.includes('Party friendly');
          case 'Very Tidy':
            return listing.preferences.includes('Clean and tidy');
          default:
            return listing.preferences.includes(filter);
        }
      });
      return cityMatch && budgetMatch && lifestyleMatch;
    });
  }, [filters, listings]);

  const filteredProfiles = useMemo(() => {
    return users.filter(user => {
      // Exclude current user from the list
      if (currentUser && user.id === currentUser.id) return false;

      // City matching - Show if either user has "Any" or cities match
      const cityMatch = filters.city === 'Any' || user.city === 'Any' || user.city.toLowerCase() === filters.city.toLowerCase();
      
      // Budget matching - Show if their budget is within the filter range
      const budgetMatch = user.budget <= filters.budget;
      
      // Lifestyle matching - Only apply if filters are selected
      const lifestyleMatch = filters.lifestyle.length === 0 ? true : filters.lifestyle.some(filter => {
        switch (filter) {
            case 'Vegetarian':
                return user.preferences.food === 'Vegetarian' || user.preferences.food === 'Vegan';
            case 'Vegan':
                return user.preferences.food === 'Vegan';
            case 'Eggetarian':
                return user.preferences.food === 'Eggetarian';
            case 'Non-Smoker':
                return user.preferences.smoking === 'No';
            case 'Non-Drinker':
                return user.preferences.drinking === 'No';
            case 'Social Drinker':
                return user.preferences.drinking === 'Socially';
            case 'Quiet Nights In':
                return user.preferences.socialHabits === 'Quiet nights in';
            case 'Party Animal':
                return user.preferences.socialHabits === 'Party animal';
            case 'Very Tidy':
                return user.preferences.cleanliness === 'Very tidy';
            default:
                return false;
        }
      });
      
      // We don't need to check lookingFor preferences when filtering the list
      // This allows users to see all potential matches and make their own decisions
      return cityMatch && budgetMatch && lifestyleMatch;
    });
  }, [filters, currentUser, users]);

  const renderContent = () => {
    switch (view) {
      case 'listingDetail': {
        const listing = selectedItem as Listing;
        const owner = users.find(u => u.id === listing?.ownerId);
        if (!listing || !owner) {
          return <div className="text-center p-8">Listing not found. <button onClick={handleGoBack} className="text-indigo-600">Go Back</button></div>;
        }
        return (
          <ListingDetailPage 
            listing={listing} 
            owner={owner}
            currentUser={currentUser}
            isSaved={savedListings.includes(listing.id)}
            onContact={() => handleStartChat(owner.id)}
            onToggleSave={handleToggleSaveListing}
            onBack={handleGoBack}
            onViewProfile={handleViewProfile}
          />
        );
      }
      case 'profileDetail': {
        const user = selectedItem as User;
         if (!user) {
          return <div className="text-center p-8">Profile not found. <button onClick={handleGoBack} className="text-indigo-600">Go Back</button></div>;
        }
        return (
          <ProfileDetailPage
            user={user}
            onContact={() => handleStartChat(user.id)}
            onBack={handleGoBack}
          />
        );
      }
       case 'chat': {
        if (!currentUser || !chatPartner) {
            return <div className="text-center p-8">Chat not available. <button onClick={handleGoBack} className="text-indigo-600">Go Back</button></div>;
        }
        return (
            <ChatPage
                currentUser={currentUser}
                chatPartner={chatPartner}
                onBack={handleGoBack}
                onMessagesRead={refreshUnreadCount}
            />
        );
      }
      case 'myProfile': {
        if (!currentUser) {
            // Should not happen if UI is correct, but as a fallback:
            addToast('Please log in to edit your profile.', 'error');
            setView('home');
            setModal('login');
            return null;
        }
        return <ProfileForm currentUser={currentUser} onSubmit={handleProfileUpdate} />;
      }
      case 'listings':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map(listing => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing}
                  currentUser={currentUser}
                  isSaved={savedListings.includes(listing.id)}
                  onContact={handleStartChat} 
                  onEdit={handleEditListingClick}
                  onDelete={handleDeleteListing}
                  onToggleSave={handleToggleSaveListing}
                  onViewDetails={handleViewListing}
                />
              ))}
            </div>
            {filteredListings.length === 0 && <p className="text-gray-500 col-span-full text-center mt-8">No listings match your criteria. Try adjusting your filters.</p>}
          </>
        );
      case 'profiles':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProfiles.map(user => (
                <ProfileCard 
                  key={user.id} 
                  user={user} 
                  onContact={handleStartChat}
                  onViewDetails={handleViewProfile}
                />
              ))}
            </div>
            {filteredProfiles.length === 0 && <p className="text-gray-500 col-span-full text-center mt-8">No profiles match your criteria. Try adjusting your filters.</p>}
          </>
        );
      case 'saved':
          const userSavedListings = listings.filter(l => savedListings.includes(l.id));
          return (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">My Saved Listings</h2>
              {userSavedListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {userSavedListings.map(listing => (
                          <ListingCard
                              key={listing.id}
                              listing={listing}
                              currentUser={currentUser}
                              isSaved={savedListings.includes(listing.id)}
                              onContact={handleStartChat}
                              onEdit={handleEditListingClick}
                              onDelete={handleDeleteListing}
                              onToggleSave={handleToggleSaveListing}
                              onViewDetails={handleViewListing}
                          />
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-16 border-2 border-dashed rounded-lg">
                      <p className="text-gray-500 text-lg">You haven't saved any listings yet.</p>
                      <p className="text-gray-400 mt-2">Click the heart icon on a listing to save it here!</p>
                  </div>
              )}
            </>
          );
      case 'home':
      default:
        return (
          <>
            <Hero 
                onFindFlatmateClick={() => navigate('profiles')}
                onFindRoomClick={() => navigate('listings')}
            />
            <FeaturedListings 
               listings={listings.slice(0, 3)} 
               currentUser={currentUser}
               savedListings={savedListings}
               onContact={handleStartChat} 
               onEdit={handleEditListingClick}
               onDelete={handleDeleteListing}
               onToggleSave={handleToggleSaveListing}
               onViewMore={() => navigate('listings')}
               onViewDetails={handleViewListing}
            />
            <FeaturedProfiles
                users={users.filter(u => currentUser ? u.id !== currentUser.id : true).slice(0, 4)}
                onContact={handleStartChat}
                onViewMore={() => navigate('profiles')}
                onViewDetails={handleViewProfile}
            />

            {/* How It Works Section */}
            <section className="mt-24 mb-16">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">How SplitBuddy Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto px-4">
                <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-user-plus text-2xl text-indigo-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
                  <p className="text-gray-600">Sign up and create your profile with your preferences, budget, and lifestyle choices to find the perfect match.</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-magnifying-glass text-2xl text-indigo-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Find Your Match</h3>
                  <p className="text-gray-600">Browse through verified profiles and listings that match your preferences and connect with potential flatmates.</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-comments text-2xl text-indigo-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Connect & Chat</h3>
                  <p className="text-gray-600">Use our built-in chat system to communicate, share details, and plan your next steps with potential flatmates.</p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-16 bg-indigo-50 py-12 px-4">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">{users.length}+</div>
                    <div className="text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">{listings.length}+</div>
                    <div className="text-gray-600">Available Listings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">5+</div>
                    <div className="text-gray-600">Major Cities</div>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header 
        user={currentUser}
        setView={navigate} 
        onLoginClick={() => setModal('login')}
        onSignupClick={() => setModal('signup')}
        onPostListingClick={handlePostListingClick}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        {['listings', 'profiles'].includes(view) && (
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} showLifestyleFilter={view === 'profiles'} />
          </div>
        )}
        {renderContent()}
      </main>

      
      {modal === 'login' && (
        <LoginModal 
          onClose={() => setModal(null)} 
          onLogin={handleLogin}
          onSwitchToSignup={() => setModal('signup')}
        />
      )}

      {modal === 'signup' && (
        <SignupModal 
          onClose={() => setModal(null)} 
          onSignup={handleSignup}
          onSwitchToLogin={() => setModal('login')}
        />
      )}

      {modal === 'listing' && (
        <ListingModal
          onClose={() => setModal(null)}
          onSubmit={handleListingSubmit}
          listing={listingToEdit}
        />
      )}
      
      {/* Toast Container */}
      <div aria-live="polite" aria-atomic="true" className="fixed top-5 inset-x-0 z-[100] flex flex-col items-center space-y-2">
          {toasts.map(toast => (
              <Toast key={toast.id} toast={toast} onClose={removeToast} />
          ))}
      </div>
      
      {currentUser && (
        <ChatLauncher
            currentUser={currentUser}
            users={users}
            unreadCount={totalUnreadCount}
            onConversationSelect={(partner) => {
              setChatPartner(partner);
              setView('chat');
            }}
        />
      )}


      <footer className="bg-white border-t mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-gray-500">
              &copy; {new Date().getFullYear()} Splitbuddy. All rights reserved. A conceptual project.
          </div>
      </footer>
    </div>
  );
};

export default App;