
import { useState, useEffect } from 'react';
import MainLayout     from '../components/MainLayout';
import WidgetsBoard   from './WidgetsBoard';
import AddChartModal  from '../components/AddChartModal';
import ChartRenderer  from '../components/ChartRenderer';
import { supabase }   from '../supabase/supabase';
import { Plus }       from 'lucide-react';


const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#8884d8', '#82ca9d', '#A79882', '#d96e5d'
];

export default function CommandeClient() {
  const [showModal, setShowModal] = useState(false);
  const [charts, setCharts]       = useState([]);   // [{ kpi, type, data }]

  /* ─────────── Récupère la série (7 j) et met en forme ─────────── */
  const fetchSeries = async (kpi, chartType) => {
    /* 📊 Cas particulier : stackedBar par transporteur */
    if (chartType === 'stackedBar') {
      const { data, error } = await supabase.rpc(
        'get_kpi_stackedbar_par_transporteur',
        { kpi }
      );
      if (error) { console.error(error); return []; }

      /* Regroupe { jour, transporteur, valeur } → { date, DHL: x, UPS: y } */
      const grouped = {};
      data.forEach(({ jour, transporteur, valeur }) => {
        const d = jour;                          // YYYY-MM-DD
        if (!grouped[d]) grouped[d] = { date: d };
        grouped[d][transporteur] = Number(valeur);
      });
      return Object.values(grouped);
    }

    /* 🟢 Cas classique : line / bar / combo / donut / radial */
    const { data, error } = await supabase.rpc(
      'get_kpi_timeseries_lasts7days',
      { kpi }
    );
    if (error) { console.error(error); return []; }

    let series = data.map(d => ({
      date : d.jour,
      value: Number(d.valeur)
    }));

    /* Radial → ajoute name + couleur pour la légende */
    if (chartType === 'radial') {
      series = series.map((d, i) => ({
        name : d.date,
        value: d.value,
        fill : COLORS[i % COLORS.length]
      }));
    }

    return series;
  };

  /* ───────── Charge les graphiques sauvegardés de l’utilisateur ───────── */
  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('user_charts')
        .select('*')
        .eq('user_id', userId);

      if (!error && data) {
        const withSeries = await Promise.all(
          data.map(async row => ({
            kpi : row.kpi,
            type: row.type,
            data: await fetchSeries(row.kpi, row.type)
          }))
        );
        setCharts(withSeries);
      }
    })();
  }, []);

  /* ───────── Ajoute un graphique depuis la modale ───────── */
  const handleConfirm = async ({ kpi, type }) => {
    const serie = await fetchSeries(kpi, type);
    setCharts(prev => {
      const exists = prev.some(c => c.kpi === kpi && c.type === type);
      return exists ? prev : [...prev, { kpi, type, data: serie }];
    });
    setShowModal(false);
  };

  /* ───────── Sauvegarde (upsert) côté Supabase ───────── */
  const handleSaveCharts = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;

    const rows = charts.map(c => ({
      user_id: userId,
      kpi    : c.kpi,
      type   : c.type
    }));

    const { error } = await supabase
      .from('user_charts')
      .upsert(rows, { onConflict: 'user_id,kpi,type' });

    alert(error ? 'Erreur de sauvegarde' : 'Graphiques sauvegardés ');
  };

  /* ─────────────────────────── UI ─────────────────────────── */
  return (
    <MainLayout>
      <div className="w-full px-4">
        <WidgetsBoard />

        {/* Bouton + */}
        <div className="flex justify-end mt-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#bfa76f] text-white px-4 py-2 rounded hover:bg-[#a78e57]"
          >
            <Plus size={18} /> Graphique
          </button>
        </div>
      </div>

      {/* Zone graphiques */}
      {charts.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 px-4">
            {charts.map((c, idx) => (
              <div key={idx} className="relative bg-white p-4 rounded shadow">
                {/* bouton X */}
                <button
                  onClick={() =>
                    setCharts(prev => prev.filter((_, i) => i !== idx))
                  }
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                >
                  ✖
                </button>

                <h4 className="font-semibold mb-4">
                  {c.kpi} — {c.type}
                </h4>

                <ChartRenderer
                  data={c.data}
                  type={c.type}
                  dataKey={
                    c.type === 'radial'
                      ? 'name'
                      : 'date'
                  }
                  /* valueKey n’est pas utilisé par stackedBar,
                     sinon 'value' pour radial & autres */
                  valueKey={c.type === 'stackedBar' ? undefined : 'value'}
                />
              </div>
            ))}
          </div>

          {/* bouton sauvegarde */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveCharts}
              className="px-4 py-2 bg-[#bfa76f] text-white rounded hover:bg-[#a78e57]"
            >
               Sauvegarder 
            </button>
          </div>
        </>
      )}

      {/* Modale */}
      {showModal && (
        <AddChartModal
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </MainLayout>
  );
}
