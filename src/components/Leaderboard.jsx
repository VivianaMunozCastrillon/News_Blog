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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-center text-2xl font-bold mb-2">
        ¡Completa lecturas y trivias para ascender en la lista!
      </h2>

      <p className="flex items-center justify-center text-gray-600 mb-12 gap-2">
        <Calendar className="w-5 h-5 text-[#C0307F]" />
        Se reinicia tu puntaje si no eres activo
      </p>

      {/* Podio */}
      <div className="flex justify-center items-end gap-4 mb-10">
        {podioOrdenado.map((user) => (
          <motion.div
            key={user.id}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: user.rank * 0.2 }}
            className="flex flex-col items-center"
          >
            <div
              className={`bg-[#F1AFD3] rounded-2xl shadow-md p-4 flex flex-col justify-start relative
                ${user.rank === 1 ? "w-44 h-64" : ""}
                ${user.rank === 2 ? "w-40 h-56" : ""}
                ${user.rank === 3 ? "w-40 h-52" : ""}
              `}
            >
              <div
                className={`flex justify-center 
                  ${user.rank === 1 ? "-mt-14" : "-mt-12"}
                `}
              >
                <div className="relative">
                  <img
                    src={user.image || "https://www.w3schools.com/howto/img_avatar.png"}
                    alt={user.full_name}
                    onError={(e) => {
                      e.currentTarget.onerror = null; // evita bucle infinito
                      e.currentTarget.src = "https://www.w3schools.com/howto/img_avatar.png";
                    }}
                    className={`rounded-full border-4 border-[#C0307F] object-cover
                      ${user.rank === 1 ? "w-24 h-24" : "w-20 h-20"}
                    `}
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#C0307F] text-white font-bold w-8 h-8 flex items-center justify-center rounded-full text-sm">
                    {user.rank}
                  </div>
                </div>
              </div>
              <div className={`text-center ${user.rank === 1 ? "mt-8" : "mt-6"}`}>
                <p className="font-bold">{user.full_name}</p>
                <p className="font-bold text-[#C0307F] mt-2">
                  {user.total_points}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lista */}
      <div className="max-h-64 overflow-y-auto space-y-3">
        {lista.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center bg-[#F1AFD3] rounded-full px-4 py-2 shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <span className="bg-[#C0307F] text-white font-bold w-8 h-8 flex items-center justify-center rounded-full">
                {user.rank}
              </span>
              <span className="font-semibold">{user.full_name}</span>
            </div>
            <span className="bg-[#C0307F] text-white font-semibold px-4 py-1 rounded-full">
              {user.total_points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
