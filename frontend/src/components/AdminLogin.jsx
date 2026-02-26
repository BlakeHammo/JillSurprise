import { useState } from 'react';
import { api } from '../utils/api';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.auth(password);
      if (data.success) {
        onLogin(password);
      } else {
        setError('Incorrect password. Try again!');
      }
    } catch {
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #d4ecfa 0%, #f0f8ff 50%, #e8d5f5 100%)' }}
    >
      <div className="glass-card w-full max-w-sm px-8 py-10 text-center animate-fade-in-up">

        {/* Icon */}
        <div className="text-5xl mb-4 animate-float">🌸</div>

        {/* Title */}
        <h1 className="font-dancing text-4xl font-bold text-cinna-text mb-1">
          Admin Panel
        </h1>
        <p className="font-nunito text-cinna-text-soft text-sm mb-8">
          Enter the password to manage entries
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-2xl border border-cinna-sky/40 bg-white/80 font-nunito text-sm text-cinna-text placeholder-cinna-text-soft/60 focus:outline-none focus:ring-2 focus:ring-cinna-sky/50 focus:border-cinna-sky transition"
            required
          />

          {error && (
            <p className="font-nunito text-red-400 text-sm text-center bg-red-50 rounded-xl py-2 px-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-full bg-cinna-sky text-white font-nunito font-bold text-sm tracking-wide shadow-soft hover:bg-cinna-sky/90 hover:shadow-soft-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking…' : 'Sign In ✨'}
          </button>
        </form>

        <p className="font-nunito text-cinna-text-soft/50 text-xs mt-8">
          <a href="/" className="underline hover:text-cinna-text-soft transition">
            ← Back to the site
          </a>
        </p>
      </div>
    </div>
  );
}
