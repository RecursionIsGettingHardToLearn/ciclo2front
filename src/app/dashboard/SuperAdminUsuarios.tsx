import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, X,
  User, IdCard, Mail, Camera, Calendar,
  ChevronUp, ChevronDown,
} from "lucide-react";
import AxiosInstance from "../../components/AxiosInstance";
import { Usuario } from "../modelos/Usuarios";
import { Rol } from "../modelos/Usuarios";

const columnas: Array<keyof Usuario> = [
  "nombre",
  "apellido",
  "ci",
  "email",
  "rol",
  "username",
  "password",
  "foto",
  "fecha_nacimiento",
  "id",
];

const emptyUser: Usuario = {
  id: 0,
  ci: "",
  nombre: "",
  apellido: "",
  foto: null,
  email: "",
  fecha_nacimiento: null,      // o "" si tu tipo lo permite
  username: "",
  estado: false,               // ¡obligatorio!
  rol: new Rol({ id: 0, nombre: "" }),  
  telefono: null,              // si tu tipo lo hace opcional
  password: null,    // opcional
  is_staff: false,             // obligatorio
  is_active: false,            // obligatorio
  date_joined: new Date().toISOString(),  // obligatorio
};

interface UsuarioFormModalProps {
  initial: Usuario
  onCancel: () => void
  onSave: (updated: Usuario) => void
}

export default function SuperAdminUsuarios() {

  const [rows, setRows] = useState<typeof emptyUser[]>([]);
  const [editUser, setEditUser] = useState<Usuario | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [ciQuery, /*setCiQuery*/] = useState("");
  const [sort, setSort] = useState({ key: "nombre", asc: true });
  useEffect(() => {
    AxiosInstance.get("/user/auth/listar-usuarios/")
      .then(res => {
        console.log("Usuarios cargados:", res.data);
        setRows(res.data);
      })
      .catch(err => {
        console.error("Error al cargar usuarios:", err);
        alert("No se pudieron cargar los usuarios.");
      });
  }, []);
  const sortBy = (k: keyof typeof emptyUser) => setSort(s => ({ key: k, asc: s.key === k ? !s.asc : true }));

  const filtered = ciQuery.length >= 7 ? rows.filter(r => r.ci.includes(ciQuery)) : rows;
  const ordered = [...filtered].sort((a, b) => {
    const A = a[sort.key as keyof typeof emptyUser] ?? "", B = b[sort.key as keyof typeof emptyUser] ?? "";
    return sort.asc ? (A > B ? 1 : -1) : A < B ? 1 : -1;
  });

  const save = async (u: Usuario): Promise<void> => {
    if (!u.nombre || !u.apellido || !u.ci || !u.email || !u.username || !u.password || !u.rol) {
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
        const typedKey = key as keyof Usuario;
        if (u[typedKey] !== null && u[typedKey] !== "") {
          if (Array.isArray(u[typedKey])) {
            u[typedKey].forEach(val => formData.append(`${key}[]`, val));
          } else {
            formData.append(key, u[key as keyof Usuario] as string);
          }
        }
      }
  
      if (u.id) {
        // 🔄 Modo edición
        await AxiosInstance.put(`/user/auth/editar-usuario/${u.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setRows(r => r.map(x => (x.id === u.id ? { ...x, ...u } : x)));
        alert("✅ Usuario actualizado exitosamente.");
      } else {
        // 🆕 Modo creación
        const response = await AxiosInstance.post("/user/auth/register/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const data = response.data.usuario;
        setRows(r => [...r, data]);
        alert("✅ Usuario creado exitosamente.");
      }

      setModalOpen(false);
    } 
    catch (err) {
      if ((err as any).response?.data) {
        const detail = (err as any).response?.data;
        if (detail && typeof detail === "object") {
          const errorMessages = Object.entries(detail)
            .map(([field, msg]) => `• ${field}: ${Array.isArray(msg) ? msg.join(", ") : msg}`)
            .join("\n");
          alert("Error al guardar usuario:\n\n" + errorMessages);
        } else {
          alert("Error inesperado: " + (err as any).message);
        }
        }
    };
  }
  

  const del = async (id: string) => {
    if (!confirm("¿Eliminar?")) return;
  
    try {
      await AxiosInstance.delete(`/user/auth/eliminar-usuario/${id}/`);
      setRows(r => r.filter(x => x.id !== Number(id)));
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("Ocurrió un error al eliminar el usuario.");
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
        {/* Search bar start 
        <div className="relative w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            value={ciQuery}
            onChange={e => setCiQuery(e.target.value.replace(/\D/g, ""))}
            placeholder="Buscar CI… (≥7 dígitos)"
            className="pl-10 w-full border rounded px-3 py-2"
          />
        </div>
          Search bar end */}

        <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-100 text-blue-600">
            <tr>
              {columnas.map((k) => (
                <th
                  key={k}
                  onClick={() => sortBy(k)}
                  className="px-4 py-3 text-left cursor-pointer select-none"
                >
                  <span className="inline-flex items-center gap-1">
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                    {sort.key === k && (
                      sort.asc
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />
                    )}
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ordered.length === 0 ? (
              <tr>
                <td colSpan={columnas.length + 1} className="p-8 text-center text-gray-500">
                  Sin usuarios
                </td>
              </tr>
            ) : (
              ordered.map((u) => (
                <tr key={u.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3">{u.nombre}</td>
                  <td className="px-4 py-3">{u.apellido}</td>
                  <td className="px-4 py-3">{u.ci}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.rol.nombre}</td>
                  <td className="px-4 py-3">{u.username || "—"}</td>
                  <td className="px-4 py-3 flex justify-end gap-2">
                    <button
                      onClick={() => { setEditUser(u); setModalOpen(true); }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="Editar"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => del(String(u.id))}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        </div>

        {modalOpen && (
          <UsuarioFormModal
            initial={editUser ?? emptyUser}
            onCancel={() => setModalOpen(false)}
            onSave={save}
          />
        )}
      </section>
    );
  }



function UsuarioFormModal({ initial, onCancel, onSave } : UsuarioFormModalProps) {
  const [form, setForm] = useState(initial ?? { ...emptyUser });

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type, files } = e.currentTarget as HTMLInputElement;
    setForm(f => ({
      ...f,
      [name]: type === "file" && files ? files[0] : value
    }));
  };

  const textFields: Array<keyof Usuario> = ["nombre", "apellido"];

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-lg relative">

        <button onClick={onCancel} className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6">Formulario de Usuario</h2>

        <div className="grid md:grid-cols-2 gap-6">
        {textFields.map((k) => (
          <div key={k}>
            <label className="block mb-1 capitalize">{k}</label>
            <div className="relative">
              <User className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
              <input
                name={k}
                value={typeof form[k] === "string" ? form[k] : ""} // Ensure value is a string
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
                value={form.fecha_nacimiento ?? ""}
                onChange={handle}
                className="pl-10 w-full border rounded py-2"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Rol</label>
            <select
              name="rol"
              value={form.rol.id}
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
          <div className="relative">
            <input
              name="password"
              type="password"
              value={form.password ?? ""}
              onChange={handle}
              className="pl-3 w-full border rounded py-2"
              placeholder="Contraseña"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
}

