import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext"; 
import { Mail, CheckCircle } from "lucide-react";

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { resetPassword } = UserAuth(); // Traer la función desde el contexto
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      await resetPassword(email); 
      setShowModal(true);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Título */}
        <h2 className="text-center text-xl font-bold mb-2 text-pink-600">
          Recuperar contraseña
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Si tu correo está registrado, te enviaremos un enlace de verificación.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <Mail size={18} />
            </span>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Botón principal */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-2 rounded-full hover:bg-pink-700 transition"
          >
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>

          {/* Botón secundario */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full border border-gray-400 text-gray-700 py-2 rounded-full hover:bg-gray-100 transition"
          >
            Regresar
          </button>
        </form>

        {/* Mensaje de error */}
        {errorMessage && (
          <p className="mt-4 text-sm text-red-600 text-center">{errorMessage}</p>
        )}
      </div>

      {/* Modal de éxito */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
            <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">
              ¡Correo enviado!
            </h3>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              Hemos enviado un enlace a tu correo para que puedas restablecer tu
              contraseña.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                navigate("/login");
              }}
              className="w-full bg-pink-600 text-white py-2 rounded-full hover:bg-pink-700 transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResetPasswordPage;
