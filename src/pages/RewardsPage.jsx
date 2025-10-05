import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import RewardCard from "../components/RewardCard";

export default function RewardsPage({ user }) {
  const [rewards, setRewards] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRewards, setLoadingRewards] = useState(true);

  //Traer recompensas desde la BD + marcar canjeadas
  async function fetchRewards(userId) {
    setLoadingRewards(true);
    try {
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("reward")
        .select("*");
      if (rewardsError) throw rewardsError;

      let redeemedIds = [];
      if (userId) {
        const { data: redeemedData, error: redeemedError } = await supabase
          .from("reward_user")
          .select("reward_id")
          .eq("user_id", userId);

        if (redeemedError) throw redeemedError;
        redeemedIds = redeemedData.map((r) => r.reward_id);
      }

      // Mezclamos rewards con estado `redeemed`
      const rewardsWithStatus = rewardsData.map((r) => ({
        ...r,
        redeemed: redeemedIds.includes(r.id),
      }));

      setRewards(rewardsWithStatus);
    } catch (e) {
      console.error(" Error al traer recompensas:", e.message);
    } finally {
      setLoadingRewards(false);
    }
  }

  //Refrescar usuario (para actualizar puntos después de canjear)
  async function fetchUser() {
  try {
    // Intentamos obtener el usuario autenticado
    const { data: authData, error: authError } = await supabase.auth.getUser();

    //Si no hay sesión activa, Supabase lanza "Auth session missing!"
    if (authError && authError.message === "Auth session missing!") {
      console.log("No hay usuario autenticado (sin sesión)");
      setCurrentUser(null);
      setLoadingUser(false);
      setRewards([]); // limpia recompensas
      return;
    }

    if (authError) throw authError;

    const userId = authData?.user?.id;

    // Si de todas formas no hay userId, también lo tratamos como no logueado
    if (!userId) {
      console.log("Usuario no logueado");
      setCurrentUser(null);
      setLoadingUser(false);
      setRewards([]);
      return;
    }

    //Buscar en la tabla "users" solo si está logueado
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    console.log("Usuario cargado:", data);
    setCurrentUser(data);

    // Traer recompensas solo si hay usuario
    await fetchRewards(userId);
  } catch (e) {
    console.error("Error inesperado al traer el usuario:", e.message);
    setCurrentUser(null);
  } finally {
    setLoadingUser(false);
  }
}


 useEffect(() => {
    fetchUser();
  }, []);

  //Skeleton Loader
  // Si todavía está cargando, muestra el loader
  if (loadingUser) {
    return (
      <div className="p-6 min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#C0307F] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  //Si NO hay usuario logueado (ya terminó de cargar)
  if (!currentUser) {
    return (
      <div className="p-6 min-h-screen bg-gray-200 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Acceso restringido
        </h2>
        <p className="text-gray-600 max-w-md">
          Debes iniciar sesión o registrarte para ver y canjear recompensas.
        </p>
        <a
          href="/login"
          className="mt-6 bg-[#C0307F] text-white px-6 py-3 rounded-lg hover:bg-[#a5286a] transition-colors"
        >
          Iniciar sesión
        </a>
      </div>
    );
  }

  //Si hay usuario, mostramos las recompensas
  if (loadingRewards) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Recompensas disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center animate-pulse"
            >
              <div className="h-16 w-16 bg-gray-300 rounded-full mb-3"></div>
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-2 w-full bg-gray-200 rounded mb-4"></div>
              <div className="h-10 w-28 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-200">
      <h2 className="text-2xl font-bold mb-6">Recompensas</h2>

      {rewards.length === 0 ? (
        <p className="text-gray-500">No hay recompensas disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              user={currentUser}
              onRedeem={fetchUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}