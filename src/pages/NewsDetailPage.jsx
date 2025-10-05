import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import Spinner from "../components/Spinner";
import TriviaModal from "../components/TriviaModal";
import Navbar from "../components/Navbar";
import { UserAuth } from "../context/AuthContext";
import Alert from "../components/Alert"; // Importar Alert

function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);
  const { user } = UserAuth();
  const [reactions, setReactions] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [notification, setNotification] = useState({ message: '', show: false, type: 'error' });
  
  // Función para mostrar notificaciones y ocultarlas después de un tiempo
  const showNotification = (message, type = 'error') => {
    setNotification({ message, show: true, type });
    setTimeout(() => {
      setNotification({ message: '', show: false, type: 'error' });
    }, 3000);
  };

  async function fetchReactions() {
    const { data, error } = await supabase
      .from('reactions')
      .select('reaction_type')
      .eq('news_article_id', id);

    if (error) {
      console.error('Error fetching reactions:', error);
    } else {
      const reactionCounts = data.reduce((acc, { reaction_type }) => {
        acc[reaction_type] = (acc[reaction_type] || 0) + 1;
        return acc;
      }, {});
      setReactions(reactionCounts);
    }
  }

  async function fetchComments() {
    const { data, error } = await supabase.rpc('get_comments_with_authors', { p_news_id: id });

    if (error) {
        console.error('Error fetching comments:', error);
    } else {
        setComments(data);
    }
  }

  useEffect(() => {
    // Función para llamar al RPC que incrementa la vista
    async function incrementViewCount() {
      if (!id) return; // No hacer nada si no hay ID
      const { error } = await supabase.rpc('increment_view_count', {
        article_id: id,
      });

      if (error) {
        console.error('Error incrementing view count:', error);
      }
    }

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
    incrementViewCount();
    fetchReactions();
    fetchComments();
  }, [id]);
  
  useEffect(() => {
  if (!user) return;

  const updateActivity = async () => {
    const { error } = await supabase.rpc("update_user_activity");
    if (error) {
      console.error("Error en update_user_activity:", error.message);
    } else {
      console.log("Actividad del usuario actualizada ✅");
    }
  };

  updateActivity();
}, [user]);


  async function handleReaction(reactionType) {
    if (!user) {
      showNotification("Debes iniciar sesión para reaccionar.");
      return;
    }

    setReactions(prev => ({...prev, [reactionType]: (prev[reactionType] || 0) + 1}));

    const { error } = await supabase
      .from('reactions')
      .insert({
        user_id: user.id,
        news_article_id: id,
        reaction_type: reactionType,
      });

    if (error) {
      console.error('Error adding reaction:', error);
      setReactions(prev => ({...prev, [reactionType]: prev[reactionType] - 1}));
      if (error.code !== '23505') {
        showNotification("Error al añadir la reacción.");
      }
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!user) {
        showNotification("Debes iniciar sesión para comentar.");
        return;
    }
    if (!newComment.trim()) {
        showNotification("El comentario no puede estar vacío.", "warning");
        return;
    }

    const tempId = Math.random();
    const optimisticComment = {
        id: tempId,
        content: newComment,
        created_at: new Date().toISOString(),
        author: user.user_metadata.name || 'You',
    };

    setComments(prevComments => [optimisticComment, ...prevComments]);
    setNewComment("");

    const { data: newCommentData, error: newCommentError } = await supabase
        .from('comment')
        .insert({ content: newComment, news_id: id })
        .select('id')
        .single();

    if (newCommentError) {
        console.error('Error adding comment:', newCommentError);
        setComments(prevComments => prevComments.filter(c => c.id !== tempId));
        showNotification("Error al publicar el comentario.");
        return;
    }

    const { error: commentUserError } = await supabase
        .from('comment_user')
        .insert({
            comment_id: newCommentData.id,
            user_id: user.id,
        });

    if (commentUserError) {
        console.error('Error linking comment to user:', commentUserError);
        setComments(prevComments => prevComments.filter(c => c.id !== tempId));
        showNotification("Error al publicar el comentario.");
    } else {
        fetchComments(); // Recargar comentarios para mostrar el nuevo con datos reales
    }
  }

  if (loading) return <Spinner />;
  if (!news) return <p className="text-center text-gray-500">Noticia no encontrada</p>;

  const reactionTypes = ['👍', '❤️', '😂', '😮', '😢'];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {notification.show && (
        <div className="fixed top-20 right-5 z-50">
          <Alert message={notification.message} type={notification.type} />
        </div>
      )}

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

        <div className="flex space-x-4 mt-4">
          {reactionTypes.map(type => (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-800"
            >
              <span>{type}</span>
              <span>{reactions[type] || 0}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Comentarios</h2>
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Escribe un comentario..."
              rows="3"
            ></textarea>
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Publicar
            </button>
          </form>
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
                <p className="font-bold">{comment.author}</p>
                <p>{comment.content}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(comment.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsTriviaOpen(true)}
          className="px-6 py-3 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-800 transition-transform transform hover:scale-105 duration-300 mt-6"
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