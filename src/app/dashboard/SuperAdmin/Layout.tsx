import React, { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import {
  Home,
  School,
  Building2,
  Users,
  Layers,
  Menu,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import PerfilModal from "./Perfil"; // Asegúrate de tener este componente
import AxiosInstance from "@/components/AxiosInstance";

// const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL_LOCAL as string;
import { Usuario } from "@/app/modelos/Usuarios"; // Asegúrate de que esta ruta sea correcta

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const items: NavItem[] = [
  { to: "/dashboard/superadmin", label: "Inicio", icon: Home },
  { to: "/dashboard/superadmin/colegios", label: "Colegios", icon: School },
  {
    to: "/dashboard/superadmin/unidades",
    label: "Unidades",
    icon: Building2,
  },
  {
    to: "/dashboard/superadmin/usuarios",
    label: "Usuarios",
    icon: Users,
  },
  {
    to: "/dashboard/superadmin/infraestructura",
    label: "Infraestructura",
    icon: Layers,
  },
];

function isFile(x: unknown): x is File {
  return x instanceof File;
}

const SuperAdminLayout: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [openSide, setOpenSide] = useState<boolean>(true);
  const [showPerfil, setShowPerfil] = useState<boolean>(false);
  const navigate = useNavigate();

  // Carga el perfil del usuario
  const fetchPerfil = async (): Promise<void> => {
    try {
      const response = await AxiosInstance.get<Usuario>("/user/auth/perfil/");
      setUser(response.data);
    } catch (error) {
      console.error("Error al obtener perfil:", error);
    }
  };

  // Cierra la sesión
  const logout = async (): Promise<void> => {
    try {
      await AxiosInstance.post("/user/auth/logout/");
      localStorage.removeItem("token");
      localStorage.removeItem("datosDelUsuario");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    fetchPerfil(); // al montar
  }, []);

  // Re-fetch cuando se muestre/oculte el modal (opcional)
  useEffect(() => {
    if (showPerfil) {
      fetchPerfil();
    }
  }, [showPerfil]);

  return (
    <>
      <div className="min-h-screen flex bg-blue-50 text-gray-800">
        {/* Sidebar */}
        <aside
          className={clsx(
            "bg-white shadow transition-all flex flex-col",
            openSide ? "w-64" : "w-16"
          )}
        >
          <div className="flex items-center justify-between p-4">
            <Link
              to="/dashboard/superadmin"
              className="text-xl font-bold text-blue-600"
            >
              {openSide ? "Admin" : "A"}
            </Link>
            <button
              onClick={() => setOpenSide((o) => !o)}
              className="p-1 rounded hover:bg-blue-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 mt-4 space-y-1">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/dashboard/superadmin"}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-4 py-2 mx-2 rounded-lg",
                    isActive
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-blue-50"
                  )
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {openSide && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={logout}
              className={clsx(
                "flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-red-50",
                openSide ? "text-red-600" : "justify-center text-red-600"
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {openSide && <span>Cerrar sesión</span>}
            </button>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-blue-600">
              Panel Super Admin
            </h1>
            <button
              onClick={() => setShowPerfil(true)}
              className="hidden sm:block ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              MI PERFIL
            </button>
          </header>
          <main className="p-6 flex-1">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Modal de perfil */}
      {showPerfil && user && (
      <PerfilModal
        user={{
          nombre:           user.nombre,
          apellido:         user.apellido,
          email:            user.email,
          fecha_nacimiento: user.fecha_nacimiento ?? "",
          username:         user.username,
          // casteo a `any` para que TS acepte el instanceof:
          foto: isFile(user.foto)
            ? user.foto
            : (user.foto ?? null),
        }}
        onClose={() => setShowPerfil(false)}
        onSave={(data: Usuario) => {
          console.log("Guardar perfil:", data);
          // API de actualización...
        }}
        onLogout={logout}
      />
    )}
    </>
  );
};

export default SuperAdminLayout;
