import { useState } from "react";
import { X, LogOut } from "lucide-react";
import AxiosInstance from "../../components/AxiosInstance"; // Asegúrate de que esta ruta sea correcta

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

interface Props {
  user: {
    nombre: string;
    apellido: string;
    email: string;
    fechaNacimiento: string;
    username: string;
    foto: string;
  };
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function PerfilModal({ user, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    ...user,
    password: "",
    fotoFile: null as File | null,
    fotoPreview: user.foto,
  });

  const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    const preview = file ? URL.createObjectURL(file) : form.fotoPreview;
    setForm((f) => ({ ...f, fotoFile: file, fotoPreview: preview }));
  };

  const guardar = () => {
    onSave(form);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await AxiosInstance.post("/user/auth/logout/");
      localStorage.removeItem("token");
      localStorage.removeItem("datosDeloUsuario");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("No se pudo cerrar la sesión. Intenta de nuevo.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[95%] max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-blue-600 mb-4">Mi perfil</h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          {form.fotoPreview ? (
            <img
              src={
                form.fotoPreview?.startsWith("/media/")
                  ? `${API_BASE_URL}${form.fotoPreview}`
                  : form.fotoPreview
              }
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-2xl font-semibold">
              {user.nombre[0]}
            </div>
          )}
          <label className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-lg cursor-pointer text-sm">
            Cambiar foto
            <input type="file" accept="image/*" onChange={changeFile} className="hidden" />
          </label>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Nombre"
          />
          <input
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Apellido"
          />
          <input
            type="date"
            value={form.fechaNacimiento}
            onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Correo"
          />
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Usuario"
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Nueva contraseña"
          />
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={guardar}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
