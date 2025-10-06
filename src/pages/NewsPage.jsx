import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import NewsList from "../components/NewsList";
import CtaBanner from "../components/CtaBanner";
import FactCard from "../components/FactCard";
import { useCategory } from "../context/CategoryContext";
import { useSearch } from "../context/SearchContext.jsx"; 
import LeaderboardPage from "../pages/LeaderboardPage"; 

function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedCategory } = useCategory();
  const { searchTerm } = useSearch(); 

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id || null;

        let newsData;

        if (userId) {
          const { data, error } = await supabase.rpc("get_personalized_news", {
            user_uuid: userId,
          });
          if (error) throw error;
          newsData = data || [];
        } else {
          const { data, error } = await supabase
            .from("news_article")
            .select(`*, category:category(name)`)
            .order("created_at", { ascending: false });
          if (error) throw error;
          newsData = data || [];
        }

        setNews(newsData);
      } catch (err) {
        console.error("Error fetching news:", err.message);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = news
    .filter((n) =>
      selectedCategory ? n.category?.name === selectedCategory : true
    )
    .filter((n) =>
      searchTerm
        ? n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.content?.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />

      {/* Grid adaptable: 1 columna en móviles, 2 en tablets, 4 en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">

        {/* Noticias */}
        <main className="md:col-span-1 lg:col-span-3">
          <div className="mb-6">
            <CtaBanner />
          </div>

          <div className="mb-6">
            <FactCard />
          </div>

          {/* Leaderboard en móviles justo después de banners */}
          <div className="mb-6 md:hidden">
            <LeaderboardPage />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 p-4">
            Noticias
            {selectedCategory ? ` - ${selectedCategory}` : ""}
            {searchTerm ? ` (buscando: "${searchTerm}")` : ""}
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : filteredNews.length > 0 ? (
            <NewsList news={filteredNews} />
          ) : (
            <p className="text-center text-gray-500">
              No hay noticias disponibles.
            </p>
          )}
        </main>

        {/* Leaderboard en tablets y desktop */}
        <aside className="hidden md:block lg:col-span-1">
          <LeaderboardPage />
        </aside>
      </div>
    </div>
  );
}

export default NewsPage;
