import {
  Home,
  Package,
  Users,
  DollarSign,
  Megaphone,
} from "lucide-react";
import logoSidebar from "../assets/logo-Sidebar.jpg";
import { NavLink, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Acceuil", icon: Home, path: "/dashboard" },
  { name: "Commande Client", icon: Package, path: "/commande-client" },
  { name: "Stock", icon: Users, path: "/stock" },
  { name: "Fournisseur", icon: DollarSign, path: "/fournisseur" },
  { name: "Reporting", icon: Megaphone, path: "/reporting" },
];

export default function Sidebar({ collapsed }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <div
        className={`transition-all duration-400 flex flex-col justify-between ${
          collapsed ? "w-25" : "w-70"
        } bg-white shadow-xl`}
      >
        <div>
          {/* Header - Logo + App Name */}
          <div
            className={`flex items-center py-5 ${
              collapsed ? "justify-center px-0" : "justify-between px-3"
            }`}
          >
            <div className="flex items-center gap-2">
              <img src={logoSidebar} alt="Logo" className="h-15 w-15" />
              {!collapsed && (
                <h1 className="text-sm font-bold text-[#3c352f]">
                  Controle Tower Supply Chain
                </h1>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex flex-col gap-3 mt-10 ${collapsed ? "items-center" : "px-4"}`}>
            {menuItems.map(({ name, icon: Icon, path }) => {
              const isActive = location.pathname === path;

              return (
                <NavLink
                  key={name}
                  to={path}
                  className={`flex items-center gap-4 py-5 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#bfa76f] text-white"
                        : "text-[#3c352f] hover:bg-[#f0ede5]"
                    }
                    ${collapsed ? "justify-center px-4" : "px-4"}`}
                >
                  <Icon className="h-6 w-6" />
                  {!collapsed && <span className="truncate">{name}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}