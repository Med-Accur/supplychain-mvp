import { useState, useEffect } from "react";
import { supabase }        from "../supabase/supabase";      // 🔑 chemin correct
import ChartRenderer       from "../components/ChartRenderer";

export default function ReportingCommandes() {
  /* ----------------- états des filtres ----------------- */
  const today        = new Date().toISOString().slice(0,10);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [startDate, setStartDate]   = useState(sixMonthsAgo.toISOString().slice(0,10));
  const [endDate,   setEndDate]     = useState(today);
  const [client,    setClient]      = useState("");      // id ou ""
  const [statut,    setStatut]      = useState([]);      // tableau d’énum
  const [tableData, setTableData]   = useState([]);
  const [series,    setSeries]      = useState([]);

  /* -------- liste de clients en BDD (menu déroulant) ---- */
  const [clientsList, setClientsList] = useState([]);
  useEffect(() => {
    supabase.from("tiers")
      .select("contact_id, raison_social")
      .then(({ data }) => setClientsList(data || []));
  }, []);

  /* --------------- charge la TABLE détaillée ------------- */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("get_reporting_commandes_table", {
        start_date      : startDate,
        end_date        : endDate,
        client_id       : client     ? Number(client) : null,
        transporteur_id : null,                         // filtre futur
        statut_filter   : statut.length ? statut : null
      });
      if (error) return console.error(error);
      setTableData(data);
    })();
  }, [startDate, endDate, client, statut]);

  /* --------------- charge la SÉRIE mensuelle ------------- */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("get_reporting_commandes_series", {
        start_date      : startDate,
        end_date        : endDate,
        client_id       : client ? Number(client) : null,
        transporteur_id : null
      });
      if (error) return console.error(error);
      setSeries(data);
    })();
  }, [startDate, endDate, client]);

  /* --------------------- rendu UI ------------------------ */
  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Analyse des commandes client</h3>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input  type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}
                className="border px-2 py-1 rounded" />
        <input  type="date" value={endDate}   onChange={e=>setEndDate(e.target.value)}
                className="border px-2 py-1 rounded" />

        <select value={client} onChange={e=>setClient(e.target.value)}
                className="border px-2 py-1 rounded">
          <option value="">Tous les clients</option>
          {clientsList.map(c =>
            <option key={c.contact_id} value={c.contact_id}>{c.raison_social}</option>
          )}
        </select>

        <select multiple size={3}
                onChange={e => setStatut([...e.target.selectedOptions].map(o=>o.value))}
                className="border px-2 py-1 rounded">
          <option value="en_attente">En attente</option>
          <option value="expédiée">Expédiée</option>
          <option value="livrée">Livrée</option>
        </select>
      </div>

      {/* Graphique mensuel : évolution du nombre de commandes */}
      <ChartRenderer
        data={series}
        type="bar"
        dataKey="period"
        valueKey="nb_commandes"
      />

      {/* Tableau détaillé */}
      <div className="mt-8">
        <h4 className="text-lg mb-2">Détails des commandes</h4>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Client</th>
              <th className="border p-2">Statut</th>
              <th className="border p-2">Transporteur</th>
              <th className="border p-2">Retard (j)</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-4">Aucune donnée à afficher</td></tr>
            ) : (
              tableData.map(row => (
                <tr key={row.id}>
                  <td className="border p-2">{row.id}</td>
                  <td className="border p-2">{row.date_commande}</td>
                  <td className="border p-2">{row.client}</td>
                  <td className="border p-2">{row.statut}</td>
                  <td className="border p-2">{row.transporteur}</td>
                  <td className="border p-2">{row.retard_jours}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
