import React from "react";
import { useNavigate } from "react-router-dom";

function NewsCard({ id, title, description, image, created_at, view, is_trending }) {
  const navigate = useNavigate();

  const handleClick = () => {
  navigate(`/news/${id}`);
};

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Imagen */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col gap-2">
        {/* Badge si es tendencia */}
        {is_trending && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full w-fit">
            Tendencia
          </span>
        )}

        {/* Título */}
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {title}
        </h2>

        {/* descripción */}
       
      <p className="text-gray-700 mb-4 text-justify leading-relaxed">
      {description}
    </p>


        {/* Footer con fecha y vistas */}
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>{new Date(created_at).toLocaleDateString()}</span>
          <span> {view ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;
