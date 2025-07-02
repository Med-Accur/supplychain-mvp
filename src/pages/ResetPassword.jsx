// pages/ResetPassword.jsx
import { useState } from 'react';
import { supabase } from '../supabase/supabase.jsx';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUpdatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(`Erreur : ${error.message}`);
    } else {
      setMessage("Mot de passe mis à jour !");
      setTimeout(() => navigate('/login'), 2000); // redirige vers le login
    }
  };

  return (
    <div>
      <h2>Réinitialiser le mot de passe</h2>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleUpdatePassword}>Valider</button>
      <p>{message}</p>
    </div>
  );
}
