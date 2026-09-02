import { useState } from 'react';
import ApplyAdoption from '../pages/ApplyAdoption';

const PetCard = ({ pet }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const handleOpenApply = (e) => {
    e.stopPropagation(); // Prevents triggering parent click events
    setIsExpanded(false); // Close expanded detail modal if open
    setIsApplyOpen(true); // Open adoption application modal
  };

  return (
    <>
      {/* Main Card Container */}
      <div
        onClick={() => setIsExpanded(true)}
        className="surface-card group relative cursor-pointer rounded-2xl p-5 transition-all duration-500 ease-in-out flex flex-col justify-between"
      >
        {/* Subtle Warm Glow Behind Image */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-autumn-primary/20 blur-3xl rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50" />

        <div>
          <div className="relative overflow-hidden rounded-2xl aspect-[4/3] w-full mb-6 border border-white/10 shadow-inner">
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            
            <span className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-autumn-bg shadow-lg">
              {pet.age}
            </span>
          </div>

          {/* Details Section */}
          <div className="text-white px-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-3xl font-extrabold tracking-tight text-white group-hover:text-autumn-bg transition-colors duration-300">
                {pet.name}
              </h3>
            </div>
            
            <p className="text-autumn-bg/90 font-medium text-base mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-autumn-primary shadow-[0_0_8px_rgba(255,165,0,0.6)]"></span>
              {pet.breed}
            </p>
          </div>
        </div>

        {/* Hover Action Bar */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm font-semibold text-autumn-bg group-hover:text-white transition-colors duration-300 px-2">
          <span>Meet {pet.name}</span>
          <span className="text-lg transition-transform duration-300 group-hover:translate-x-2">→</span>
        </div>
      </div>

      {/* Expanded Pet Detail View */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6 transition-all animate-fadeIn"
          onClick={() => setIsExpanded(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-surface relative max-w-2xl w-full rounded-2xl p-6 sm:p-8 text-white overflow-hidden"
          >
            {/* Ambient background blur inside modal */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-autumn-primary/30 blur-3xl rounded-full pointer-events-none" />

            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-autumn-bg hover:text-white flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-300"
            >
              ✕
            </button>

            {/* Modal Image */}
            <div className="overflow-hidden rounded-2xl h-80 w-full mb-6 border border-white/15 shadow-xl">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Info */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-4xl font-bold tracking-tight">{pet.name}</h2>
            </div>

            <div className="flex flex-wrap gap-3 text-autumn-bg text-sm font-medium mb-6">
              <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15">
                Breed: {pet.breed}
              </span>
              <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15">
                Age: {pet.age}
              </span>
            </div>

            <p className="text-autumn-bg/90 mb-8 text-base leading-relaxed font-normal">
              {pet.description || `${pet.name} is a gentle, loving companion looking for a warm home. Friendly with family, full of positive energy, and ready to share unforgettable moments.`}
            </p>

            <button
              onClick={handleOpenApply}
              className="primary-action w-full font-bold text-lg py-4 rounded-xl shadow-xl transition-all duration-300 ease-in-out active:scale-[0.98] cursor-pointer"
            >
              Apply for Adoption
            </button>
          </div>
        </div>
      )}

      {/* Adoption Form Modal */}
      {isApplyOpen && (
        <ApplyAdoption
          pet={pet}
          onClose={() => setIsApplyOpen(false)}
          onSubmitSuccess={(data) => {
            console.log('Adoption Application Submitted:', data);
          }}
        />
      )}
    </>
  );
};

export default PetCard;