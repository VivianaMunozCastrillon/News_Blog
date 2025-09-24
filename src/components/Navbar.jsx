import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import Logo from '../assets/Logo_Notiplay.png';

const Navbar = () => {
  const { user, signout } = UserAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-black to-brand-pink shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={Logo} alt="Notiplay Logo" className="h-12" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-200 hover:text-white transition-colors duration-300">Inicio</Link>
            <Link to="/news" className="text-gray-200 hover:text-white transition-colors duration-300">Noticias</Link>
            <Link to="/dashboard" className="text-gray-200 hover:text-white transition-colors duration-300">Dashboard</Link>
          </div>

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
                <Link to="/login" className="px-4 py-2 text-white bg-brand-pink rounded-md hover:opacity-90 transition-colors duration-300">Iniciar Sesión</Link>
                <Link to="/register" className="px-4 py-2 text-white border border-white rounded-md hover:bg-white hover:text-brand-pink transition-colors duration-300">Registrarse</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-200 hover:text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 px-4 pt-2 pb-4 space-y-2">
          <Link to="/" className="block text-gray-200 hover:text-white">Inicio</Link>
          <Link to="/news" className="block text-gray-200 hover:text-white">Noticias</Link>
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
              <div className="flex flex-col space-y-2">
                <Link to="/login" className="px-4 py-2 text-center text-white bg-brand-pink rounded-md hover:opacity-90">Iniciar Sesión</Link>
                <Link to="/register" className="px-4 py-2 text-center text-white border border-white rounded-md hover:bg-white hover:text-brand-pink">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
