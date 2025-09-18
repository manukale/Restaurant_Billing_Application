import { useState } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;