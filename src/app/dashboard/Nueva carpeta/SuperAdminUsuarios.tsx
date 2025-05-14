// src/app/dashboard/SuperAdminUsuarios.tsx

import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, X, Search,
  User, IdCard, Mail, Camera, Calendar,
  ChevronUp, ChevronDown,
} from "lucide-react";
import AxiosInstance from "../../components/AxiosInstance";

const emptyUser = {
  id: "",
  nombre: "",
  apellido: "",
  foto: null,
  ci: "",
  email: "",
  fecha_nacimiento: "",
  rol_id: "",
  username: "",
  password: "",
};

export default function SuperAdminUsuarios() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [ciQuery, setCiQuery] = useState("");
  const [sort, setSort] = useState({ key: "nombre", asc: true });

  useEffect(() => {
    AxiosInstance.get("/user/auth/listar-usuarios/")
      .then(res => setRows(res.data))
      .catch(() => alert("No se pudieron cargar los usuarios."));
  }, []);

  const sortBy = (k) => setSort(s => ({ key: k, asc: s.key === k ? !s.asc : true }));
  const filtered = ciQuery.length >= 7 ? rows.filter(r => r.ci.includes(ciQuery)) : rows;
  const ordered = [...filtered].sort((a, b) => {
    const A = a[sort.key] ?? "", B = b[sort.key] ?? "";
    return sort.asc ? (A > B ? 1 : -1) : A < B ? 1 : -1;
  });

  const save = async (u) => {
    if (!u.nombre || !u.apellido || !u.ci || !u.email || !u.username || !u.password || !u.rol_id) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email)) {
      alert("El correo electrónico no es válido.");
      return;
    }

    try {
      const formData = new FormData();
      for (const key in u) {
        if (u[key] !== null && u[key] !== "") {
          if (Array.isArray(u[key])) {
            u[key].forEach(val => formData.append(`${key}[]`, val));
          } else {
            formData.append(key, u[key]);
          }
        }
      }

      if (u.id) {
        await AxiosInstance.put(`/user/auth/editar-usuario/${u.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setRows(r => r.map(x => (x.id === u.id ? { ...x, ...u } : x)));
        alert("✅ Usuario actualizado exitosamente.");
      } else {
        const response = await AxiosInstance.post("/user/auth/register/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const data = response.data.usuario;
        setRows(r => [...r, data]);
        alert("✅ Usuario creado exitosamente.");
      }

      setModalOpen(false);
    } catch (err) {
      const detail = err.response?.data;
      if (detail && typeof detail === "object") {
        const errorMessages = Object.entries(detail)
          .map(([field, msg]) => `• ${field}: ${Array.isArray(msg) ? msg.join(", ") : msg}`)
          .join("\n");
        alert("Error al guardar usuario:\n\n" + errorMessages);
      } else {
        alert("Error inesperado: " + err.message);
      }
    }
  };

  const del = async (id) => {
    if (!confirm("¿Eliminar?")) return;
    try {
      await AxiosInstance.delete(`/user/auth/eliminar-usuario/${id}/`);
      setRows(r => r.filter(x => x.id !== id));
      alert("✅ Usuario eliminado exitosamente.");
    } catch (err) {
      alert("❌ Ocurrió un error al eliminar el usuario.");
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Usuarios</h1>
        <button
          onClick={() => { setEditUser(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" /> Nuevo
        </button>
      </header>

      {/* Buscador (descomentar si lo necesitas)
      <div className="relative w-72">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          value={ciQuery}
          onChange={e => setCiQuery(e.target.value.replace(/\D/g, ""))}
          placeholder="Buscar CI… (≥7 dígitos)"
          className="pl-10 w-full border rounded px-3 py-2"
        />
      </div>
      */}

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-100 text-blue-600">
            {["nombre", "apellido", "ci", "email", "rol", "username"].map(k => (
              <th key={k} onClick={() => sortBy(k)} className="px-4 py-3 text-left cursor-pointer select-none">
                <span className="inline-flex items-center gap-1">
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                  {sort.key === k && (sort.asc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                </span>
              </th>
            ))}
            <th className="px-4 py-3 text-right">Acciones</th>
          </thead>
          <tbody className="divide-y">
            {ordered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">Sin usuarios</td>
              </tr>
            ) : ordered.map((u) => (
              <tr key={u.id} className="hover:bg-blue-50">
                <td className="px-4 py-3">{u.nombre}</td>
                <td className="px-4 py-3">{u.apellido}</td>
                <td className="px-4 py-3">{u.ci}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.rol.nombre}</td>
                <td className="px-4 py-3">{u.username || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setEditUser(u); setModalOpen(true); }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="Editar"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => del(u.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <UsuarioFormModal
          initial={editUser}
          onCancel={() => setModalOpen(false)}
          onSave={save}
        />
      )}
    </section>
  );
}

function UsuarioFormModal({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial ?? { ...emptyUser });

  const handle = (e) => {
    const { name, value, type, files } = e.currentTarget;
    setForm(f => ({ ...f, [name]: type === "file" && files ? files[0] : value }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-lg relative">
        <button onClick={onCancel} className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6">Formulario de Usuario</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {["nombre", "apellido"].map((k) => (
            <div key={k}>
              <label className="block mb-1 capitalize">{k}</label>
              <div className="relative">
                <User className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
                <input
                  name={k}
                  value={form[k]}
                  onChange={handle}
                  className="pl-10 w-full border rounded py-2"
                  placeholder={k}
                />
              </div>
            </div>
          ))}

          <div>
            <label className="block mb-1">Foto</label>
            <div className="relative">
              <Camera className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
              <input
                name="foto"
                type="file"
                accept="image/*"
                onChange={handle}
                className="pl-10 w-full border rounded py-2"
              />
            </div>
            {form.foto && typeof form.foto !== "string" && (
              <img
                src={URL.createObjectURL(form.foto)}
                alt="preview"
                className="w-20 h-20 object-cover rounded-full mt-2"
              />
            )}
          </div>

          <div>
            <label className="block mb-1">CI</label>
            <div className="relative">
              <IdCard className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
              <input
                name="ci"
                value={form.ci}
                onChange={handle}
                className="pl-10 w-full border rounded py-2"
                placeholder="Número CI"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Correo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handle}
                className="pl-10 w-full border rounded py-2"
                placeholder="email@dominio.com"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Nacimiento</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
              <input
                name="fechaNacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={handle}
                className="pl-10 w-full border rounded py-2"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Rol</label>
            <select
              name="rol_id"
              value={form.rol_id}
              onChange={handle}
              className="w-full border rounded py-2 px-3"
            >
              <option value="">— Selecciona —</option>
              <option value="1">Admin</option>
              <option value="2">Estudiante</option>
              <option value="3">Profesor</option>
              <option value="4">Superadmin</option>
              <option value="5">Tutor</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
            <input
              name="username"
              value={form.username}
              onChange={handle}
              className="pl-10 w-full border rounded py-2"
              placeholder="Nombre de usuario"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handle}
            className="pl-3 w-full border rounded py-2"
            placeholder="Contraseña"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
}
