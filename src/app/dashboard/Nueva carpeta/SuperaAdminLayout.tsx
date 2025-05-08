// src/app/dashboard/SuperAdminLayout.tsx

import { Link, Outlet, useLocation } from "react-router-dom";
import { LogOut, Users, Building2, School, LayoutDashboard, Layers } from "lucide-react";

export default function SuperAdminLayout() {
  const location = useLocation();

  const menuItems = [
    { to: "/dashboard/superadmin/", label: "Inicio", icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: "/dashboard/superadmin/usuarios", label: "Usuarios", icon: <Users className="w-4 h-4" /> },
    { to: "/dashboard/superadmin/colegios", label: "Colegios", icon: <Building2 className="w-4 h-4" /> },
    { to: "/dashboard/superadmin/unidades", label: "Unidades Educativas", icon: <School className="w-4 h-4" /> },
    { to: "/dashboard/superadmin/infraestructura", label: "Infraestructura", icon: <Layers className="w-4 h-4" /> },
   
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-600">SuperAdmin</div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-600 transition ${
                location.pathname.startsWith(item.to) ? "bg-blue-600" : ""
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-4 border-t border-blue-600 hover:bg-blue-600 transition"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
