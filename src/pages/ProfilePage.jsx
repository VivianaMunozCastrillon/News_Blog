import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { UserAuth } from "../context/AuthContext";
import { Camera, Lock } from "lucide-react";
import Spinner from "../components/Spinner"; 

const allBadges = [
  { name: "Explorador", icon: "🧭", color: "from-blue-400 to-blue-600" },
  { name: "Lector Constante", icon: "📖", color: "from-pink-400 to-pink-600" },
  { name: "Lector Experto", icon: "📚", color: "from-yellow-400 to-yellow-600" },
  { name: "Maestro Lector", icon: "🏆", color: "from-orange-400 to-orange-600" },
  { name: "Sabio de las Noticias", icon: "🦉", color: "from-green-400 to-green-600" },
];

export default function MiPerfil() {
  const { user } = UserAuth();
  const [profile, setProfile] = useState({
    nombre: "",
    apellido: "",
    email: "",
    image: "",
    created_at: "",
  });
  const [userBadges, setUserBadges] = useState([]);
  const [uploading, setUploading] = useState(false); 

  // Categorías
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [savingCategories, setSavingCategories] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
      fetchBadges(user.id);
      fetchCategories();
      fetchUserCategories(user.id);
    }
  }, [user]);

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("nombre, apellido, email, image, created_at")
      .eq("id", userId)
      .single();
    if (!error && data) setProfile(data);
  }

  async function fetchBadges(userId) {
    const { data, error } = await supabase
      .from("user_badges")
      .select("badge_name")
      .eq("user_id", userId);
    if (!error && data) setUserBadges(data.map((b) => b.badge_name));
  }

  async function fetchCategories() {
    const { data, error } = await supabase.from("category").select("*");
    if (!error && data) setCategories(data);
  }

  async function fetchUserCategories(userId) {
    const { data, error } = await supabase
      .from("user_recommended_category")
      .select("category_id")
      .eq("user_id", userId);
    if (!error && data) setSelectedCategories(data.map((row) => row.category_id));
  }

  async function handleSave() {
    const { error } = await supabase
      .from("users")
      .update({
        nombre: profile.nombre,
        apellido: profile.apellido,
        image: profile.image,
      })
      .eq("id", user.id);

    if (error) alert("Error al actualizar perfil: " + error.message);
    else alert("Perfil actualizado");
  }

  async function handleImageUpload(e) {
    try {
      const file = e.target.files[0];
      if (!file) return;
      if (!user) throw new Error("Usuario no autenticado.");

      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from("users")
        .update({ image: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, image: `${publicUrl}?t=${Date.now()}` });
    } catch (error) {
      alert("Error al subir la imagen: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  async function handleSaveCategories() {
    if (!user) return;
    setSavingCategories(true);
    try {
      await supabase.from("user_recommended_category").delete().eq("user_id", user.id);
      const rows = selectedCategories.map((id) => ({ user_id: user.id, category_id: id }));
      const { error } = await supabase.from("user_recommended_category").insert(rows);
      if (error) throw error;
      alert("Categorías actualizadas correctamente");
    } catch (err) {
      alert("Error al actualizar categorías: " + err.message);
    } finally {
      setSavingCategories(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "Fecha desconocida";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-gray-200 rounded-3xl shadow-lg p-8 space-y-10">
        {/* Cabecera */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <img
              src={profile.image || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover border-4 border-white bg-gray-400 shadow-md"
            />
            <label className="absolute bottom-0 right-0 bg-pink-600 p-2 rounded-full text-white cursor-pointer hover:bg-pink-700 transition opacity-0 group-hover:opacity-100 flex items-center justify-center">
              {uploading ? <Spinner size="w-6 h-6" color="border-white" /> : <Camera size={18} />}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">{profile.nombre || "Usuario"} {profile.apellido}</h2>
          <p className="text-gray-500">@{user?.email?.split("@")[0]}</p>
          <p className="text-sm text-gray-400">Se unió el {formatDate(profile.created_at)}</p>
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={profile.nombre}
            onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={profile.apellido}
            onChange={(e) => setProfile({ ...profile, apellido: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
          <input
            type="email"
            value={profile.email}
            disabled
            className="border border-gray-200 rounded-lg p-2 bg-gray-100 col-span-2"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg shadow transition"
        >
          Guardar cambios
        </button>

        {/* Insignias */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Insignias</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {allBadges.map((badge) => {
              const unlocked = userBadges.includes(badge.name);
              return (
                <div
                  key={badge.name}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl shadow-md transition-all transform hover:scale-105 ${
                    unlocked
                      ? `bg-gradient-to-br ${badge.color} text-white`
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <span className="text-4xl mb-2">{badge.icon}</span>
                  <p className="text-sm font-medium text-center">{badge.name}</p>
                  {!unlocked && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-2xl">
                      <Lock className="text-white" size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Categorías */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Categorías de interés</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-white hover:bg-gray-100 cursor-pointer shadow-sm"
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
            onClick={handleSaveCategories}
            disabled={savingCategories}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg shadow transition"
          >
            {savingCategories ? "Guardando..." : "Guardar categorías"}
          </button>
        </div>
      </div>
    </div>
  );
}
