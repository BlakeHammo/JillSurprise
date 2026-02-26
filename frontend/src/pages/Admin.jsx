import { useState, useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';

export default function Admin() {
  const [password, setPassword] = useState(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('od_admin_pw');
    if (saved) setPassword(saved);
  }, []);

  const handleLogin = (pw) => {
    localStorage.setItem('od_admin_pw', pw);
    setPassword(pw);
  };

  const handleLogout = () => {
    localStorage.removeItem('od_admin_pw');
    setPassword(null);
  };

  if (!password) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard password={password} onLogout={handleLogout} />;
}
