import React, { useEffect, useRef, useState } from 'react';
import Login from './Login';

const Home = () => {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.log('Autoplay error:', err));
    }
    // Small delay so the fade-in transition is visible
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-[#08130f] to-[#0f241a] text-white">

      {/* Background Video */}
      <video
        ref={videoRef}
        src="/dog.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark overlay — clicking it closes the login panel */}
      <div
        onClick={() => setShowLogin(false)}
        className={`absolute inset-0 bg-black/40 z-10 transition-opacity duration-500 ${
          showLogin ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Hero Content Card */}
      <div className="relative z-20 min-h-screen flex items-center px-4 md:px-6 py-12">
        <div
          className={`max-w-xl ml-8 md:ml-16 p-8 rounded-3xl
            bg-black/15 backdrop-blur-3xl border border-white/15
            shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/20
            text-white transition-all duration-1000 ease-out transform ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            Paws & Hearts
          </h1>

          <p className="text-autumn-bg text-lg md:text-xl mb-6 font-medium">
            Connecting loving homes with pets in need of a second chance.
          </p>

          <button
            onClick={() => setShowLogin(true)}
            className="bg-autumn-primary hover:bg-autumn-muted text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Sign Up Now
          </button>
        </div>
      </div>

      {/* Slide-over Login/Signup Panel */}
      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default Home;
