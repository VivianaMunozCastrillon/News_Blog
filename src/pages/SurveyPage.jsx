import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";


function SurveyPage() {
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Obtener el id del usuario desde la tabla `user`
  useEffect(() => {
    const getUser = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error(authError.message);
        setMessage("Error al obtener sesión.");
        return;
      }

      const email = authData?.user?.email;
      if (!email) {
        setMessage("No se encontró email del usuario logueado.");
        return;
      }

      // Buscar al usuario en la tabla `user`
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (userError) {
        console.error(userError.message);
        setMessage("Error al vincular usuario.");
        return;
      }

      setUserId(userData.id); //uuid válido de la tabla user
    };

    getUser();
  }, []);

  //  Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("category").select("*");
      if (error) {
        console.error(error.message);
        setMessage("Error al cargar categorías.");
      } else {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Guardar selección en `user_recommended_category`
  const handleSave = async () => {
    if (!userId) {
      setMessage("No se encontró usuario logueado.");
      return;
    }

    const rows = selectedCategories.map((categoryId) => ({
      user_id: userId,
      category_id: categoryId,
    }));

    const { error } = await supabase
      .from("user_recommended_category")
      .insert(rows);

    if (error) {
      console.error("Error guardando:", error.message);
      setMessage("Hubo un error al guardar tus preferencias.");
    } else {
      setMessage("Preferencias guardadas con éxito.");
      setTimeout(() => {
      navigate("/"); 
    }, 1000);
  }
};

  if (loading) return <p className="text-center mt-8">Cargando categorías...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4a0d36] via-[#a0236f] to-[#d63384]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Elige tus intereses
        </h1>

        <div className="flex flex-col gap-2 mb-6">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
              />
              <span className="text-gray-700">{cat.name}</span>
            </label>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-full transition"
        >
          Guardar preferencias
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}

export default SurveyPage;
