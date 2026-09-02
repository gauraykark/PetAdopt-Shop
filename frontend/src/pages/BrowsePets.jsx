import React, { useState, useEffect } from 'react';
import PetCard from '../components/PetCard';
import UserDashboard from './UserDashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Shop items are static/UI-only (no backend for shop)
const shopData = [
  { id: 101, name: 'Premium Dog Chow', category: 'Food', price: '$45.00', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=800' },
  { id: 102, name: 'Interactive Chew Toy', category: 'Toys', price: '$12.99', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800' },
  { id: 103, name: 'Cozy Winter Pet Bed', category: 'Accessories', price: '$34.50', image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&q=80&w=800' },
  { id: 104, name: 'Organic Gourmet Cat Pate', category: 'Food', price: '$28.00', image: 'https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?auto=format&fit=crop&q=80&w=800' },
  { id: 105, name: 'Ergonomic Leather Leash', category: 'Accessories', price: '$22.50', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800' },
  { id: 106, name: 'Feather Wand Toy Set', category: 'Toys', price: '$9.99', image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=800' },
  { id: 107, name: 'Stainless Steel Dual Bowl', category: 'Accessories', price: '$18.99', image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=800' },
  { id: 108, name: 'Salmon Oil Coat Conditioner', category: 'Healthcare', price: '$19.50', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800' },
  { id: 109, name: 'Adjustable Padded Harness', category: 'Accessories', price: '$26.00', image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&q=80&w=800' },
  { id: 110, name: 'Crunchy Dental Dog Treats', category: 'Treats', price: '$14.25', image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=800' },
  { id: 111, name: 'Multi-Level Cat Tree Tower', category: 'Furniture', price: '$89.99', image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=800' },
  { id: 112, name: 'Gentle Pet Shampoo & Conditioner', category: 'Grooming', price: '$15.75', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800' },
  { id: 113, name: 'Automatic Water Fountain', category: 'Accessories', price: '$39.99', image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=800' },
];

const BrowsePets = () => {
  const [activeTab, setActiveTab] = useState('pets');
  const [pageLoaded, setPageLoaded] = useState(false);

  // Pets fetched from the backend
  const [pets, setPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsError, setPetsError] = useState('');

  // Get the logged-in user from localStorage (set during login)
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  // Fetch pets from the API whenever the pets tab is active
  useEffect(() => {
    if (activeTab !== 'pets') return;

    setPetsLoading(true);
    setPetsError('');

    fetch(`${API_URL}/api/pets`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch pets');
        return res.json();
      })
      .then((data) => {
        setPets(data);
        setPetsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pets:', err);
        setPetsError('Could not load pets. Please check your backend connection.');
        setPetsLoading(false);
      });
  }, [activeTab]);

  // Normalize pet data from DB to match what PetCard expects
  // DB columns: id, name, breed, species, age, image_url, status
  // PetCard expects: id, name, breed, age, image
  const normalizePet = (pet) => ({
    ...pet,
    image: pet.image_url || pet.image || '',
  });

  return (
    <div
      className={`w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-[#08130f] to-[#0f241a] px-4 sm:px-6 py-6 text-white transition-opacity duration-1000 ease-out ${
        pageLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-[1600px] mx-auto">

        {/* Navigation Bar */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">

          {/* Logo */}
          <div
            onClick={() => setActiveTab('pets')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-autumn-primary/20 border border-autumn-primary/40 p-2.5 rounded-2xl group-hover:scale-105 transition-all duration-300">
              <svg className="w-7 h-7 text-autumn-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-autumn-primary">
                PAW HAVEN
              </span>
              <p className="text-[10px] text-autumn-bg uppercase tracking-widest font-semibold">Adopt & Shop</p>
            </div>
          </div>

          {/* Center Tabs */}
          <div className="bg-black/20 backdrop-blur-3xl border border-white/15 p-1.5 rounded-2xl ring-1 ring-white/10 flex gap-2">
            <button
              onClick={() => setActiveTab('pets')}
              className={`px-5 sm:px-7 py-2.5 rounded-xl font-semibold transition-all duration-300 cursor-pointer text-sm sm:text-base ${
                activeTab === 'pets'
                  ? 'bg-autumn-primary text-white shadow-lg'
                  : 'text-autumn-bg hover:text-white'
              }`}
            >
              Adopt Pets {!petsLoading && `(${pets.length})`}
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-5 sm:px-7 py-2.5 rounded-xl font-semibold transition-all duration-300 cursor-pointer text-sm sm:text-base ${
                activeTab === 'shop'
                  ? 'bg-autumn-primary text-white shadow-lg'
                  : 'text-autumn-bg hover:text-white'
              }`}
            >
              Pet Shop ({shopData.length})
            </button>
          </div>

          {/* Dashboard / Account Button */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all duration-300 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-autumn-primary/20 border-autumn-primary text-white'
                : 'bg-black/20 border-white/15 text-autumn-bg hover:text-white hover:border-white/30'
            }`}
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-autumn-primary"
            />
            <span className="text-sm font-semibold hidden sm:inline">
              {user?.name || 'My Account'}
            </span>
          </button>
        </header>

        {/* Dashboard View */}
        {activeTab === 'dashboard' ? (
          <UserDashboard />
        ) : (
          <>
            {/* Page Header */}
            <div className="text-center mb-10 px-2 pt-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                Explore & Support
              </h1>
              <p className="text-autumn-bg text-lg max-w-2xl mx-auto">
                Find your next furry family member or browse essential food and accessories.
              </p>
            </div>

            {/* Pet Adoption Grid */}
            {activeTab === 'pets' && (
              <>
                {petsLoading && (
                  <p className="text-center text-autumn-bg py-10">Loading pets...</p>
                )}
                {petsError && (
                  <div className="text-center py-10">
                    <p className="text-red-400 text-sm">{petsError}</p>
                  </div>
                )}
                {!petsLoading && !petsError && pets.length === 0 && (
                  <p className="text-center text-autumn-bg py-10">No pets available right now.</p>
                )}
                {!petsLoading && !petsError && pets.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {pets.map((pet) => (
                      <PetCard key={pet.id} pet={normalizePet(pet)} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Shop Grid */}
            {activeTab === 'shop' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {shopData.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-black/15 backdrop-blur-3xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/20 p-3.5 text-white flex flex-col justify-between hover:border-white/30 transition-all duration-300"
                  >
                    <div>
                      <div className="overflow-hidden rounded-2xl h-40 w-full mb-3">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase text-autumn-bg tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold mt-0.5 mb-1 line-clamp-1">{item.name}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-white">{item.price}</span>
                      <button className="bg-autumn-primary hover:bg-autumn-muted text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg transition-all duration-300 active:scale-95 cursor-pointer">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowsePets;
