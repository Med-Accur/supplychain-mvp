// src/components/UserProfileMenu.jsx
import { useState } from "react";

export default function UserProfileMenu({ userName = "Utilisateur", onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Avatar anonyme cliquable */}
      <div
        className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center cursor-pointer text-white font-bold text-lg"
        onClick={() => setOpen(!open)}
      >
        {userName.charAt(0).toUpperCase()}
      </div>

      {/* Menu déroulant */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 font-semibold border-b">{userName}</div>
          <ul className="py-2 text-sm">
            <li className="px-4 py-1 hover:bg-gray-100 cursor-pointer">About us</li>
            <li className="px-4 py-1 hover:bg-gray-100 cursor-pointer">Text</li>
          
            <li>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-red-600 font-semibold hover:bg-gray-100"
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
