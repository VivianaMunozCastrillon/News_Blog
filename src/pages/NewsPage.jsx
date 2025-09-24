import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import NewsList from "../components/NewsList";
import CtaBanner from "../components/CtaBanner";
import FactCard from "../components/FactCard";

function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from("news_article")
          .select(`*, category:category(name)`)
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

  const filteredNews = selectedCategory
    ? news.filter((n) => n.category?.name === selectedCategory)
    : news;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* CTA Banner */}
      <div className="mt-6">
        <CtaBanner />
      </div>

      {/* Fact Card */}
      <div className="mt-6">
        <FactCard />
      </div>

      {/* Título de noticias */}
      <h1 className="text-2xl font-bold text-gray-800 p-4">
        Noticias {selectedCategory ? `- ${selectedCategory}` : ""}
      </h1>

      {/* Contenido de noticias */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : filteredNews.length > 0 ? (
        <NewsList news={filteredNews} />
      ) : (
        <p className="text-center text-gray-500">No hay noticias disponibles.</p>
      )}
    </div>
  );
}


export default NewsPage;
