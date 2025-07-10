import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabase';


export default function CardWidget({ widgetKey }) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPI = async () => {
      const { data, error } = await supabase.rpc('get_kpi_commandes');
      if (error) {
        console.error('Erreur RPC :', error);
        setLoading(false);
        return;
      }

      const kpiObj = data?.[0];
      if (kpiObj && widgetKey in kpiObj) {
        setValue(kpiObj[widgetKey]);
      }

      setLoading(false);
    };

    fetchKPI();
  }, [widgetKey]);

  return (
  <>
  <div className="flex items-center justify-center w-12 h-12 bg-[#f0eee9] rounded-xl">
    <div className="text-[#A79882] size-6"></div>
  </div>
  <div className="flex items-end justify-between mt-5">
    <div>
      <span className="text-sm text-gray-500">{widgetKey}</span>
      <h4 className="mt-2 font-bold text-gray-800 text-title-sm">{value}</h4>
    </div>
  </div>
</>
  );
}
