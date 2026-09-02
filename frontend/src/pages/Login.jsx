import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || 'http://localhost:5000') : '';

const Login = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';

    const body = isSignUp
      ? { name: formData.name, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Save token and user info for later use
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Fade out transition then navigate
      setIsFadingOut(true);
      setTimeout(() => {
        navigate('/browse', { replace: true });
      }, 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Page Transition Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-[#08130f] transition-opacity duration-500 ease-in-out pointer-events-none ${
          isFadingOut ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Slide Panel */}
      <div
        className={`modal-surface fixed top-0 right-0 z-50 h-screen w-full sm:w-[450px]
        border-l border-white/15
        p-8 flex flex-col justify-center text-white
        transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-autumn-bg hover:text-white text-2xl font-bold cursor-pointer transition-colors"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-2 tracking-tight">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-autumn-bg mb-6 text-sm">
          {isSignUp
            ? 'Join Paws & Hearts to get started.'
            : 'Log in to access your account.'}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleAuth}>
          {isSignUp && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-autumn-bg block mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="field-control w-full px-4 py-3 placeholder-autumn-bg/50"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-autumn-bg block mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-autumn-bg/50 focus:outline-none focus:border-autumn-primary focus:ring-1 focus:ring-autumn-primary transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-autumn-bg block mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-autumn-bg/50 focus:outline-none focus:border-autumn-primary focus:ring-1 focus:ring-autumn-primary transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
              className="primary-action w-full font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 ease-in-out mt-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-autumn-bg">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-white underline font-semibold hover:text-autumn-bg cursor-pointer ml-1"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
