import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import Spinner from "../components/Spinner";

function NewsDetailPage() {
  const { id } = useParams(); // Captura el ID desde la URL
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from("news_article")
          .select("*")
          .eq("id", id)
          .single(); // Obtener solo una noticia

        if (error) throw error;
        setNews(data);
      } catch (err) {
        console.error("Error fetching news:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [id]);

  if (loading) return <Spinner />;

  if (!news) return <p className="text-center text-gray-500">Noticia no encontrada</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
      <img src={news.image} alt={news.title} className="w-full h-64 object-cover mb-4 rounded-lg" />
      <p className="text-gray-700 mb-6 text-justify leading-relaxed tracking-normal">
      {news.content}
      </p>
      <div className="text-sm text-gray-500">
        <span>{new Date(news.created_at).toLocaleDateString()}</span> | 👁 {news.view ?? 0}
      </div>
    </div>
  );
}

export default NewsDetailPage;
