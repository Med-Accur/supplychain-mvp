// src/pages/Reporting.jsx
import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { supabase } from '../supabase/supabase';

export default function Reporting() {
  const [selectedKpi, setSelectedKpi] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!selectedKpi) return;

    const { data, error } = await supabase.rpc('get_kpi_commandes_simple', {
      start_date: startDate || null,
      end_date: endDate || null,
    });

    if (error) {
      console.error('Erreur RPC :', error);
      return;
    }

    if (data && data.length > 0) {
      setResult(data[0][selectedKpi]);
    }
  };

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <span role="img">📊</span> Module Reporting
      </h2>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <select
          className="border px-4 py-2 rounded"
          value={selectedKpi}
          onChange={(e) => setSelectedKpi(e.target.value)}
        >
          <option value="">-- Sélectionner un KPI --</option>
          <option value="nb_commandes">Nombre total de commandes</option>
          <option value="taux_retards">Taux de retard</option>
          <option value="otif">Livraison à temps (OTIF)</option>
        </select>

        <input
          type="date"
          className="border px-4 py-2 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="border px-4 py-2 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Afficher
        </button>
      </div>

      {result !== null && (
        <div className="text-lg font-semibold bg-white p-4 rounded shadow w-fit">
          Résultat :{' '}
          <span className="text-blue-600">
            {typeof result === 'number' ? `${result}${selectedKpi !== 'nb_commandes' ? ' %' : ''}` : result}
          </span>
        </div>
      )}
    </MainLayout>
  );
}
