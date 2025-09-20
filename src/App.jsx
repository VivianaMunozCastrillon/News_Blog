import React from "react";
import { BrowserRouter } from "react-router-dom";
import { MyRoutes } from "./routes/routes";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <MyRoutes />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
