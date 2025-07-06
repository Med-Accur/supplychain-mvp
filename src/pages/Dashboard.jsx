import React, { useEffect, useState } from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import MainLayout from '../components/MainLayout';

import CardWidget from '../components/widgets/CardWidget';
import ChartWidget from '../components/widgets/ChartWidget';
import TableWidget from '../components/widgets/TableWidget';
import MapWidget from '../components/widgets/MapWidget';
import { X } from 'lucide-react';
import { supabase } from '../supabase/supabase';
const ResponsiveGridLayout = WidthProvider(Responsive);
const widgetTypes = {
  card: { label: 'KPI', component: <CardWidget />, w: 3, h: 6},
  chart: { label: 'Graphique', component: <ChartWidget />, w: 6, h: 4 },
  table: { label: 'Tableau', component: <TableWidget />, w: 10, h: 7 },
  map: { label: 'Carte', component: <MapWidget />, w: 6, h: 4 },
};
const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [counter, setCounter] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error(error);
      else setUserId(data.user.id);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadWidgets = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('dashboard_widgets')
        .select('layout')
        .eq('user_id', userId)
        .single();

      if (!error && data?.layout) {
        setWidgets(data.layout);
        setCounter(data.layout.length);
      }
      setLoading(false);
    };

    loadWidgets();
  }, [userId]);

  const handleCheckboxChange = (type) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const addSelectedWidgets = () => {
    const newWidgets = Object.entries(selectedTypes)
      .filter(([_, checked]) => checked)
      .map(([type], index) => ({
        i: (counter + index).toString(),
        type,
        x: (index * 3) % 12,
        y: Infinity,
        w: widgetTypes[type].w,
        h: widgetTypes[type].h,
      }));

    setWidgets((prev) => [...prev, ...newWidgets]);
    setCounter((prev) => prev + newWidgets.length);
    setShowSidebar(false);
  };

  const removeWidget = (id) => {
    setWidgets((prev) => prev.filter((w) => w.i !== id));
  };

  const handleLayoutChange = (layout) => {
    const updated = layout.map((item) => {
      const original = widgets.find((w) => w.i === item.i);
      return { ...item, type: original?.type || 'card' };
    });
    setWidgets(updated);
  };

  const saveDashboard = async () => {
    if (!userId) return;
    const { error } = await supabase
      .from('dashboard_widgets')
      .upsert({ user_id: userId, layout: widgets }, { onConflict: 'user_id' });

    if (error) {
      console.error('Erreur sauvegarde:', error);
    } else {
      alert('Dashboard sauvegardé avec succès !');
    }
  };

  const renderWidget = (type) =>
    widgetTypes[type]?.component || <div>Type inconnu</div>;


  return (
    <MainLayout>
      <div className="flex relative">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-64 bg-white shadow-md p-4 fixed right-0 top-18 h-full z-50">
            <h2 className="text-lg font-bold mb-4">Choisir les widgets</h2>
            <form className="flex flex-col space-y-3">
              {Object.entries(widgetTypes).map(([key, val]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTypes[key] || false}
                    onChange={() => handleCheckboxChange(key)}
                    className="mr-2"
                  />
                  {val.label}
                </label>
              ))}
              <button
                type="button"
                onClick={addSelectedWidgets}
                className="mt-4 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Ajouter
              </button>
            </form>
          </div>
        )}

        {/* Main Content */}
        <div className="w-full p-6 mx-auto">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-xl font-bold">Mon Dashboard</h1>
            <div className="space-x-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
              >
              Ajouter widgets
              </button>
              <button
                onClick={saveDashboard}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
              Sauvegarder
              </button>
            </div>
          </div>

         <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: widgets }}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={30}
          width={1000}
          onLayoutChange={handleLayoutChange}
          isDraggable
          isResizable
          compactType="vertical"
          measureBeforeMount={false}
          useCSSTransforms={true}
        >
            {widgets.map((w) => (
              <div
                key={w.i}
                className="rounded-2xl border border-[#D6D6D6] bg-[#F9FAFB] p-5 shadow-sm md:p-6 cursor-move"
              >
                <button
                  onClick={() => removeWidget(w.i)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute top-4 right-4 text-gray-400 hover:text-[#A79882] transition"
                  title="Supprimer"
                >
                  <X className='w-5 h-5 transform transition-transform'/>
                </button>
                {renderWidget(w.type)}
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
