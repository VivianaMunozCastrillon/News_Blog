import { useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";

export default function RewardCard({ reward, user, onRedeem }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const userPoints = Number(user?.points ?? 0);
  const requiredPoints = Number(reward?.points_required ?? 0);
  const userId = user?.id ?? null;

  const progress = Math.min((userPoints / requiredPoints) * 100, 100);

  async function handleRedeem() {
    if (!userId) {
      setMessage("Debes iniciar sesión para canjear recompensas.");
      return;
    }

    if (reward.redeemed) {
      setMessage("Ya has canjeado esta recompensa.");
      return;
    }

    if (userPoints < requiredPoints) {
      setMessage("No tienes suficientes puntos para esta recompensa.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.rpc("redeem_reward", {
        p_user_id: userId,
        p_reward_id: reward.id,
      });

      if (error) throw error;

      setMessage("🎉 ¡Recompensa canjeada con éxito!");
      reward.redeemed = true; // marcar como canjeada en memoria

      if (onRedeem) onRedeem();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  }

  const canRedeem = !loading && !reward.redeemed && userPoints >= requiredPoints;
  const isRedeemed = reward.redeemed;

  return (
    <div
      className={`shadow-md rounded-xl p-6 flex flex-col items-center text-center transition-all duration-500 ${
        isRedeemed
          ? "bg-gradient-to-r from-[#6f1652] via-pink-500 to-pink-400 text-white"
          : "bg-white"
      }`}
    >
      <img
        src={reward.image_url || "/gift.png"}
        alt={reward.name}
        className={`h-16 w-16 mb-3 transition-all duration-500 ${
          isRedeemed ? "opacity-50 saturate-0" : "opacity-100 saturate-100"
        }`}
      />

      <h3
        className={`font-semibold text-lg transition-colors duration-500 ${
          isRedeemed ? "text-white" : "text-gray-900"
        }`}
      >
        {reward.name}
      </h3>
      <p
        className={`text-sm transition-colors duration-500 ${
          isRedeemed ? "text-white/90" : "text-gray-500"
        }`}
      >
        {reward.description}
      </p>

      <p
        className={`mt-3 font-medium transition-colors duration-500 ${
          isRedeemed ? "text-white" : "text-blue-600"
        }`}
      >
        {isRedeemed
          ? "🎉 Recompensa obtenida"
          : `${userPoints} / ${requiredPoints} puntos`}
      </p>

      {!isRedeemed && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="h-2 rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <button
        onClick={handleRedeem}
        disabled={!canRedeem}
        className={`mt-4 px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-500 ${
          canRedeem
            ? "bg-blue-600 hover:bg-blue-700"
            : isRedeemed
            ? "bg-gradient-to-r from-[#493d45] via-grey-200 to-gray-400 cursor-not-allowed"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? "Canjeando..." : isRedeemed ? "Ya canjeada" : "Canjear"}
      </button>

      {message && <p className="mt-3 text-sm text-red-500">{message}</p>}
    </div>
  );
}
