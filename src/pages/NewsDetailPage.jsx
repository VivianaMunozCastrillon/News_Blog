import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import Spinner from "../components/Spinner";
import TriviaModal from "../components/TriviaModal";
import Navbar from "../components/Navbar";

function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from("news_article")
          .select("*")
          .eq("id", id)
          .single();

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
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{news.title}</h1>

        <img
          src={news.image}
          alt={news.title}
          className="w-full h-64 object-cover mb-4 rounded-lg"
        />

        <p className="text-gray-700 mb-6 text-justify leading-relaxed tracking-normal">
          {news.content}
        </p>

        <div className="text-sm text-gray-500 mb-6">
          <span>{new Date(news.created_at).toLocaleDateString()}</span> | 👁 {news.view ?? 0}
        </div>

        <button
          onClick={() => setIsTriviaOpen(true)}
          className="px-6 py-3 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-800 transition-transform transform hover:scale-105 duration-300"
        >
          Jugar Trivia
        </button>

        {isTriviaOpen && (
          <TriviaModal newsId={news.id} onClose={() => setIsTriviaOpen(false)} />
        )}
      </div>
    </div>
  );
}

export default NewsDetailPage;
