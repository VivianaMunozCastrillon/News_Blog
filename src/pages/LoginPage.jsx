import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
// Backend real
//import { loginUser, registerUser } from "../services/auth";

// Backend falso (mock)
import { loginUser, registerUser } from "../services/auth.mock";

function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error | info
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

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

        // Redirigir a homepage
        navigate("/");
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-b from-[#4a0d36] via-[#a0236f] to-[#d63384] bg-[url('./assets/FondoLogin.png')] bg-cover bg-center">
      <div className="flex flex-col justify-center items-center">
        <LoginForm
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
          onSubmit={handleSubmit}
        />

        <div className="w-full max-w-md mt-4 text-center">
          {loading && (
            <div className="flex justify-center">
              <Spinner size="w-8 h-8" color="border-pink-500" />
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
