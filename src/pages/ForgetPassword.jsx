// src/pages/Login.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();



  return (
    <div className="flex h-screen overflow-hidden">
    
      <aside className="w-1/2 bg-[#341B49] text-white flex flex-col items-center justify-center p-12">
        <img src={logo} alt="Logo" className="w-80 h-80 mb-10" />
        <h1 className="font-serif text-4xl leading-tight text-center">
          Control Tower<br />Supply Chain
        </h1>
      </aside>

      
      <main className="w-1/2 flex items-center justify-center">
        <form className="w-96">
          <h2 className="text-center text-2xl font-bold text-neutral-800 mb-12">
            Mot de Passe Oublié
          </h2>
          <div className='my-2'>
          <label className="block text-xs text-neutral-500 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="exemple@email.com"
            required
            className="w-full border-b border-stone-300 text-base text-neutral-700 py-2 focus:outline-none focus:border-indigo-600"
          />
          </div>

         
         
          <button
            type="submit"
            className="w-full my-2 py-3 bg-[#341B49] text-white text-xs font-bold shadow-[0_34px_40px_-8px_rgba(123,118,241,0.24)] hover:bg-[#47275f] transition-colors"
          >
            Envoyer
          </button>

           <p className="my-2 text-center text-xs text-neutral-700 mb-8">
            Se connecter?{' '}
            <Link to="/login" className="font-bold underline text-neutral-800">
              Cliquez ici
            </Link>
          </p>

          {error && (
            <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
          )}
        </form>
      </main>
    </div>
  );
}
