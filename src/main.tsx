import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css'
import Home from "./app/usuarios/Home";
import Login from "./app/usuarios/Login";
import AlumnoDashboard from "./app/dashboard/AlumnosDashboard";
import SuperAdminDashboard from "./app/dashboard/SuperAdminDashboard";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/alumno" element={<AlumnoDashboard />} />
        <Route path="/dashboard/superadmin" element={<SuperAdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
