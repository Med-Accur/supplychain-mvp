import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabase';

const TableWidget = ({ widgetKey }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchWidgetConfig = async () => {
      const { data, error } = await supabase
        .from('available_widgets')
        .select('*')
        .eq('key', widgetKey)
        .single();

      if (error) {
        console.error('Erreur widget:', error);
        return;
      }

      setWidgetConfig(data);
    };

    fetchWidgetConfig();
  }, [widgetKey]);

  useEffect(() => {
    if (!widgetConfig) return;

    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_table_commande');

      if (error) {
        console.error('Erreur RPC:', error);
        setLoading(false);
        return;
      }

      // Trie les données par date et limite à 100 (par exemple)
      const sorted = data.sort(
        (a, b) => new Date(b.date_prevue) - new Date(a.date_prevue)
      );

      setData(sorted);
      if (widgetConfig.columns && Array.isArray(widgetConfig.columns)) {
        setColumns(widgetConfig.columns);
      } else if (sorted.length > 0) {
        setColumns(Object.keys(sorted[0]).map((key) => ({ key, label: key })));
      }

      setLoading(false);
    };

    fetchData();
  }, [widgetConfig]);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!data.length) return <p>Aucune donnée à afficher.</p>;

  return (
    <div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm text-gray-70">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-3 py-2 text-left capitalize">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {paginatedData.map((row, idx) => (
              <tr key={idx} className='hover:bg-gray-50'>
                {columns.map((col) => (
                  <td key={col} className="px-3 py-2">
                    {row[col] !== null ? String(row[col]) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-3 text-sm">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default TableWidget;
