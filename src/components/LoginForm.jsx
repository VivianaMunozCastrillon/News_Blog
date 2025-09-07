import React from "react";

function LoginForm({ isLoginMode, setIsLoginMode, onSubmit }) {
  return (
    // Contenedor principal de la tarjeta
    <div className="w-[430px] bg-white p-8 rounded-2xl shadow-lg">
      
      {/* Título dinámico: cambia según el modo */}
      <div className="flex justify-center mb-4">
        <h2 className="text-3xl font-semibold text-center">
          {isLoginMode ? "Iniciar Sesión" : "Registrarse"}
        </h2>
      </div>

      {/* Controles de pestañas (Iniciar Sesión / Registrarse) */}
      <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">
        
        {/* Botón para activar el modo "Iniciar Sesión" */}
        <button
          type="button"
          className={`w-1/2 text-lg font-medium transition-all z-10 ${
            isLoginMode ? "text-white" : "text-black"
          }`}
          onClick={() => setIsLoginMode(true)}
        >
          Iniciar Sesión
        </button>

        {/* Botón para activar el modo "Registrarse" */}
        <button
          type="button"
          className={`w-1/2 text-lg font-medium transition-all z-10 ${
            !isLoginMode ? "text-white" : "text-black"
          }`}
          onClick={() => setIsLoginMode(false)}
        >
          Registrarse
        </button>

        {/* Indicador de pestaña activa */}
        <div
          className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-[#4a0d36] via-[#a0236f] to-[#d63384] transition-all ${
            isLoginMode ? "left-0" : "left-1/2"
          }`}
        ></div>
      </div>

      {/* Formulario principal */}
      <form onSubmit={onSubmit} className="space-y-4">

        {/* Campos visibles SOLO en modo registro */}
        {!isLoginMode && (
          <>
            <input 
              type="text" 
              name="name" 
              placeholder="Nombre" 
              required 
              className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-pink-500" 
            />
            <input 
              type="text" 
              name="lastname" 
              placeholder="Apellido" 
              required 
              className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-pink-500" 
            />
          </>
        )}

        {/* Campos compartidos (login y registro) */}
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          required 
          className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-pink-500" 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Contraseña" 
          required 
          className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-pink-500" 
        />

        {/* Confirmar contraseña (solo en registro) */}
        {!isLoginMode && (
          <input 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirmar contraseña" 
            required 
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-pink-500" 
          />
        )}

        {/* Enlace "Olvidaste la contraseña?" (solo en login) */}
        {isLoginMode && (
          <div className="text-right">
            <a href="#" className="text-pink-500 hover:underline">
              Olvidaste la contraseña?
            </a>
          </div>
        )}

        {/* Botón de enviar formulario */}
        <button className="w-full p-3 bg-gradient-to-r from-[#6f1652] via-pink-500 to-pink-300 text-white rounded-full text-lg font-medium hover:opacity-90 transition">
          {isLoginMode ? "Iniciar Sesión" : "Registrarse"}
        </button>

        {/* Enlace para cambiar de modo (login ↔ registro) */}
        <p className="text-center text-gray-600">
          {isLoginMode ? "No tienes cuenta?" : "Ya tienes una cuenta?"}{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); // Evita recargar la página
              setIsLoginMode(!isLoginMode); // Cambia de modo
            }}
            className="text-pink-500 hover:underline"
          >
            {isLoginMode ? "Registrarse" : "Iniciar Sesión"}
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
