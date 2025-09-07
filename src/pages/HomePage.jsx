import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Bienvenido a la App de Noticias</h1>
      <Link
        to="/login"
        className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
      >
        Iniciar Sesión
      </Link>
    </div>
  );
};

export default HomePage;
