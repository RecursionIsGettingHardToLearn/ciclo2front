// src/app/usuarios/NotFound.tsx
import { ConeIcon } from "lucide-react";
import React from "react";

const NotFound = () => {
    console.log("404 - Página no encontrada");
  return (
    <div className="not-found">
      <h2>404 - Página no encontrada</h2>
      <p>Lo sentimos, la página que buscas no existe.</p>
    </div>
  );
};

export default NotFound;
