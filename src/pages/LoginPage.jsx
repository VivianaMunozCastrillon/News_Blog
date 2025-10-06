import React, { useState } from "react"; 
import LoginForm from "../components/LoginForm";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";

function LoginPage({ defaultToRegister = false }) {
  const [isLoginMode, setIsLoginMode] = useState(!defaultToRegister);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signInWithGoogle, loginWithEmail, registerWithEmail } = UserAuth();

  // Validación email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { valid: false, message: "Formato de correo inválido" };

    const allowedDomains = ["gmail.com", "yahoo.com", "hotmail.com"];
    const domain = email.split("@")[1];
    if (!allowedDomains.includes(domain)) return { valid: false, message: `Dominio ${domain} no permitido` };

    return { valid: true };
  };

  // Validación password
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Debe tener al menos 8 caracteres");
    if (!/[a-z]/.test(password)) errors.push("Debe contener una letra minúscula");
    if (!/[A-Z]/.test(password)) errors.push("Debe contener una letra mayúscula");
    if (!/[0-9]/.test(password)) errors.push("Debe contener un número");
    if (!/[!@#$%^&*()_+\-=[\]{};':"|<>?,./`~]/.test(password))
      errors.push("Debe contener un carácter especial");
    return errors;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email").trim();
    const password = formData.get("password").trim();
    const name = formData.get("name")?.trim();
    const lastname = formData.get("lastname")?.trim();

    // Validación frontend
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setMessage(emailValidation.message);
      setMessageType("error");
      setLoading(false);
      return;
    }

    const pwErrors = validatePassword(password);
    if (!isLoginMode && pwErrors.length > 0) {
      setMessage(pwErrors.join(", "));
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!isLoginMode && password !== formData.get("confirmPassword")) {
      setMessage("Las contraseñas no coinciden");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      if (isLoginMode) {
        await loginWithEmail(email, password);
        setMessage(`Bienvenido ${email}`);
        setMessageType("success");
        navigate("/");
      } else {
        await registerWithEmail(email, password, { name, lastname });
        setMessage("Usuario registrado correctamente");
        setMessageType("success");
        navigate("/survey");
      }
    } catch (error) {
      // Mostrar mensaje de Supabase directamente
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
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
          validateEmail={validateEmail}
          validatePassword={validatePassword}
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
            duration={3000}
            onClose={() => setMessage("")}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
