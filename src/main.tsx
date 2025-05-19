import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Home from "./app/usuarios/Home";
import Login from "./app/usuarios/Login";
import Register from "./app/usuarios/Register";



// Layout y páginas Super Admin
import SuperAdminLayout from "./app/dashboard/SuperAdmin/Layout";
import SuperAdminInicio from "./app/dashboard/SuperAdmin/Inicio";
import SuperAdminColegios from "./app/dashboard/SuperAdmin/Colegios";
import SuperAdminUnidades from "./app/dashboard/SuperAdmin/Unidades"; // ← corregido
import SuperAdminUsuarios from "./app/dashboard/SuperAdmin/Usuarios";
import SuperAdminInfraestructura from "./app/dashboard/SuperAdmin/Infraestructura"; // ← nuevo
import MateriaCurso from "./app/gestion-academica/Materia-Curso";

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

          
          <Route path="gestion-academica/materias-cursos" element={<MateriaCurso />} /> {/* ← agregado */}



        </Route>

        {/* 404 opcional */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);