import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import UserProfileMenu from '../components/UserProfileMenu';
import { supabase } from '../supabase/supabase';
import { useNavigate } from 'react-router-dom';
import { formatUserName } from '../utils/formatUserName';
import Header from './Header';

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [collapsed, setCollapsed] = useState(() => {
    // Lire depuis le localStorage au montage
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored === "true";
  });

  // 🔁 Mise à jour du localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed.toString());
  }, [collapsed]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        const name = formatUserName(user.email); 
        setDisplayName(name);
        setEmail(user.email);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F1F3F2]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Header collapsed={collapsed} setCollapsed={setCollapsed} onLogout={logout} email={email} userName={displayName}/>
      <main className="flex-1 p-8">
        <div className="flex justify-end mb-6"></div>
        {children}
      </main>
    </div>
  );
}
