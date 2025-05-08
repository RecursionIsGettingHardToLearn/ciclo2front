// src/app/dashboard/SuperAdminUnidades.tsx

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, ChevronUp, ChevronDown } from "lucide-react";
import AxiosInstance from "../../components/AxiosInstance";

const emptyUnidad = {
  id: "",
  id_colegio: "",
  codigo_sie: "",
  turno: "",
  nivel: "",
  admin: "",
};

export default function SuperAdminUnidades() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUnidad, setEditUnidad] = useState(null);
  const [sort, setSort] = useState({ key: "codigo_sie", asc: true });

  const [colegios, setColegios] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    AxiosInstance.get("/institucion/listar-unidades-educativas/")
      .then(res => setRows(res.data))
      .catch(() => alert("Error al cargar unidades educativas"));

    AxiosInstance.get("/institucion/listar-colegios/")
      .then(res => setColegios(res.data))
      .catch(() => alert("Error al cargar colegios"));

    AxiosInstance.get("/user/auth/listar-superadmins/")
      .then(res => setAdmins(res.data))
      .catch(() => alert("Error al cargar administradores"));
  }, []);

  const sortBy = (k) => setSort(s => ({ key: k, asc: s.key === k ? !s.asc : true }));

  const ordered = [...rows].sort((a, b) => {
    const A = a[sort.key] ?? "", B = b[sort.key] ?? "";
    return sort.asc ? (A > B ? 1 : -1) : A < B ? 1 : -1;
  });

  const save = async (u) => {
    if (!u.id_colegio || !u.codigo_sie || !u.turno || !u.nivel || !u.admin) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    try {
      if (u.id) {
        await AxiosInstance.put(`/user/auth/editar-unidad/${u.id}/`, u);
        setRows(r => r.map(x => (x.id === u.id ? { ...x, ...u } : x)));
        alert("✅ Unidad actualizada.");
      } else {
        const res = await AxiosInstance.post("/institucion/crear-unidad/", u);
        setRows(r => [...r, res.data]);
        alert("✅ Unidad creada.");
      }
      setModalOpen(false);
    } catch (err) {
      alert("❌ Error al guardar unidad educativa.");
    }
  };

  const del = async (id) => {
    if (!confirm("¿Eliminar esta unidad educativa?")) return;
    try {
      await AxiosInstance.delete(`/institucion/eliminar-unidad-educativa/${id}/`);
      setRows(r => r.filter(x => x.id !== id));
      alert("✅ Unidad eliminada.");
    } catch (err) {
      alert("❌ Error al eliminar la unidad.");
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Unidades Educativas</h1>
        <button
          onClick={() => { setEditUnidad(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" /> Nueva
        </button>
      </header>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-100 text-blue-600">
            {["codigo_sie", "nivel", "turno"].map(k => (
              <th key={k} onClick={() => sortBy(k)} className="px-4 py-3 text-left cursor-pointer select-none">
                <span className="inline-flex items-center gap-1">
                  {k.replace("_", " ").toUpperCase()}
                  {sort.key === k && (sort.asc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                </span>
              </th>
            ))}
            <th className="px-4 py-3 text-right">Acciones</th>
          </thead>
          <tbody className="divide-y">
            {ordered.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">Sin unidades educativas</td>
              </tr>
            ) : ordered.map((u) => (
              <tr key={u.id} className="hover:bg-blue-50">
                <td className="px-4 py-3">{u.codigo_sie}</td>
                <td className="px-4 py-3">{u.nivel}</td>
                <td className="px-4 py-3">{u.turno}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setEditUnidad(u); setModalOpen(true); }}
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
        <UnidadFormModal
          initial={editUnidad}
          colegios={colegios}
          admins={admins}
          onCancel={() => setModalOpen(false)}
          onSave={save}
        />
      )}
    </section>
  );
}

function UnidadFormModal({ initial, colegios, admins, onCancel, onSave }) {
  const [form, setForm] = useState(initial ?? { ...emptyUnidad });

  const handle = (e) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-lg relative">
        <button onClick={onCancel} className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6">Formulario de Unidad Educativa</h2>

        <div className="grid gap-4">
          <div>
            <label className="block mb-1">Código SIE</label>
            <input
              name="codigo_sie"
              value={form.codigo_sie}
              onChange={handle}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1">Nivel</label>
            <select
              name="nivel"
              value={form.nivel}
              onChange={handle}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">— Selecciona —</option>
              <option value="Inicial">Inicial</option>
              <option value="Primaria">Primaria</option>
              <option value="Secundaria">Secundaria</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Turno</label>
            <select
              name="turno"
              value={form.turno}
              onChange={handle}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">— Selecciona —</option>
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
              <option value="Noche">Noche</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Colegio</label>
            <select
              name="id_colegio"
              value={form.id_colegio}
              onChange={handle}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">— Selecciona —</option>
              {colegios.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Administrador</label>
            <select
              name="admin"
              value={form.admin}
              onChange={handle}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">— Selecciona —</option>
              {admins.map(a => (
                <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
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
