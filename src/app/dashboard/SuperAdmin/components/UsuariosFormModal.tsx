import React, { useState } from "react";
import { X } from "lucide-react";
import AxiosInstance from "@/components/AxiosInstance";
import { Usuario, Rol } from "@/app/modelos/Usuarios";

interface Props {
  initial: Usuario | null;
  onCancel: () => void;
  onSave: (updated: Usuario) => void;
}

export default function UsuarioFormModal({ initial, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Usuario>(
    initial ?? ({
      id: 0,
      ci: "",
      nombre: "",
      apellido: "",
      email: "",
      username: "",
      foto: null,
      fecha_nacimiento: "",
      rol: new Rol({ id: 0, nombre: "" }),
      password: null,
      estado: true,
      is_staff: false,
      is_active: true,
      date_joined: new Date().toISOString(),
      telefono: null,
    })
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, files } = e.currentTarget as any;
    setForm((f) => ({
      ...f,
      [name]:
        type === "file" && files && files[0] ? files[0] : value,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v != null && v !== "") {
        formData.append(k, v as any);
      }
    });

    try {
      let resp;
      if (form.id) {
        resp = await AxiosInstance.put(
          `/user/auth/editar-usuario/${form.id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        resp = await AxiosInstance.post(
          "/user/auth/register/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      onSave(resp.data.usuario ?? resp.data);
    } catch (err: any) {
      alert(
        "Error: " +
          JSON.stringify(err.response?.data || err.message)
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">
          {form.id ? "Editar Usuario" : "Nuevo Usuario"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {/* CI */}
          <div>
            <label className="block mb-1">CI</label>
            <input
              name="ci"
              value={form.ci}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          {/* Nombre */}
          <div>
            <label className="block mb-1">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          {/* Apellido */}
          <div>
            <label className="block mb-1">Apellido</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          {/* Email */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          {/* Username */}
          <div>
            <label className="block mb-1">Usuario</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          {/* Rol */}
          <div>
            <label className="block mb-1">Rol</label>
            <select
              name="rol"
              value={form.rol.id}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  rol: new Rol({ id: Number(e.target.value), nombre: "" }),
                }))
              }
              className="w-full border rounded p-2"
            >
              <option value="">— Selecciona —</option>
              <option value="1">Admin</option>
              <option value="2">Estudiante</option>
              <option value="3">Profesor</option>
              <option value="4">Superadmin</option>
              <option value="5">Tutor</option>
            </select>
          </div>
          {/* Foto */}
          <div>
            <label className="block mb-1">Foto</label>
            <input
              name="foto"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            {form.foto && typeof form.foto !== "string" && (
              <img
                src={URL.createObjectURL(form.foto as File)}
                alt="preview"
                className="mt-2 w-20 h-20 rounded-full object-cover"
              />
            )}
          </div>
          {/* Fecha nacimiento */}
          <div>
            <label className="block mb-1">Nacimiento</label>
            <input
              name="fecha_nacimiento"
              type="date"
              value={form.fecha_nacimiento?.slice(0, 10) || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
