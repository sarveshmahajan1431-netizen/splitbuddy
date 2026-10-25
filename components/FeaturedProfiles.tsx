import React from 'react';
import type { User } from '../types';
import ProfileCard from './ProfileCard';

interface FeaturedProfilesProps {
    users: User[];
    onContact: (userId: number) => void;
    onViewMore: () => void;
    onViewDetails: (user: User) => void;
}

const FeaturedProfiles: React.FC<FeaturedProfilesProps> = ({ users, onContact, onViewMore, onViewDetails }) => {
    return (
        <section className="mt-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Featured Profiles</h2>
                 <button 
                  onClick={onViewMore}
                  className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                >
                  View More &rarr;
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map(user => (
                    <ProfileCard 
                        key={user.id} 
                        user={user} 
                        onContact={onContact} 
                        onViewDetails={onViewDetails}
                    />
                ))}
            </div>
        </section>
    );
};

export default FeaturedProfiles;