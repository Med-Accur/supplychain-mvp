import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import ReportingCommandes from './ReportingCommandes';


export default function Reporting() {
  const [selectedReport, setSelectedReport] = useState(""); // <-- vide au départ

  return (
    <MainLayout>
      <h2 className="text-2xl font-semibold mb-4">Module Reporting</h2>

      {/* Liste déroulante */}
      <select
        className="mb-6 px-4 py-2 border rounded"
        value={selectedReport}
        onChange={(e) => setSelectedReport(e.target.value)}
      >
        <option value="">📊 Choisir un module de reporting</option>
        <option value="commandes">📦 Reporting Commandes Client</option>
        <option value="stock">🏷️ Reporting Stock</option>
        <option value="transport">🚚 Reporting Transport</option>
      </select>

      {/* Modules dynamiques */}
      {selectedReport === "commandes" && <ReportingCommandes />}
      {selectedReport === "stock" && <ReportingStock />}
      {selectedReport === "transport" && <ReportingTransport />}
    </MainLayout>
  );
}
