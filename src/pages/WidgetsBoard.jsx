import { useState, useEffect } from 'react';
import WidgetCard from '../components/WidgetCard';
import { Truck, Users, Clock, List, ChevronDown } from 'lucide-react';
import { supabase } from '../supabase/supabase.jsx';

const kpiOptions = [
  { key: 'nb_commandes', title: 'Nombre total de commandes', icon: <Users /> },
  { key: 'taux_retards', title: 'Taux de retard', icon: <Clock /> },
  { key: 'otif', title: 'Livraison à temps (OTIF)', icon: <Truck /> },
  { key: 'taux_annulation', title: 'Taux d’annulation', icon: <List /> },
  { key: 'duree_cycle_moyenne_jours', title: 'Durée moyenne du cycle', icon: <Clock /> },
  { key: 'avg_changelog_par_commande', title: 'Changelogs / commande', icon: <List /> },
  { key: 'cout_par_jour_traitement', title: 'Coût par jour de traitement', icon: <Truck /> },
];


export default function WidgetsBoard() {
  const [kpiData, setKpiData] = useState({});
  const [selectedKpis, setSelectedKpis] = useState([
    'nb_commandes',
    'taux_retards',
    'otif',
    'taux_annulation',
    'duree_cycle_moyenne_jours',
    'avg_changelog_par_commande',
     'cout_par_jour_traitement'
  ]);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.rpc('get_kpi_commandes');
      if (!error && data && data.length > 0) {
        setKpiData(data[0]);console.log(data)
      } else {
        console.error('Erreur lors du chargement des KPI', error);
      }
    };
    fetchData();
  }, []);

  const handleChangeKpi = (index, newKey) => {
    const newSelections = [...selectedKpis];
    newSelections[index] = newKey;
    setSelectedKpis(newSelections);
    setOpenDropdown(null); 
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex gap-6 flex-wrap">
        {selectedKpis.map((key, idx) => {
          const kpi = kpiOptions.find(k => k.key === key);
          const value =
            key === 'nb_commandes'
              ? kpiData.nb_commandes
              : key === 'taux_retards'
              ? `${kpiData.taux_retards}%`
              : key === 'otif'
              ? `${kpiData.otif}%`
              : 'key' === 'taux_annulation'
              ? `${kpiData.taux_annulation}%`
              : key === 'duree_cycle_moyenne_jours'
              ? `${kpiData.duree_cycle_moyenne_jours} jours`
              : key === 'avg_changelog_par_commande'
              ? `${kpiData.avg_changelog_par_commande} changelogs`
              : key === 'cout_par_jour_traitement'
              ? `${kpiData.cout_par_jour_traitement} €`
              : 'N/A';


          return (
            <div key={idx} className="relative">
              <WidgetCard title={kpi.title} value={value} icon={kpi.icon} />

            
              <button
                onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                <ChevronDown size={18} />
              </button>

              {/* Menu déroulant personnalisé */}
              {openDropdown === idx && (
                <div className="absolute top-10 right-0 bg-white shadow-lg rounded border z-20 w-56">
                  {kpiOptions.map(option => (
                    <div
                      key={option.key}
                      onClick={() => handleChangeKpi(idx, option.key)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {option.icon}
                      <span>{option.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="max-w-xl mx-auto bg-blue-100 border border-blue-300 text-blue-800 text-sm text-center py-3 px-4 rounded shadow-sm">
  Cliquez sur le bouton <strong>« + »</strong> pour afficher les graphiques (à venir).
</div>

    </section>
  );
}
