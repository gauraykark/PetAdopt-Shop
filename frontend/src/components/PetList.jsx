import { useEffect, useState } from 'react';

const API_URL = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || 'http://localhost:5000') : '';

// Simple pet list component (used as a fallback or standalone view)
export default function PetList() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/pets`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load pets');
        return res.json();
      })
      .then((data) => {
        setPets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pets:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-autumn-bg py-10">Loading pets...</p>;
  if (error) return <p className="text-center text-red-400 py-10">{error}</p>;
  if (pets.length === 0) return <p className="text-center text-autumn-bg py-10">No pets available.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {pets.map((pet) => (
        <div
          key={pet.id}
          className="rounded-2xl bg-black/15 border border-white/15 p-4 text-white"
        >
          <img
            src={pet.image_url}
            alt={pet.name}
            className="w-full h-40 object-cover rounded-xl mb-3"
          />
          <h3 className="font-bold text-lg">{pet.name}</h3>
          <p className="text-sm text-autumn-bg">{pet.breed} ({pet.species})</p>
          <span className="text-xs text-white/50">Status: {pet.status}</span>
        </div>
      ))}
    </div>
  );
}
