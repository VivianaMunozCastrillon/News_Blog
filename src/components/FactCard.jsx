import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function FactCard() {
  const [facts, setFacts] = useState([]); // lista de datos curiosos
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const { data, error } = await supabase
          .from("fun_fact")
          .select("*")
          .eq("is_active", true);

        if (error) {
          setError("Error al traer datos curiosos");
          console.error(error);
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          setError("No hay datos curiosos disponibles");
          setLoading(false);
          return;
        }

        setFacts(data);
      } catch (err) {
        console.error(err);
        setError("Ocurrió un error inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchFacts();
  }, []);

  // Rotar automáticamente cada 10 segundos
  useEffect(() => {
    if (facts.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % facts.length);
      }, 10000); // 👈 ahora cambia cada 10s
      return () => clearInterval(interval);
    }
  }, [facts]);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <p>Cargando dato curioso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow-md mb-6">
      <h2 className="font-bold mb-2">¿Sabías que?</h2>

      {/* Animación de fade entre datos */}
      <AnimatePresence mode="wait">
        <motion.p
          key={facts[currentIndex].id} // 👈 clave única para que haga fade al cambiar
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3, ease: "easeInOut" }} // 👈 fade lento (3s)
        >
          {facts[currentIndex].content}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
