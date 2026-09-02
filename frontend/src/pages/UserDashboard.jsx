import React, { useState } from 'react';

const mockUserData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  memberSince: 'January 2025',
  stats: {
    adoptionsCompleted: 1,
    savedPets: 4,
    totalOrders: 6,
  },
  adoptionRequests: [
    {
      id: 'REQ-101',
      petName: 'Luna',
      breed: 'Siberian Husky',
      image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&q=80&w=800',
      status: 'In Review',
      date: 'May 12, 2026',
      shelter: 'Warm Paws Rescue - North Branch',
      applicantNotes: 'Has a fenced backyard and experience with energetic breeds.',
      timeline: [
        { title: 'Application Submitted', date: 'May 12, 2026', completed: true },
        { title: 'Background Check', date: 'May 13, 2026', completed: true },
        { title: 'Shelter Review & Interview', date: 'In Progress', completed: false },
        { title: 'Final Decision', date: 'Pending', completed: false },
      ]
    },
    {
      id: 'REQ-089',
      petName: 'Oliver',
      breed: 'Tabby Cat',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
      status: 'Approved',
      date: 'April 28, 2026',
      shelter: 'City Animal Care Center',
      applicantNotes: 'Quiet home environment, ideal for an indoor cat.',
      timeline: [
        { title: 'Application Submitted', date: 'April 28, 2026', completed: true },
        { title: 'Background Check', date: 'April 29, 2026', completed: true },
        { title: 'Shelter Review & Interview', date: 'May 01, 2026', completed: true },
        { title: 'Final Approval', date: 'May 03, 2026', completed: true },
      ]
    },
  ],
  recentOrders: [
    {
      id: 'ORD-9823',
      date: 'May 02, 2026',
      items: 'Premium Dog Chow, Interactive Chew Toy',
      total: '$57.99',
      status: 'Delivered',
    },
    {
      id: 'ORD-9751',
      date: 'April 15, 2026',
      items: 'Automatic Water Fountain',
      total: '$39.99',
      status: 'Delivered',
    },
  ],
  savedPets: [
    { id: 1, name: 'Buddy', breed: 'Golden Retriever', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800' },
    { id: 4, name: 'Milo', breed: 'French Bulldog', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800' },
    { id: 9, name: 'Daisy', breed: 'Corgi', image: 'https://images.unsplash.com/photo-1612536057832-2ff7ead7819c?auto=format&fit=crop&q=80&w=800' },
    { id: 13, name: 'Leo', breed: 'Ragdoll Cat', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=800' },
  ],
};

const UserDashboard = ({ externalRequests, onAddAdoptionRequest }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for dynamic adoption requests
  const [adoptionRequests, setAdoptionRequests] = useState(
    externalRequests || mockUserData.adoptionRequests
  );

  // Selected request state for the View Details modal
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Function to prepend new adoption requests when triggered
  const handleNewAdoption = (newRequest) => {
    const formattedRequest = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      petName: newRequest.petName || newRequest.name,
      breed: newRequest.breed,
      image: newRequest.image,
      status: 'In Review',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      shelter: 'Haven Pet Rescue Center',
      applicantNotes: 'Submitted via fast-track adoption request.',
      timeline: [
        { title: 'Application Submitted', date: 'Today', completed: true },
        { title: 'Background Check', date: 'Pending', completed: false },
        { title: 'Shelter Review & Interview', date: 'Pending', completed: false },
        { title: 'Final Decision', date: 'Pending', completed: false },
      ]
    };

    setAdoptionRequests((prev) => [formattedRequest, ...prev]);

    if (onAddAdoptionRequest) {
      onAddAdoptionRequest(formattedRequest);
    }
  };

  // Computed metric count dynamically linked to current state
  const pendingCount = adoptionRequests.filter(
    (req) => req.status === 'In Review' || req.status === 'Pending'
  ).length;

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-[#08130f] to-[#0f241a] px-4 sm:px-6 py-12 text-white">
      <div className="max-w-[1600px] mx-auto pt-8">
        
        {/* Profile Header Banner */}
        <div className="rounded-3xl bg-black/20 backdrop-blur-3xl border border-white/15 p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 ring-1 ring-white/10">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative">
              <img
                src={mockUserData.avatar}
                alt={mockUserData.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-autumn-primary ring-4 ring-white/10"
              />
              <span className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-black" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-1">
                {mockUserData.name}
              </h1>
              <p className="text-autumn-bg text-sm sm:text-base">{mockUserData.email}</p>
              <p className="text-xs text-white/50 mt-2">Member since {mockUserData.memberSince}</p>
            </div>
          </div>

          <button className="bg-autumn-primary hover:bg-autumn-muted text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 active:scale-95 cursor-pointer">
            Edit Profile
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 mb-8 pb-2 border-b border-white/10">
          {['overview', 'adoptions', 'orders', 'saved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold capitalize whitespace-nowrap transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? 'bg-autumn-primary text-white shadow-lg'
                  : 'text-autumn-bg hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'saved' ? 'Saved Pets' : tab}
            </button>
          ))}
        </div>

        {/* Tab Content: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-2xl bg-black/15 backdrop-blur-3xl border border-white/15 p-5 ring-1 ring-white/10">
                <span className="text-xs uppercase font-semibold text-autumn-bg tracking-wider">Pending Adoptions</span>
                <p className="text-3xl font-bold mt-2">{pendingCount}</p>
              </div>
              <div className="rounded-2xl bg-black/15 backdrop-blur-3xl border border-white/15 p-5 ring-1 ring-white/10">
                <span className="text-xs uppercase font-semibold text-autumn-bg tracking-wider">Pets Adopted</span>
                <p className="text-3xl font-bold mt-2">{mockUserData.stats.adoptionsCompleted}</p>
              </div>
              <div className="rounded-2xl bg-black/15 backdrop-blur-3xl border border-white/15 p-5 ring-1 ring-white/10">
                <span className="text-xs uppercase font-semibold text-autumn-bg tracking-wider">Saved Pets</span>
                <p className="text-3xl font-bold mt-2">{mockUserData.stats.savedPets}</p>
              </div>
              <div className="rounded-2xl bg-black/15 backdrop-blur-3xl border border-white/15 p-5 ring-1 ring-white/10">
                <span className="text-xs uppercase font-semibold text-autumn-bg tracking-wider">Total Shop Orders</span>
                <p className="text-3xl font-bold mt-2">{mockUserData.stats.totalOrders}</p>
              </div>
            </div>

            {/* Adoption Applications Section */}
            <div className="rounded-3xl bg-black/15 backdrop-blur-3xl border border-white/15 p-6 ring-1 ring-white/10">
              <h2 className="text-xl font-bold mb-4">Active Adoption Requests ({adoptionRequests.length})</h2>
              <div className="space-y-4">
                {adoptionRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 gap-4 transition-all duration-300 hover:border-white/20"
                  >
                    <div className="flex items-center gap-4">
                      <img src={req.image} alt={req.petName} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h3 className="font-bold text-lg">{req.petName}</h3>
                        <p className="text-xs text-autumn-bg">{req.breed}</p>
                        <p className="text-[11px] text-white/50 mt-1">Submitted on {req.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                          req.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="text-xs text-autumn-bg hover:text-white underline cursor-pointer transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: ADOPTIONS */}
        {activeTab === 'adoptions' && (
          <div className="rounded-3xl bg-black/15 backdrop-blur-3xl border border-white/15 p-6 ring-1 ring-white/10">
            <h2 className="text-xl font-bold mb-6">Adoption History ({adoptionRequests.length})</h2>
            <div className="space-y-4">
              {adoptionRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img src={req.image} alt={req.petName} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <span className="text-[10px] text-white/50 font-mono">{req.id}</span>
                      <h3 className="font-bold text-lg">{req.petName}</h3>
                      <p className="text-xs text-autumn-bg">{req.breed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-xs text-white/60 block mb-1">Application Status</span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          req.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="text-xs text-autumn-bg hover:text-white underline cursor-pointer transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: ORDERS */}
        {activeTab === 'orders' && (
          <div className="rounded-3xl bg-black/15 backdrop-blur-3xl border border-white/15 p-6 ring-1 ring-white/10">
            <h2 className="text-xl font-bold mb-6">Recent Store Orders</h2>
            <div className="space-y-4">
              {mockUserData.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-autumn-primary">{order.id}</span>
                      <span className="text-xs text-white/50">• {order.date}</span>
                    </div>
                    <p className="text-sm font-medium mt-1">{order.items}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <span className="text-base font-bold">{order.total}</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: SAVED PETS */}
        {activeTab === 'saved' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Favorites ({mockUserData.savedPets.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {mockUserData.savedPets.map((pet) => (
                <div
                  key={pet.id}
                  className="rounded-3xl bg-black/15 backdrop-blur-3xl border border-white/15 p-3.5 ring-1 ring-white/20 text-white flex flex-col justify-between hover:border-white/30 transition-all duration-300"
                >
                  <div>
                    <div className="overflow-hidden rounded-2xl h-40 w-full mb-3">
                      <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-lg font-bold">{pet.name}</h3>
                    <p className="text-xs text-autumn-bg">{pet.breed}</p>
                  </div>
                  <button 
                    onClick={() => handleNewAdoption(pet)}
                    className="mt-4 w-full bg-autumn-primary hover:bg-autumn-muted text-white text-xs font-semibold py-2.5 rounded-xl transition-all duration-300 cursor-pointer active:scale-95"
                  >
                    Apply to Adopt
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Application Details Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6 transition-all animate-fadeIn"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full rounded-[2.5rem] bg-black/60 backdrop-blur-3xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 text-white ring-1 ring-white/20 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-autumn-primary/20 blur-3xl rounded-full pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono text-autumn-primary font-semibold">{selectedRequest.id}</span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">Application Details</h2>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-autumn-bg hover:text-white flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-300"
              >
                ✕
              </button>
            </div>

            {/* Pet Quick Specs */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
              <img
                src={selectedRequest.image}
                alt={selectedRequest.petName}
                className="w-20 h-20 rounded-xl object-cover border border-white/10"
              />
              <div>
                <h3 className="text-xl font-bold">{selectedRequest.petName}</h3>
                <p className="text-sm text-autumn-bg">{selectedRequest.breed}</p>
                <p className="text-xs text-white/50 mt-1">Shelter: {selectedRequest.shelter || 'Partner Sanctuary'}</p>
              </div>
            </div>

            {/* Application Progress Timeline */}
            <div className="mb-6">
              <h4 className="text-sm uppercase font-semibold text-autumn-bg tracking-wider mb-4">Application Progress</h4>
              <div className="space-y-3">
                {(selectedRequest.timeline || [
                  { title: 'Application Submitted', date: selectedRequest.date, completed: true },
                  { title: 'Background Check', date: 'In Progress', completed: selectedRequest.status === 'Approved' },
                  { title: 'Final Decision', date: selectedRequest.status, completed: selectedRequest.status === 'Approved' }
                ]).map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                        step.completed
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-white/5 text-white/40 border-white/20'
                      }`}
                    >
                      {step.completed ? '✓' : idx + 1}
                    </span>
                    <div className="flex-1 flex justify-between items-center text-sm">
                      <span className={step.completed ? 'text-white font-medium' : 'text-white/60'}>
                        {step.title}
                      </span>
                      <span className="text-xs text-white/40">{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Applicant Notes */}
            {selectedRequest.applicantNotes && (
              <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-xs font-semibold text-autumn-bg uppercase tracking-wider mb-1">Notes / Remarks</h4>
                <p className="text-sm text-white/80 leading-relaxed">{selectedRequest.applicantNotes}</p>
              </div>
            )}

            {/* Action Footer */}
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 rounded-xl border border-white/15 transition-all duration-300 cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;