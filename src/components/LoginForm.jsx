import React from "react";

function LoginForm({ isLoginMode, setIsLoginMode, onSubmit, children }) {
  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-lg">
      {/* Título dinámico */}
      <div className="flex justify-center mb-4">
        <h2 className="text-2xl font-semibold text-center">
          {isLoginMode ? "Iniciar Sesión" : "Registrarse"}
        </h2>
      </div>

      {/* Tabs Login / Registro */}
      <div className="relative flex h-10 mb-6 border border-gray-300 rounded-full overflow-hidden">
        <button
          type="button"
          className={`w-1/2 text-sm font-medium transition-all z-10 ${
            isLoginMode ? "text-white" : "text-black"
          }`}
          onClick={() => setIsLoginMode(true)}
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          className={`w-1/2 text-sm font-medium transition-all z-10 ${
            !isLoginMode ? "text-white" : "text-black"
          }`}
          onClick={() => setIsLoginMode(false)}
        >
          Registrarse
        </button>
        <div
          className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-[#4a0d36] via-[#a0236f] to-[#d63384] transition-all ${
            isLoginMode ? "left-0" : "left-1/2"
          }`}
        ></div>
      </div>

      {/* Formulario */}
      <form onSubmit={onSubmit} className="space-y-3">
        {!isLoginMode && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              required
              className="w-full p-2 border-b-2 border-gray-300 outline-none focus:border-pink-500 text-sm"
            />
            <input
              type="text"
              name="lastname"
              placeholder="Apellido"
              required
              className="w-full p-2 border-b-2 border-gray-300 outline-none focus:border-pink-500 text-sm"
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-2 border-b-2 border-gray-300 outline-none focus:border-pink-500 text-sm"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          required
          className="w-full p-2 border-b-2 border-gray-300 outline-none focus:border-pink-500 text-sm"
        />

        {!isLoginMode && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            required
            className="w-full p-2 border-b-2 border-gray-300 outline-none focus:border-pink-500 text-sm"
          />
        )}

        {isLoginMode && (
          <div className="text-right">
            <a href="#" className="text-pink-500 text-xs hover:underline">
              ¿Olvidaste la contraseña?
            </a>
          </div>
        )}

        <button className="w-full p-2 bg-gradient-to-r from-[#6f1652] via-pink-500 to-pink-300 text-white rounded-full text-sm font-medium hover:opacity-90 transition">
          {isLoginMode ? "Iniciar Sesión" : "Registrarse"}
        </button>

        {children}

        {/* Enlace cambiar modo */}
        <p className="text-center text-gray-600 text-sm mt-3">
          {isLoginMode ? "¿No tienes cuenta?" : "¿Ya tienes una cuenta?"}{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsLoginMode(!isLoginMode);
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
