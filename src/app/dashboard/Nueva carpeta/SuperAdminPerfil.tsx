// src/app/dashboard/SuperAdminPerfil.tsx

import { useState, useEffect } from "react";
import { Camera, Mail, User, Key } from "lucide-react";
import AxiosInstance from "../../components/AxiosInstance";

export default function SuperAdminPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    AxiosInstance.get("/user/auth/mi-perfil/")
      .then(res => {
        setPerfil(res.data);
        setForm(res.data);
      })
      .catch(() => alert("Error al cargar el perfil."));
  }, []);

  const handle = (e) => {
    const { name, value, type, files } = e.currentTarget;
    setForm(f => ({ ...f, [name]: type === "file" && files ? files[0] : value }));
  };

  const guardarCambios = async () => {
    try {
      const formData = new FormData();
      for (const key in form) {
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      }

      const res = await AxiosInstance.put(`/user/auth/editar-mi-perfil/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPerfil(res.data);
      setModoEdicion(false);
      alert("✅ Perfil actualizado correctamente.");
    } catch (err) {
      alert("❌ Error al actualizar el perfil.");
    }
  };

  if (!form) {
    return <p className="text-center mt-10 text-gray-600">Cargando perfil…</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Mi Perfil</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">Nombre</label>
          <div className="relative">
            <User className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
            <input
              name="nombre"
              value={form.nombre}
              onChange={handle}
              disabled={!modoEdicion}
              className="pl-10 w-full border rounded py-2"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Apellido</label>
          <div className="relative">
            <User className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
            <input
              name="apellido"
              value={form.apellido}
              onChange={handle}
              disabled={!modoEdicion}
              className="pl-10 w-full border rounded py-2"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Correo</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
            <input
              name="email"
              value={form.email}
              onChange={handle}
              disabled={!modoEdicion}
              className="pl-10 w-full border rounded py-2"
              type="email"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Nombre de usuario</label>
          <div className="relative">
            <User className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
            <input
              name="username"
              value={form.username}
              onChange={handle}
              disabled={!modoEdicion}
              className="pl-10 w-full border rounded py-2"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Foto de perfil</label>
          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handle}
            disabled={!modoEdicion}
            className="w-full border rounded px-3 py-2"
          />
          {form.foto && typeof form.foto !== "string" && (
            <img
              src={URL.createObjectURL(form.foto)}
              alt="preview"
              className="w-20 h-20 object-cover rounded-full mt-2"
            />
          )}
          {typeof form.foto === "string" && (
            <img
              src={form.foto}
              alt="Foto de perfil"
              className="w-20 h-20 object-cover rounded-full mt-2"
            />
          )}
        </div>

        {modoEdicion && (
          <div>
            <label className="block mb-1">Nueva contraseña</label>
            <div className="relative">
              <Key className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
              <input
                type="password"
                name="password"
                onChange={handle}
                className="pl-10 w-full border rounded py-2"
                placeholder="********"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        {modoEdicion ? (
          <>
            <button onClick={() => setModoEdicion(false)} className="px-4 py-2 border rounded">
              Cancelar
            </button>
            <button onClick={guardarCambios} className="px-4 py-2 bg-blue-600 text-white rounded">
              Guardar
            </button>
          </>
        ) : (
          <button onClick={() => setModoEdicion(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
            Editar Perfil
          </button>
        )}
      </div>
    </div>
  );
}
