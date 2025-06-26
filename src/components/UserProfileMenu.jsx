import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function UserProfileMenu({ onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <img
        src="/path/to/photo.jpg" // remplace par ton image réelle
        className="w-12 h-12 rounded-full cursor-pointer"
        onClick={() => setOpen(!open)}
        alt="Profil"
      />
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-3 z-50">
          <div className="text-sm font-semibold">Chleyah Taha</div>
          <ul className="mt-2 space-y-2 text-sm">
            <li>About us</li>
            <li>Text</li>
            <li>Text</li>
            <li>Text</li>
            <li>
              <button
                className="text-red-600 font-bold mt-2"
                onClick={onLogout}
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
