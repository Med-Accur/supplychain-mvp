import { useState, useEffect } from 'react';
import WidgetCard from '../components/WidgetCard';
import { Truck, Users, Clock, List, ChevronDown } from 'lucide-react';
import { supabase } from '../supabase/supabase.jsx';

const kpiOptions = [
  { key: 'nb_commandes', title: 'Nbr total de commandes', icon: <Users />, format: v => v },
  { key: 'taux_retards', title: 'Taux de retard', icon: <Clock />, format: v => `${v}%` },
  { key: 'otif', title: 'Livraison à temps (OTIF)', icon: <Truck />, format: v => `${v}%` },
  { key: 'taux_annulation', title: 'Taux d’annulation', icon: <List />, format: v => `${v}%` },
  { key: 'duree_cycle_moyenne_jours', title: 'Durée moyenne du cycle', icon: <Clock />, format: v => `${v} jours` },
  { key: 'avg_changelog_par_commande', title: 'Changelogs / commande', icon: <List />, format: v => `${v} changelogs` },
  { key: 'cout_par_jour_traitement', title: 'Coût par jour de traitement', icon: <Truck />, format: v => `${v} €` },
];

export default function WidgetsBoard() {
  const [kpiData, setKpiData] = useState({});
  const [selectedKpis, setSelectedKpis] = useState([
    'nb_commandes',
    'otif',
    'taux_retards',
    'duree_cycle_moyenne_jours',
  ]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc('get_kpi_commandes');
      if (data?.length) setKpiData(data[0]);
      else console.error('Erreur lors du chargement des KPI', error);
    })();
  }, []);

  const handleChangeKpi = (index, newKey) => {
    const newKpis = [...selectedKpis];
    newKpis[index] = newKey;
    setSelectedKpis(newKpis);
    setOpenDropdownIndex(null);
  };

  return (
    <div className="grid py-20 gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
      {selectedKpis.map((key, idx) => {
        const kpi = kpiOptions.find(k => k.key === key);
        const value = kpi?.format(kpiData[key]) || 'N/A';

        return (
          <div key={idx} className="relative group">
            <WidgetCard title={kpi.title} value={value} icon={kpi.icon} />
            
            <button
              onClick={() =>
                setOpenDropdownIndex(openDropdownIndex === idx ? null : idx)
              }
              className="absolute top-4 right-4 text-gray-400 hover:text-[#A79882] transition"
            >
              <ChevronDown className={`w-5 h-5 transform transition-transform ${openDropdownIndex === idx ? 'rotate-180' : ''}`} />
            </button>

            {openDropdownIndex === idx && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {kpiOptions.map(option => (
                  <div
                    key={option.key}
                    onClick={() => handleChangeKpi(idx, option.key)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-100 cursor-pointer text-sm text-gray-700 "
                  >
                    <div className="w-6 h-6 text-gray-500 ">
                      {option.icon}
                    </div>
                    <span>{option.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
