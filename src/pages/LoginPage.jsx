import React, { useState } from "react"; 
import LoginForm from "../components/LoginForm";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/auth";
import { UserAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";

function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signInWithGoogle } = UserAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      if (isLoginMode) {
        // LOGIN
        const data = await loginUser(
          formData.get("email"),
          formData.get("password")
        );
        setMessage(`Bienvenido ${data.user.name}`);
        setMessageType("success");
        localStorage.setItem("token", data.token);

        // Redirigir a homepage 
        navigate("/");
      } else {
        // REGISTRO
        if (formData.get("password") !== formData.get("confirmPassword")) {
          setMessage("Las contraseñas no coinciden");
          setMessageType("error");
          return;
        }
        const data = await registerUser(
          formData.get("name"),
          formData.get("email"),
          formData.get("password")
        );
        setMessage(`${data.message}`);
        setMessageType("success");

        navigate("/");
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
      navigate("/"); 
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4a0d36] via-[#a0236f] to-[#d63384] bg-[url('./assets/FondoLogin.png')] bg-cover bg-center">
      <div className="w-full max-w-md px-4">
        <LoginForm
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
          onSubmit={handleSubmit}
        >
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">o</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-2 w-full bg-white text-gray-700 py-2 rounded-full shadow hover:bg-gray-100 transition text-sm"
          >
            <FcGoogle size={20} />
            <span>Continuar con Google</span>
          </button>
        </LoginForm>

        <div className="w-full max-w-md mt-3 text-center">
          {loading && (
            <div className="flex justify-center">
              <Spinner size="w-6 h-6" color="border-pink-500" />
            </div>
          )}
          <Alert
            message={message}
            type={messageType}
            duration={2000}
            onClose={() => setMessage("")}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
