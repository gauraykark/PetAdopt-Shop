import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UserDashboard = ({ externalRequests, onAddAdoptionRequest }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [adoptionRequests, setAdoptionRequests] = useState(externalRequests || []);
  const [applicationsLoading, setApplicationsLoading] = useState(
    !externalRequests && Boolean(user?.id)
  );
  const [applicationsError, setApplicationsError] = useState('');

  useEffect(() => {
    if (externalRequests) return;
    if (!user?.id) {
      setApplicationsLoading(false);
      return;
    }

    fetch(`${API_URL}/api/applications`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || 'Failed to load applications');
        return data;
      })
      .then((applications) => {
        setAdoptionRequests(applications.map((application) => ({
          id: application.id,
          petName: application.pets?.name || 'Pet',
          breed: application.pets?.breed || 'Unknown breed',
          image: application.pets?.image_url || '',
          status: application.status,
          date: application.created_at
            ? new Date(application.created_at).toLocaleDateString('en-US')
            : 'Unknown date',
          applicantNotes: application.applicant_notes,
        })));
      })
      .catch((error) => setApplicationsError(error.message))
      .finally(() => setApplicationsLoading(false));
  }, [externalRequests, user?.id]);

  // Selected request state for the View Details modal
  const [selectedRequest, setSelectedRequest] = useState(null);

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
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 border-2 border-autumn-primary ring-4 ring-white/10 flex items-center justify-center text-3xl font-bold text-white">
                {(user?.name || 'U').slice(0, 1).toUpperCase()}
              </div>
              <span className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-black" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-1">
                {user?.name || 'User Profile'}
              </h1>
              <p className="text-autumn-bg text-sm sm:text-base">{user?.email || 'No email available'}</p>
              <p className="text-xs text-white/50 mt-2">Your account</p>
            </div>
          </div>

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
                <p className="text-3xl font-bold mt-2">{adoptionRequests.filter((req) => req.status === 'Approved').length}</p>
              </div>
              <div className="rounded-2xl bg-black/15 backdrop-blur-3xl border border-white/15 p-5 ring-1 ring-white/10">
                <span className="text-xs uppercase font-semibold text-autumn-bg tracking-wider">Saved Pets</span>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="rounded-2xl bg-black/15 backdrop-blur-3xl border border-white/15 p-5 ring-1 ring-white/10">
                <span className="text-xs uppercase font-semibold text-autumn-bg tracking-wider">Total Shop Orders</span>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
            </div>

            {/* Adoption Applications Section */}
            <div className="rounded-3xl bg-black/15 backdrop-blur-3xl border border-white/15 p-6 ring-1 ring-white/10">
              <h2 className="text-xl font-bold mb-4">Active Adoption Requests ({adoptionRequests.length})</h2>
              {applicationsLoading && <p className="py-6 text-autumn-bg">Loading your applications...</p>}
              {applicationsError && <p className="py-6 text-red-300">{applicationsError}</p>}
              {!applicationsLoading && !applicationsError && adoptionRequests.length === 0 && (
                <p className="py-6 text-autumn-bg">You have not submitted any adoption applications yet.</p>
              )}
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
            <p className="py-6 text-autumn-bg">No store orders yet.</p>
          </div>
        )}

        {/* Tab Content: SAVED PETS */}
        {activeTab === 'saved' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Saved Pets (0)</h2>
            <p className="py-6 text-autumn-bg">You have no saved pets yet.</p>
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