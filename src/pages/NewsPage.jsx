import React, { useEffect, useState } from "react";
import NewsList from "../components/NewsList";
import Spinner from "../components/Spinner";
import { supabase } from "../supabase/supabaseClient";
import { Link } from "react-router-dom";

function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener noticias desde Supabase
  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from("news_article")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setNews(data);
      } catch (err) {
        console.error("Error fetching news:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Link
        to="/login"
        className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
      >
        Iniciar Sesión
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 p-4">Noticias</h1>

      {news.length > 0 ? (
        <NewsList news={news} />
      ) : (
        <p className="text-center text-gray-500">No hay noticias disponibles.</p>
      )}
    </div>
  );
}

export default NewsPage;
