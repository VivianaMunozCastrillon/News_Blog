import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import Logo from '../assets/Logo_Notiplay.png';

const Navbar = ({ onCategorySelect }) => {
  const { user, signout } = UserAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const categories = [
    { name: "Tecnología", path: "/categories/tecnologia" },
    { name: "Ciencia", path: "/categories/ciencia" },
    { name: "Deportes", path: "/categories/deportes" },
    { name: "Entretenimiento", path: "/categories/entretenimiento" },
  ];

  const handleLogout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-black to-brand-pink shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"> 
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={Logo} alt="Notiplay Logo" className="h-12" />
            </Link>
          </div>

          {/* Menú escritorio */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-200 hover:text-white transition-colors duration-300">Inicio</Link>

            {/* Dropdown Categorías */}
            <div className="relative group">
              <button className="text-gray-200 hover:text-white transition-colors duration-300">
                Categorías
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => onCategorySelect(cat.name)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <Link to="/dashboard" className="text-gray-200 hover:text-white transition-colors duration-300">Recompensas</Link>
          </div>

          {/* Perfil / Login */}
          <div className="hidden md:flex items-center space-x-4">
            <SearchBar />
            {user ? (
              <div className="relative">
                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2">
                  <img src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="User" className="h-10 w-10 rounded-full" />
                  <span className="text-gray-100 font-medium">{user.name}</span>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cerrar Sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-white hover:underline transition-colors duration-300">Iniciar Sesión</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
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
          <Link to="/" className="block text-gray-200 hover:text-white">Inicio</Link>

          <MobileDropdown categories={categories} onCategorySelect={onCategorySelect} />

          <Link to="/dashboard" className="block text-gray-200 hover:text-white">Dashboard</Link>

          <div className="pt-4 border-t border-gray-700">
            {user ? (
              <div className="relative">
                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2">
                  <img src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="User" className="h-10 w-10 rounded-full" />
                  <span className="text-gray-100 font-medium">{user.name}</span>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cerrar Sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-row space-x-2 justify-center">
                <Link to="/login" className="text-white hover:underline text-center">Iniciar Sesión</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Dropdown móvil
const MobileDropdown = ({ categories, onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-gray-200 hover:text-white"
      >
        Categorías
      </button>
      {isOpen && (
        <div className="pl-4 mt-2 space-y-1">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => onCategorySelect(cat.name)}
              className="block w-full text-left text-gray-200 hover:text-white"
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
