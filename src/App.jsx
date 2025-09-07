import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal -> HomePage */}
        <Route path="/" element={<HomePage />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
