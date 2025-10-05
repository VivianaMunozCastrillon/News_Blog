import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../supabase/supabaseClient.js";

// 1. Creamos el contexto
const AuthContext = createContext();

// 2. Creamos el componente "Proveedor" que envolverá nuestra aplicación
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- useEffect ÚNICO Y CORRECTO PARA MANEJAR LA SESIÓN ---
  // Este bloque se ejecuta solo una vez cuando la aplicación carga.
  // Su trabajo es determinar si ya hay un usuario logueado y escuchar futuros cambios.
  useEffect(() => {
    setLoading(true);
    
    // Obtenemos la sesión inicial.
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // SOLUCIÓN CLAVE: Guardamos el objeto de usuario COMPLETO (session.user),
      // que contiene el 'id', 'email', 'user_metadata', etc.
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Creamos un "oyente" que se activa cada vez que el estado de autenticación cambia (login, logout, etc.).
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // De nuevo, guardamos el objeto de usuario COMPLETO o null.
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Limpiamos el "oyente" cuando el componente se desmonta para evitar fugas de memoria.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // --- FUNCIONES DE AUTENTICACIÓN ---

  async function signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google" });
      if (error) throw new Error("Ocurrió un error durante la autenticación");
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function registerWithEmail(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error al registrarse:", error.message);
      throw error;
    }
  }

  async function loginWithEmail(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      throw error;
    }
  }

  async function signout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error("Ocurrió un error durante el cierre de sesión");
    setUser(null); // Limpiamos el usuario del estado local
  }

  async function resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // Asegúrate que esta ruta exista en tu app
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error al enviar email de recuperación:", error.message);
      throw error;
    }
  }

  async function updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error al actualizar contraseña:", error.message);
      throw error;
    }
  }

  // Usamos useMemo para optimizar el valor del contexto,
  // asegurando que no se recree innecesariamente en cada renderizado.
  const value = useMemo(() => ({
    user,
    signInWithGoogle,
    registerWithEmail,
    loginWithEmail,
    signout,
    resetPassword,
    updatePassword
  }), [user]);

  // El proveedor pasa el objeto `value` a todos los componentes hijos.
  // La condición `!loading` previene que se muestre la aplicación
  // antes de saber si el usuario está logueado o no.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Creamos un Hook personalizado para consumir el contexto fácilmente
// Esto evita tener que importar `useContext` y `AuthContext` en cada componente.
export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Esta verificación asegura que no intentemos usar el contexto fuera del proveedor.
    throw new Error('UserAuth debe ser usado dentro de un AuthContextProvider');
  }
  return context;
};