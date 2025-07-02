// src/pages/CommandeClient.jsx
import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import WidgetsBoard from './WidgetsBoard';
import AddChartModal from '../components/AddChartModal';
import ChartRenderer from '../components/ChartRenderer';
import { supabase } from '../supabase/supabase';
import { Plus } from 'lucide-react';

export default function CommandeClient() {
  /* ------------------------------- states ------------------------------- */
  const [showModal, setShowModal] = useState(false);
  const [charts, setCharts]       = useState([]);      // [{ kpi, type, data }]
  const [rawKpi, setRawKpi]       = useState(null);    // data[0] de get_kpi_commandes

  /* ------------------------ charge les KPI bruts ------------------------ */
  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc('get_kpi_commandes');
      if (data?.length) setRawKpi(data[0]);
    })();
  }, []);

  /* ------------------ charge les graphiques sauvegardés ----------------- */
  useEffect(() => {
    const fetchSavedCharts = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      const { data } = await supabase
        .from('user_charts')
        .select('*')
        .eq('user_id', userId);

      if (data) {
        const loaded = data.map((e) => ({
          kpi:  e.kpi,
          type: e.type,
          data: [], // rempli plus tard quand rawKpi disponible
        }));
        setCharts(loaded);
      }
    };
    fetchSavedCharts();
  }, []);

  /* --------------- fabrique une série factice sur 7 jours --------------- */
  const makeSeries = (kpiKey) => {
    if (!rawKpi) return [];
    const base = rawKpi[kpiKey] ?? 0;
    return Array.from({ length: 7 }).map((_, i) => ({
      date: `Jour ${i + 1}`,
      [kpiKey]: Math.round(base * (0.8 + Math.random() * 0.4)),
    }));
  };

  /* ------------------- ajoute un nouveau graphique ---------------------- */
  const handleConfirm = ({ kpi, type }) => {
    const newChart = { kpi, type, data: makeSeries(kpi) };
    setCharts((prev) => [...prev, newChart]);
    setShowModal(false);
  };

  /* --------------------- sauvegarde dans Supabase ----------------------- */
  const handleSaveCharts = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;

    // 1) purge les anciens
    await supabase.from('user_charts').delete().eq('user_id', userId);

    // 2) insère les nouveaux (kpi & type suffisent)
    const inserts = charts.map((c) => ({
      user_id: userId,
      kpi: c.kpi,
      type: c.type,
    }));
    const { error } = await supabase.from('user_charts').insert(inserts);
    alert(error ? 'Erreur de sauvegarde ❌' : 'Graphiques sauvegardés ✅');
  };

  /* ---------------------------------------------------------------------- */
  return (
    <MainLayout>
      {/* Widgets KPI */}
      <WidgetsBoard />

      {/* Bouton Ajouter un graphique */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} /> Ajouter un graphique
        </button>
      </div>

      {/* Liste des graphiques */}
      {charts.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {charts.map((c, idx) => (
              <div key={idx} className="relative bg-white p-4 rounded shadow">
                {/* bouton delete */}
                <button
                  onClick={() =>
                    setCharts((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition"
                  title="Supprimer ce graphique"
                >
                  ✖
                </button>

                <h4 className="font-semibold mb-4">
                  {c.kpi} — {c.type}
                </h4>

                <ChartRenderer
                  data={c.data.length ? c.data : makeSeries(c.kpi)}
                  type={c.type}
                  dataKey="date"
                  valueKey={c.kpi}
                />
              </div>
            ))}
          </div>

          {/* bouton sauvegarde */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveCharts}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              💾 Sauvegarder mes graphiques
            </button>
          </div>
        </>
      )}

      {/* Modale d’ajout */}
      {showModal && (
        <AddChartModal
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </MainLayout>
  );
}
