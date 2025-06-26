// src/components/Sidebar.jsx
import { Home, Truck, Package, Users } from 'lucide-react';   // icônes
import { NavLink } from 'react-router-dom';       
import logoNavbar from '../assets/logo-navbar.jpg';        // liens actifs (optionnel)

export default function Sidebar() {
  const linkClasses =
    "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition";

  const activeClasses = "text-amber-700 font-semibold";        // couleur marron doré (#a97b1c env.)

  return (
    <aside className="w-72 h-screen bg-white shadow-md flex flex-col">
      {/* --------- Logo --------- */}
      <div className="h-[100px] flex items-center justify-center border-b">
        <img
          src= {logoNavbar}
          alt="AccurSoftwares"
          className="w-40 object-contain"
        />
      </div>

      {/* --------- Menu --------- */}
      <nav className="flex flex-col gap-2 mt-6 px-4 text-lg">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : "text-gray-700"}`
          }
        >
          <Home size={22} />
          Accueil
        </NavLink>

        <NavLink
          to="/fournisseurs"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : "text-gray-700"}`
          }
        >
          <Truck size={22} />
          Fournisseur
        </NavLink>

        <NavLink
          to="/stock"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : "text-gray-700"}`
          }
        >
          <Package size={22} />
          Stock
        </NavLink>

        <NavLink
          to="/commandes"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : "text-gray-700"}`
          }
        >
          <Users size={22} />
          Commande Client
        </NavLink>
      </nav>
    </aside>
  );
}
