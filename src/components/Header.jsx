import { useState, useEffect, useRef } from "react";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";

export default function Header({ collapsed, setCollapsed, onLogout, userName, email }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le menu si on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 ${
        collapsed ? "left-25" : "left-70"
      } right-0 h-18 bg-white shadow-md flex items-center justify-end px-10 z-50 transition-all duration-300`}
    >
      {/* Toggle Sidebar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute left-1 top-9 -translate-y-1/2 flex items-center justify-center w-12 h-12 text-gray-400 bg-[#f0eee9] rounded-xl hover:text-[#A79882] transition-all duration-300"
      >
        {collapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
      </button>


      {/* Notification Icon */}
      <button
        aria-label="Notifications"
        className="relative p-2 rounded-full hover:bg-[#bfa76f] hover:text-[#3c352f] transition text-[#a99c70]"
      >
        <Bell className="h-6 w-6" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {/* Avatar */}
      <div className="relative ml-4" ref={dropdownRef}>
        <img
          src="https://placehold.co/40x40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-[#bfa76f] cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm font-medium text-[#3c352f]">{userName}</p>
              <p className="text-xs text-[#a99c70]">{email}</p>
            </div>
            <ul className="py-1">
              <li>
                <button className="w-full text-left px-4 py-2 text-sm text-[#3c352f] hover:bg-[#f8f6f0]">
                  Modifier Profil
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 text-sm text-[#3c352f] hover:bg-[#f8f6f0]">
                  À propos
                </button>
              </li>
              <li>
                <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Déconnexion
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
