import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // --- LOGIN CON GOOGLE ---
  async function signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw new Error("Ocurrió un error durante la autenticación");
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // --- REGISTRO FLEXIBLE CON EMAIL/PASSWORD Y METADATA ---
  async function registerWithEmail(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }, // Aquí enviamos toda la metadata
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error al registrarse:", error.message);
      throw error;
    }
  }

  // --- LOGIN CON EMAIL Y CONTRASEÑA ---
  async function loginWithEmail(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      throw error;
    }
  }

  // --- CERRAR SESIÓN ---
  async function signout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error("Ocurrió un error durante el cierre de sesión");
    setUser(null);
  }

  // --- DETECTAR CAMBIOS DE SESIÓN ---
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user.user_metadata);
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user.user_metadata);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      registerWithEmail,
      loginWithEmail,
      signout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
