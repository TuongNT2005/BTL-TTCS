import React from "react";
import { UIProvider } from "./context/UIContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes/AppRoutes";

export function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </UIProvider>
  );
}

export default App;
