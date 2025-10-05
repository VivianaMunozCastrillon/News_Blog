import React from "react";
import { BrowserRouter } from "react-router-dom";
import { MyRoutes } from "./routes/routes";
import { AuthContextProvider } from "./context/AuthContext";
import { CategoryProvider } from "./context/CategoryContext";
import { SearchProvider } from "./context/SearchContext"; 

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <CategoryProvider>
          <SearchProvider>  
            <MyRoutes />
          </SearchProvider>
        </CategoryProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
