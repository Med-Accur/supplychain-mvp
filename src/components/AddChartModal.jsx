// src/components/AddChartModal.jsx
import { useState } from 'react';

const kpiOptions = [
  { key: 'nb_commandes', label: 'Nombre de commandes' },
  { key: 'taux_retards', label: 'Taux de retard' },
  { key: 'otif', label: 'OTIF' },
  { key: 'taux_annulation', label: 'Taux d’annulation' },
];

const chartTypes = [
  { key: 'line',  label: 'Ligne' },
  { key: 'bar',   label: 'Barres' },
  { key: 'donut', label: 'Donut' },
];

export default function AddChartModal({ onClose, onConfirm }) {
  const [selectedKpi, setSelectedKpi]   = useState('');
  const [selectedType, setSelectedType] = useState('');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 space-y-4">
        <h2 className="text-lg font-semibold">Ajouter un graphique</h2>

        <select
          value={selectedKpi}
          onChange={(e) => setSelectedKpi(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Sélectionner un KPI --</option>
          {kpiOptions.map(k => (
            <option key={k.key} value={k.key}>{k.label}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Type de graphique --</option>
          {chartTypes.map(t => (
            <option key={t.key} value={t.key}>{t.label}</option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
          <button
            disabled={!selectedKpi || !selectedType}
            onClick={() => onConfirm({ kpi: selectedKpi, type: selectedType })}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Générer
          </button>
        </div>
      </div>
    </div>
  );
}
