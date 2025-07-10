import { useState, useEffect } from "react";

const kpiOptions = [
  { key: 'nb_commandes', label: 'Nombre de commandes', types: ['combo'] },
  { key: 'taux_retards', label: 'Taux de retard', types: ['donut', 'stackedBar'] },
  { key: 'otif', label: 'OTIF', types: ['donut', 'stackedBar'] },
  { key: 'taux_annulation', label: 'Taux d’annulation', types: ['donut', 'stackedBar'] },
  { key: 'duree_cycle_moyenne_jours', label: 'Durée moyenne du cycle', types: ['line'] },
  { key: 'avg_changelog_par_commande', label: 'Changelogs / commande', types: ['line'] },
  { key: 'cout_par_jour_traitement', label: 'Coût par jour de traitement', types: ['line'] },
];

const chartLabels = {
  line: 'Ligne',
  bar: 'Barres',
  combo: 'Combo (Barres + Ligne)',
  donut: 'Donut',
  stackedBar: 'Stacked Bar',
};


export default function AddChartModal({ onClose, onConfirm }) {
  const [selectedKpi, setSelectedKpi] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [available, setAvailable] = useState([]);

  useEffect(() => {
    const k = kpiOptions.find((x) => x.key === selectedKpi);
    setAvailable(k ? k.types : []);
    setSelectedType("");
  }, [selectedKpi]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 space-y-4">
        <h2 className="text-lg font-semibold">Ajouter un graphique</h2>

        {/* KPI */}
        <select
          className="w-full border px-3 py-2 rounded"
          value={selectedKpi}
          onChange={(e) => setSelectedKpi(e.target.value)}
        >
          <option value="">-- KPI --</option>
          {kpiOptions.map((k) => (
            <option key={k.key} value={k.key}>
              {k.label}
            </option>
          ))}
        </select>

        {/* Type */}
        <select
          className="w-full border px-3 py-2 rounded"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          disabled={!selectedKpi}
        >
          <option value="">-- Type --</option>
          {available.map((t) => (
            <option key={t} value={t}>
              {chartLabels[t]}
            </option>
          ))}
        </select>

        {/* actions */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 bg-gray-200 rounded">
            Annuler
          </button>
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-40"
            disabled={!selectedKpi || !selectedType}
            onClick={() => onConfirm({ kpi: selectedKpi, type: selectedType })}
          >
            Générer
          </button>
        </div>
      </div>
    </div>
  );
}
