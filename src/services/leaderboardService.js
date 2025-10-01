import { supabase } from "../supabase/supabaseClient";

export const fetchRankedUsers = async () => {
  const { data, error } = await supabase.rpc("get_users_ranking_v2");

  if (error) {
    console.error("Error al obtener ranking:", error);
    return [];
  }

  return data;
};