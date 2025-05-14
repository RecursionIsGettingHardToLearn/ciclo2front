import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Home from "./app/usuarios/Home";
import Login from "./app/usuarios/Login";
import Register from "./app/usuarios/Register";



// Layout y páginas Super Admin
import SuperAdminLayout from "./app/dashboard/SuperAdminLayout";
import SuperAdminInicio from "./app/dashboard/SuperAdminInicio";
import SuperAdminColegios from "./app/dashboard/SuperAdminColegios";
import SuperAdminUnidades from "./app/dashboard/SuperAdminUnidades"; // ← corregido
import SuperAdminUsuarios from "./app/dashboard/SuperAdminUsuarios";
import SuperAdminInfraestructura from "./app/dashboard/SuperAdminInfraestructura"; // ← nuevo

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    
        {/* Dashboard Alumno */}
      

        {/* Panel Super Admin con rutas anidadas */}
        <Route path="/dashboard/superadmin" element={<SuperAdminLayout />}>
          <Route index element={<SuperAdminInicio />} />
          <Route path="colegios" element={<SuperAdminColegios />} />
          <Route path="unidades" element={<SuperAdminUnidades />} /> {/* ← corregido */}
          <Route path="usuarios" element={<SuperAdminUsuarios />} />
          <Route path="infraestructura" element={<SuperAdminInfraestructura />} /> {/* ← agregado */}
        </Route>

        {/* 404 opcional */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);