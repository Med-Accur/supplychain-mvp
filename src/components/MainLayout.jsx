import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import UserProfileMenu from '../components/UserProfileMenu';
import { supabase } from '../supabase/supabase';
import { useNavigate } from 'react-router-dom';
import { formatUserName } from '../utils/formatUserName';

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('Utilisateur');

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        const name = formatUserName(user.email)
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-end mb-6">
          <UserProfileMenu userName={displayName} onLogout={logout} />
        </div>
        {children}
      </main>
    </div>
  );
}
