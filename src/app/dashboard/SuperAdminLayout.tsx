import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { Home, School, Building2, Users, Layers, Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import PerfilModal from "./SuperAdminPerfil"; // Asegúrate de tener este componente
import AxiosInstance from "../../components/AxiosInstance";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;
const items = [
  { to: "/dashboard/superadmin", label: "Inicio", icon: Home },
  { to: "/dashboard/superadmin/colegios", label: "Colegios", icon: School },
  { to: "/dashboard/superadmin/unidades", label: "Unidades", icon: Building2 },
  { to: "/dashboard/superadmin/usuarios", label: "Usuarios", icon: Users },
  { to: "/dashboard/superadmin/infraestructura", label: "Infraestructura", icon: Layers },
];

export default function SuperAdminLayout() {
  type Usuario = {
    nombre: string;
    apellido: string;
    email: string;
    fechaNacimiento: string;
    username: string;
    foto: string;
  };
  const [user, setUser] = useState<Usuario | null>(null);
  const [openSide, setOpenSide] = useState(true);
  const [showPerfil, setShowPerfil] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    fetchPerfil(); // Ejecutar al montar el componente

    if (showPerfil) {
      fetchPerfil(); // También ejecutar si se abre el modal (opcional)
    }
  }, [showPerfil]);

  const fetchPerfil = async () => {
    try {
      const response = await AxiosInstance.get("/user/auth/perfil/");
      console.log("🔍 Perfil recibido:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error al obtener perfil:", error);
    }
  };


  const logout = async () => {
    try {
      await AxiosInstance.post("/user/auth/logout/");
      localStorage.removeItem("token"); // Eliminar token del localStorage
      localStorage.removeItem("datosDelUsuario"); // Eliminar datos del usuario del localStorage
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex bg-blue-50 text-gray-800">
        {/* Sidebar */}
        <aside className={clsx("bg-white shadow transition-all flex flex-col", openSide ? "w-64" : "w-16")}>
          <div className="flex items-center justify-between p-4">
            <Link to="/dashboard/superadmin" className="text-xl font-bold text-blue-600">
              {openSide ? "Admin" : "A"}
            </Link>
            <button onClick={() => setOpenSide(!openSide)} className="p-1 rounded hover:bg-blue-100">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 mt-4 space-y-1">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/dashboard/superadmin"} // <-- esta es la línea nueva
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

        {/* Contenido */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-blue-600">Panel Super Admin</h1>
            {/* Botón de perfil 
            <button onClick={() => setShowPerfil(true)} className="flex items-center gap-2 focus:outline-none">
              {user ? (
                <>
                  {user.foto ? (
                    <img src={`${API_BASE_URL}${user.foto}`} alt="avatar" className="w-8 h-8 rounded-full object-cover border" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-semibold">
                      {user.nombre[0]}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm">{user.username}</span>
                </>
              ) : (
                <span className="text-sm italic text-gray-500">Cargando...</span>
              )}
            </button>
            */}
            <button onClick={() => setShowPerfil(true)} className="hidden sm:block ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
             MI PERFIL
            </button>
           
          </header>
          <main className="p-6 flex-1">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Modal Perfil */}
      {showPerfil && user && (
        <PerfilModal
          user={user}
          onClose={() => setShowPerfil(false)}
          onLogout={logout}
          onSave={(data) => console.log("Guardar perfil:", data)}
        />
      )}
    </>
  );
}
