import { supabase } from '../supabase/supabase';

export const callRPCWithFilters = async (rpcName, params = {}) => {
  const { data, error } = await supabase.rpc(rpcName, params);
  if (error) {
    console.error(`Erreur lors de l'appel à la fonction ${rpcName}:`, error);
    return [];
  }
  return data;
};
