// src/app/dashboard/SuperAdminColegios.tsx

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, ChevronUp, ChevronDown } from "lucide-react";
import AxiosInstance from "../../components/AxiosInstance";

const emptyColegio = {
  id: "",
  nombre: "",
  direccion: "",
  telefono: "",
  logo: null,
  id_superadmin: "",
};

export default function SuperAdminColegios() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editColegio, setEditColegio] = useState(null);
  const [sort, setSort] = useState({ key: "nombre", asc: true });

  useEffect(() => {
    AxiosInstance.get("/institucion/listar-colegios/")
      .then(res => setRows(res.data))
      .catch(() => alert("Error al cargar colegios"));
  }, []);

  const sortBy = (k) => setSort(s => ({ key: k, asc: s.key === k ? !s.asc : true }));

  const ordered = [...rows].sort((a, b) => {
    const A = a[sort.key] ?? "", B = b[sort.key] ?? "";
    return sort.asc ? (A > B ? 1 : -1) : A < B ? 1 : -1;
  });

  const save = async (c) => {
    if (!c.nombre || !c.telefono || !c.id_superadmin) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      const formData = new FormData();
      for (const key in c) {
        if (c[key] !== null && c[key] !== "") {
          formData.append(key, c[key]);
        }
      }

      if (c.id) {
        await AxiosInstance.put(`/institucion/editar-colegio/${c.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setRows(r => r.map(x => (x.id === c.id ? { ...x, ...c } : x)));
        alert("✅ Colegio actualizado correctamente.");
      } else {
        const res = await AxiosInstance.post("/institucion/crear-colegio/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setRows(r => [...r, res.data]);
        alert("✅ Colegio creado exitosamente.");
      }

      setModalOpen(false);
    } catch (err) {
      alert("❌ Error al guardar colegio.");
    }
  };

  const del = async (id) => {
    if (!confirm("¿Eliminar este colegio?")) return;
    try {
      await AxiosInstance.delete(`/institucion/eliminar-colegio/${id}/`);
      setRows(r => r.filter(x => x.id !== id));
      alert("✅ Colegio eliminado exitosamente.");
    } catch (err) {
      alert("❌ No se pudo eliminar el colegio.");
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Colegios</h1>
        <button
          onClick={() => { setEditColegio(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" /> Nuevo
        </button>
      </header>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-100 text-blue-600">
            {["nombre", "direccion", "telefono"].map(k => (
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
                <td colSpan={4} className="p-8 text-center text-gray-500">Sin colegios</td>
              </tr>
            ) : ordered.map((c) => (
              <tr key={c.id} className="hover:bg-blue-50">
                <td className="px-4 py-3">{c.nombre}</td>
                <td className="px-4 py-3">{c.direccion}</td>
                <td className="px-4 py-3">{c.telefono}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setEditColegio(c); setModalOpen(true); }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="Editar"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => del(c.id)}
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
        <ColegioFormModal
          initial={editColegio}
          onCancel={() => setModalOpen(false)}
          onSave={save}
        />
      )}
    </section>
  );
}

function ColegioFormModal({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial ?? { ...emptyColegio });
  const [superadmins, setSuperadmins] = useState([]);

  useEffect(() => {
    AxiosInstance.get("/user/auth/listar-superadmins/")
      .then(res => setSuperadmins(res.data))
      .catch(() => alert("Error al cargar superadmins."));
  }, []);

  const handle = (e) => {
    const { name, value, type, files } = e.currentTarget;
    setForm(f => ({ ...f, [name]: type === "file" && files ? files[0] : value }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-lg relative">
        <button onClick={onCancel} className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6">Formulario de Colegio</h2>

        <div className="grid gap-4">
          {["nombre", "direccion", "telefono"].map(k => (
            <div key={k}>
              <label className="block mb-1 capitalize">{k}</label>
              <input
                name={k}
                value={form[k]}
                onChange={handle}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}

          <div>
            <label className="block mb-1">Logo</label>
            <input
              type="file"
              accept="image/*"
              name="logo"
              onChange={handle}
              className="w-full border rounded px-3 py-2"
            />
            {form.logo && typeof form.logo !== "string" && (
              <img
                src={URL.createObjectURL(form.logo)}
                alt="preview"
                className="w-20 h-20 mt-2 rounded-full object-cover"
              />
            )}
          </div>

          <div>
            <label className="block mb-1">SuperAdmin</label>
            <select
              name="id_superadmin"
              value={form.id_superadmin}
              onChange={handle}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">— Selecciona —</option>
              {superadmins.map(sa => (
                <option key={sa.id} value={sa.id}>{sa.nombre} {sa.apellido}</option>
              ))}
            </select>
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
