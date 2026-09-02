import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ApplyAdoption = ({ pet, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    housingType: 'Apartment',
    ownOrRent: 'Own',
    otherPets: 'No',
    experience: '',
    reason: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = {
      'full name': formData.fullName,
      email: formData.email,
      phone: formData.phone,
      reason: formData.reason,
      'pet ID': pet?.id,
    };
    const missingField = Object.entries(requiredFields).find(
      ([, value]) => value === undefined || value === null || String(value).trim() === ''
    )?.[0];

    if (missingField) {
      setErrorMsg(`Please provide your ${missingField}.`);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/api/adoptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          pet_id: pet.id,
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          housing_type: formData.housingType,
          own_or_rent: formData.ownOrRent,
          other_pets: formData.otherPets,
          experience: formData.experience,
          applicant_notes: formData.reason.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmitted(true);
      setTimeout(() => {
        if (onSubmitSuccess) onSubmitSuccess(data);
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-[#0c1c14] via-[#08130f] to-black border border-white/20 p-6 sm:p-8 text-white shadow-[0_16px_48px_rgba(0,0,0,0.6)] ring-1 ring-white/10 no-scrollbar">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-200 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold">Application Submitted!</h2>
            <p className="text-autumn-bg text-sm max-w-md mx-auto">
              Thank you for applying to adopt <span className="text-white font-semibold">{pet.name}</span>. Our team will review your application and reach out shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Header with Pet Info */}
            <div className="flex items-center gap-4 pb-6 mb-6 border-b border-white/10">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-autumn-primary"
              />
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-autumn-bg">
                  Adoption Application
                </span>
                <h2 className="text-2xl font-bold">Adopt {pet.name}</h2>
                <p className="text-xs text-white/60">{pet.breed} • {pet.age}</p>
              </div>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-autumn-bg mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-autumn-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-autumn-bg mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-autumn-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-autumn-bg mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 000-0000"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-autumn-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-autumn-bg mb-1">Housing Type</label>
                  <select
                    name="housingType"
                    value={formData.housingType}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-autumn-primary transition-all"
                  >
                    <option value="House" className="bg-gray-900">House</option>
                    <option value="Apartment" className="bg-gray-900">Apartment</option>
                    <option value="Condo" className="bg-gray-900">Condo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-autumn-bg mb-1">Own or Rent?</label>
                  <select
                    name="ownOrRent"
                    value={formData.ownOrRent}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-autumn-primary transition-all"
                  >
                    <option value="Own" className="bg-gray-900">Own</option>
                    <option value="Rent" className="bg-gray-900">Rent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-autumn-bg mb-1">Do you currently own other pets?</label>
                <div className="flex flex-wrap gap-4 pt-1">
                  {['No', 'Yes (Dogs)', 'Yes (Cats)', 'Yes (Other)'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                      <input
                        type="radio"
                        name="otherPets"
                        value={opt}
                        checked={formData.otherPets === opt}
                        onChange={handleChange}
                        className="accent-autumn-primary"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-autumn-bg mb-1">Pet Care Experience</label>
                <textarea
                  name="experience"
                  rows="2"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Briefly describe your experience caring for pets..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-white placeholder-white/30 focus:outline-none focus:border-autumn-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-autumn-bg mb-1">
                  Why do you want to adopt {pet.name}? *
                </label>
                <textarea
                  name="reason"
                  required
                  rows="2"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Tell us a little bit about your home and lifestyle..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-white placeholder-white/30 focus:outline-none focus:border-autumn-primary transition-all"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="w-1/3 bg-white/10 hover:bg-white/15 text-white font-semibold py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-autumn-primary hover:bg-autumn-muted text-white font-semibold py-3 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplyAdoption;
