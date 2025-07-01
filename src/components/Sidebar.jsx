import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Truck, Package, Users, BarChart, ChevronsLeft, ChevronsRight } from 'lucide-react';
import logo from '../assets/logo-navbar.jpg';

export default function Sidebar() {
  const [width, setWidth] = useState(220);
  const sidebarRef = useRef(null);
  const isResizing = useRef(false);

  const MIN_WIDTH = 80;
  const MAX_WIDTH = 400;
  const THRESHOLD = 150;

  const startResize = () => {
    isResizing.current = true;
  };

  const stopResize = () => {
    isResizing.current = false;
  };

  const handleResize = (e) => {
    if (!isResizing.current) return;
    const newWidth = e.clientX;
    if (newWidth > MIN_WIDTH && newWidth < MAX_WIDTH) {
      setWidth(newWidth);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
    };
  }, []);

  const toggleSidebar = () => {
    setWidth(width > MIN_WIDTH + 10 ? MIN_WIDTH : 220);
  };

  const menu = [
    { label: 'Accueil', icon: <Home />, path: '/dashboard' },
    { label: 'Fournisseur', icon: <Truck />, path: '/fournisseur' },
    { label: 'Stock', icon: <Package />, path: '/stock' },
    { label: 'Commande Client', icon: <Users />, path: '/commande-client' },
    { label: 'Reporting', icon: <BarChart />, path: '/reporting' },
  ];

  return (
    <div
      ref={sidebarRef}
      className="h-screen bg-white shadow-md relative z-10 transition-all duration-300"
      style={{ width: `${width}px` }}
    >
      {/* Logo et bouton de toggle */}
      <div className="flex items-center justify-between px-4 py-3">
        {width > THRESHOLD && (
          <img src={logo} alt="AccurConsulting Logo" className="h-10 w-auto" />
        )}
        <button onClick={toggleSidebar} className="text-gray-500 hover:text-black">
          {width > THRESHOLD ? <ChevronsLeft /> : <ChevronsRight />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col mt-4">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-all ${
                isActive ? 'bg-blue-100 font-semibold text-blue-600' : ''
              }`
            }
          >
            <span>{item.icon}</span>
            {width > THRESHOLD && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Barre de redimensionnement */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 right-0 w-2 h-full cursor-col-resize bg-transparent"
      ></div>
    </div>
  );
}
