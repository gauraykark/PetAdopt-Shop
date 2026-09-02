import React from 'react';

// Placeholder admin dashboard — connect to /api/adoptions for real data
const AdminDashboard = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-[#08130f] to-[#0f241a] px-6 py-12 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-autumn-bg">Manage pets, adoption requests, and users.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
