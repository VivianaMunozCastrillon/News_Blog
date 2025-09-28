import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import TriviaModal from "../components/TriviaModal";
import { supabase } from "../supabase/supabaseClient";
import { UserAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = UserAuth();
  const [latestNews, setLatestNews] = useState(null);
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);

  useEffect(() => {
    const fetchRandomTriviaNews = async () => {
      // 1. Fetch all trivias to get available news_ids
      const { data: trivias, error: triviasError } = await supabase
        .from('trivia')
        .select('news_id')
        .not('news_id', 'is', null);

      if (triviasError || !trivias || trivias.length === 0) {
        console.error('Error fetching trivias or no trivias available:', triviasError);
        return;
      }

      // 2. Pick a random trivia's news_id
      const randomTrivia = trivias[Math.floor(Math.random() * trivias.length)];
      const { news_id: newsId } = randomTrivia;

      // 3. Fetch the corresponding news article
      const { data: newsData, error: newsError } = await supabase
        .from('news_article')
        .select('*')
        .eq('id', newsId)
        .single();

      if (newsError) {
        console.error('Error fetching news article:', newsError);
      } else {
        setLatestNews(newsData);
      }
    };

    fetchRandomTriviaNews();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div style={{ position: 'fixed', top: 0, left: 0, backgroundColor: 'white', padding: '10px', zIndex: 9999, border: '1px solid black' }}>
          <h3 style={{ fontWeight: 'bold' }}>Debugging Info:</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Bienvenido a Notiplay</h1>
          <p className="text-lg text-gray-600 mb-8">Tu fuente de noticias y trivias interactivas.</p>
        </div>

        {latestNews && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Trivia del Día</h2>
            <p className="text-gray-600 mb-4">¿Crees que sabes todo sobre la última noticia? ¡Ponte a prueba!</p>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Noticia: "{latestNews.title}"</h3>
            <button 
              onClick={() => setIsTriviaOpen(true)}
              className="px-8 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-transform transform hover:scale-105 duration-300"
            >
              Jugar Trivia
            </button>
          </div>
        )}
      </main>

      {isTriviaOpen && latestNews && (
        <TriviaModal newsId={latestNews.id} onClose={() => setIsTriviaOpen(false)} />
      )}
    </div>
  );
};

export default HomePage;


