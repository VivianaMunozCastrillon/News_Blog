import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

export default function FactCard() {
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFact = async () => {
      try {
        const { data, error } = await supabase
          .from("fun_fact")
          .select("*")
          .eq("is_active", true); // Traer solo los datos activos

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

        // Elegir un dato curioso aleatorio
        const randomFact = data[Math.floor(Math.random() * data.length)];
        setFact(randomFact);
      } catch (err) {
        console.error(err);
        setError("Ocurrió un error inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchFact();
  }, []);

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
      <p>{fact.content}</p>
    </div>
  );
}
