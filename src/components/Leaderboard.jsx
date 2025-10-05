import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function Leaderboard({ users = [] }) {
  if (!users.length) {
    return <p className="text-center text-gray-500">Cargando ranking...</p>;
  }

  const podio = users.filter((u) => u.type === "podio");
  const lista = users.filter((u) => u.type === "lista");

  // Ordenamos el podio para que quede 2 - 1 - 3
  const podioOrdenado = [
    podio.find((u) => u.rank === 2),
    podio.find((u) => u.rank === 1),
    podio.find((u) => u.rank === 3),
  ].filter(Boolean);

  return (
    <div className="p-4 w-full max-w-sm mx-auto">
      <h2 className="text-center text-lg font-bold mb-1">
        ¡Sube en el ranking!
      </h2>

      {/* Contenedor para separar calendario y podio */}
      <div className="space-y-10">
        <p className="flex items-center justify-center text-xs text-gray-600 gap-1">
          <Calendar className="w-4 h-4 text-[#C0307F]" />
          Se reinicia si no eres activo
        </p>

        {/* Podio */}
        <div className="flex justify-center items-end gap-2 mb-6">
          {podioOrdenado.map((user) => (
            <motion.div
              key={user.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: user.rank * 0.15 }}
              className="flex flex-col items-center"
            >
              <div
                className={`bg-[#F1AFD3] rounded-xl shadow p-2 flex flex-col justify-start relative
                  ${user.rank === 1 ? "w-28 h-44" : ""}
                  ${user.rank === 2 ? "w-24 h-40" : ""}
                  ${user.rank === 3 ? "w-24 h-36" : ""}
                `}
              >
                <div
                  className={`flex justify-center ${
                    user.rank === 1 ? "-mt-10" : "-mt-8"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={
                        user.image ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt={user.full_name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://www.w3schools.com/howto/img_avatar.png";
                      }}
                      className={`rounded-full border-3 border-[#C0307F] object-cover bg-gray-400 
                        ${user.rank === 1 ? "w-16 h-16" : "w-14 h-14"}
                      `}
                    />
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-[#C0307F] text-white font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs">
                      {user.rank}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-center ${
                    user.rank === 1 ? "mt-6" : "mt-4"
                  }`}
                >
                  <p className="text-sm font-bold">{user.full_name}</p>
                  <p className="font-bold text-[#C0307F] text-sm mt-1">
                    {user.total_points}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="max-h-48 overflow-y-auto space-y-2">
        {lista.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center bg-[#F1AFD3] rounded-full px-3 py-1 shadow-sm"
          >
            <div className="flex items-center space-x-2">
              <span className="bg-[#C0307F] text-white font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs">
                {user.rank}
              </span>
              <span className="text-sm font-semibold">{user.full_name}</span>
            </div>
            <span className="bg-[#C0307F] text-white font-semibold px-2 py-0.5 rounded-full text-xs">
              {user.total_points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
