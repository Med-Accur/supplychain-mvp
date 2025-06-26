import { supabase } from '../supabase/supabase.jsx';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import WidgetsBoard from './WidgetsBoard.jsx'; 

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Barre latérale */}
      <Sidebar />

      {/* Partie principale */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
   
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Déconnexion
          </button>
        </div>

        {/* Composant des widgets */}
        <WidgetsBoard />
      </main>
    </div>
  );
}








