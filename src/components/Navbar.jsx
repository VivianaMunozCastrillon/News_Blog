import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { useCategory } from '../context/CategoryContext';
import { supabase } from '../supabase/supabaseClient'; 
import SearchBar from './SearchBar';
import Logo from '../assets/Logo_Notiplay.png';

const Navbar = () => {
  const { user, signout } = UserAuth();
  const { setSelectedCategory } = useCategory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null); 
  const navigate = useNavigate();

  const userName = user?.user_metadata?.name || 'Usuario';
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;

  const categories = [
    { name: "Tecnología" },
    { name: "Ciencia" },
    { name: "Deportes" },
    { name: "Entretenimiento" },
  ];

  // Traer la imagen desde tabla "users" o Google
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user?.id) return;

      // 1. Intentar traer imagen de la tabla "users"
      const { data, error } = await supabase
        .from("users")
        .select("image")
        .eq("id", user.id)
        .single();

      const imageFromDB = !error && data?.image ? data.image : null;

      // 2. Intentar traer imagen de Google si no hay en la DB
      const googleAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

      // 3. Prioridad: DB > Google > Avatar por defecto
      setAvatarUrl(imageFromDB || googleAvatar || defaultAvatar);
    };

    fetchAvatar();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signout();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryClick = (name) => {
    setSelectedCategory(name);
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleGoHome = () => {
    setSelectedCategory(null);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-black to-brand-pink shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <button onClick={handleGoHome}>
              <img src={Logo} alt="Notiplay Logo" className="h-12" />
            </button>
          </div>

          {/* Menú escritorio */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={handleGoHome} className="text-gray-200 hover:text-white transition-colors duration-300">
              Inicio
            </button>
            <div className="relative group">
              <button className="text-gray-200 hover:text-white transition-colors duration-300">
                Categorías
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => navigate("/recompensas")} className="text-gray-200 hover:text-white transition-colors duration-300">
              Recompensas
            </button>
            <SearchBar />
          </div>

          {/* Perfil / Login escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2">
                  <img
                    src={avatarUrl}
                    alt="Avatar de usuario"
                    className="h-12 w-12 rounded-full border-2 border-white bg-gray-400 object-cover"
                  />
                  <span className="text-gray-100 font-medium">{userName}</span>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <button onClick={() => { setIsProfileMenuOpen(false); navigate("/profile"); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mi Perfil
                    </button>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate("/login")} className="text-white hover:underline transition-colors duration-300">
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-200 hover:text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 px-6 sm:px-8 lg:px-12 pt-2 pb-4 space-y-2">
          <button onClick={handleGoHome} className="block text-gray-200 hover:text-white w-full text-left">
            Inicio
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="block text-gray-200 hover:text-white w-full text-left"
            >
              {cat.name}
            </button>
          ))}
          <button onClick={() => navigate("/recompensas")} className="block text-gray-200 hover:text-white w-full text-left">
            Recompensas
          </button>
          <SearchBar />
          <div className="pt-4 border-t border-gray-700">
            {user ? (
              <div className="space-y-2">
                <button onClick={() => navigate("/profile")} className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800">
                  Mi Perfil
                </button>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button onClick={() => navigate("/login")} className="text-white hover:underline text-center w-full">
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
