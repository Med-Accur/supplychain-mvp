// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import MainLayout from '../components/MainLayout';

import CardWidget from '../components/widgets/CardWidget';
import TableWidget from '../components/widgets/TableWidget';
import MapWidget from '../components/widgets/MapWidget';
import { X } from 'lucide-react';
import { supabase } from '../supabase/supabase';

const ResponsiveGridLayout = WidthProvider(Responsive);
const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
const widgetSizes = {
  card: { w: 3, h: 6 },
  table: { w: 6, h: 8 },
  map: { w: 6, h: 10 },
};
const widgetLimits = {
  card: { minW: 3, minH: 6},
  table: { minW: 6, minH: 8},
  map: { minW: 6, minH: 10},
};


const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [availableWidgets, setAvailableWidgets] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState({});
  const [counter, setCounter] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
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

  useEffect(() => {
    const fetchAvailableWidgets = async () => {
      const { data, error } = await supabase.from('available_widgets').select('*');
      if (!error) setAvailableWidgets(data);
    };
    fetchAvailableWidgets();
  }, []);

  const isAlreadyAdded = (key) => widgets.some((w) => w.key === key);
 
  const handleCheckboxChange = (key) => {
    setSelectedTypes((prev) => ({ ...prev, [key]: !prev[key] }));
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

  const addSelectedWidgets = () => {
  const newWidgets = Object.entries(selectedTypes)
    .filter(([key, checked]) => checked && !isAlreadyAdded(key))
    .map(([key],i) => {
      const info = availableWidgets.find((w) => w.key === key);
      const size = widgetSizes[info.type] 
      const limits = widgetLimits[info.type] 

      return {
        i: `w-${counter + key}`,
        key,
        type: info.type,
        x: 0,
        y: Infinity,
        w: size.w,
        h: size.h,
        ...limits,
      };
    });

  setWidgets((prev) => [...prev, ...newWidgets]);
  setCounter((prev) => prev + newWidgets.length);
  setSelectedTypes({});
  setShowSidebar(false);
};

const handleLayoutChange = (currentLayout) => {
  // Met à jour les positions et dimensions dans le state widgets
  setWidgets((prevWidgets) =>
    prevWidgets.map((w) => {
      const updated = currentLayout.find((l) => l.i === w.i);
      return updated ? { ...w, ...updated } : w;
    })
  );
};

  const removeWidget = (id) => setWidgets((prev) => prev.filter((w) => w.i !== id));

  const renderWidget = (type, key) => {
    
    switch (type) {
      case 'card':
        return <CardWidget widgetKey={key} />;
      case 'table':
        return <TableWidget widgetKey={key} />;
      case 'map':
        return <MapWidget widgetKey={key} />;
      default:
        return <div>Type inconnu</div>;
    }
  };

  return (
    <MainLayout>
      <div className="flex">
        {showSidebar && (
          <div className="w-64 bg-white shadow-md p-4 fixed right-0 top-0 h-full z-50">
            <h2 className="text-lg font-bold mb-4">Choisir les widgets</h2>
            {['card', 'table', 'map'].map((type) => (
              <div key={type} className="mb-5">
                <h3 className="text-sm font-semibold mb-2 capitalize">{type}</h3>
                {availableWidgets
                  .filter((w) => w.type === type)
                  .map((w) => (
                    <label key={w.key} className="flex items-center text-sm mb-2">
                      <input
                        type="checkbox"
                        checked={selectedTypes[w.key] || false}
                        onChange={() => handleCheckboxChange(w.key)}
                        disabled={isAlreadyAdded(w.key)}
                        className="mr-2"
                      />
                      {w.key}
                    </label>
                  ))}
              </div>
            ))}
            

            <button
              onClick={addSelectedWidgets}
              className="mt-4 bg-green-500 text-white px-3 py-1 rounded"
            >
              Ajouter
            </button>
          </div>
        )}

        <div className="w-full p-6">
          <div className="flex justify-between mb-4">
            <h1 className="text-xl font-bold">Mon Dashboard</h1>
           <button
                onClick={saveDashboard}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
              Sauvegarder
              </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="bg-indigo-500 text-white px-3 py-1 rounded"
            >
              Ajouter widgets
            </button>
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
                className="rounded-2xl border border-[#D6D6D6] bg-[#F9FAFB] p-5 gap-4 shadow-sm md:p-6 cursor-move handle"
              >
                {renderWidget(w.type, w.key)}
                <button
                  onClick={() => removeWidget(w.i)}
                  className="absolute top-1 right-1 text-gray-400 hover:text-[#A79882] transition"
                >
                  <X className="w-5 h-5 transform transition-transform" />
                </button>
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
