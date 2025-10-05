import { supabase } from "../supabase/supabaseClient";

// Registro
export async function registerUser(name, lastname, email, password) {
  const { data, error } = await supabase
    .rpc("sp_user_register", { 
      p_name: name, 
      p_lastname: lastname, 
      p_email: email, 
      p_password: password 
    });

  if (error) throw error;
  return data;
}

// Autenticación
export async function authenticateUser(email, password) {
  const { data, error } = await supabase
    .rpc("sp_user_authenticate", {
      p_email: email,
      p_password: password
    });

  if (error) throw error;
  return data;
}