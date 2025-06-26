import { useState } from 'react';
import { supabase } from '../supabase/supabase.jsx';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate('/dashboard');
  };
  return (
    <form onSubmit={handleLogin}>
      <h2>Connexion</h2>
      <input type="email" onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
      {error && <p>{error}</p>}
    </form>
  );
}