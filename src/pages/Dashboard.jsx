import { supabase } from '../supabase/supabase.jsx';
import { useNavigate } from 'react-router-dom';
export default function Dashboard() {
  const navigate = useNavigate();
  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  return (
    <div>
      <h2>Bienvenue sur le Dashboard :salut_main:</h2>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}






