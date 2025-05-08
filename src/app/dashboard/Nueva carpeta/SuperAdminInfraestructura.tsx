// src/app/dashboard/SuperAdminInfraestructura.tsx

import { useState, useEffect } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import AxiosInstance from "../../components/AxiosInstance";

const emptyModulo = { id: "", nombre: "", unidad_id: "" };
const emptyAula = { id: "", nombre: "", capacidad: "", modulo_id: "" };

export default function SuperAdminInfraestructura() {
  const [modulos, setModulos] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const [editModulo, setEditModulo] = useState(null);
  const [editAula, setEditAula] = useState(null);

  const [modalModuloOpen, setModalModuloOpen] = useState(false);
  const [modalAulaOpen, setModalAulaOpen] = useState(false);

  useEffect(() => {
    AxiosInstance.get("/institucion/listar-modulos/").then(res => setModulos(res.data));
    AxiosInstance.get("/institucion/listar-aulas/").then(res => setAulas(res.data));
    AxiosInstance.get("/institucion/listar-unidades-educativas/").then(res => setUnidades(res.data));
  }, []);

  const guardarModulo = async (m) => {
    try {
      if (m.id) {
        await AxiosInstance.put(`/institucion/editar-modulo/${m.id}/`, m);
        setModulos(prev => prev.map(x => (x.id === m.id ? { ...x, ...m } : x)));
        alert("✅ Módulo actualizado.");
      } else {
        const res = await AxiosInstance.post("/institucion/crear-modulo/", m);
        setModulos(prev => [...prev, res.data]);
        alert("✅ Módulo creado.");
      }
      setModalModuloOpen(false);
    } catch {
      alert("❌ Error al guardar módulo.");
    }
  };

  const guardarAula = async (a) => {
    try {
      if (a.id) {
        await AxiosInstance.put(`/institucion/editar-aula/${a.id}/`, a);
        setAulas(prev => prev.map(x => (x.id === a.id ? { ...x, ...a } : x)));
        alert("✅ Aula actualizada.");
      } else {
        const res = await AxiosInstance.post("/institucion/nuevo-aula/", a);
        setAulas(prev => [...prev, res.data]);
        alert("✅ Aula creada.");
      }
      setModalAulaOpen(false);
    } catch {
      alert("❌ Error al guardar aula.");
    }
  };

  const eliminarModulo = async (id) => {
    if (!confirm("¿Eliminar este módulo?")) return;
    try {
      await AxiosInstance.delete(`/institucion/eliminar-modulo/${id}/`);
      setModulos(m => m.filter(x => x.id !== id));
      alert("✅ Módulo eliminado.");
    } catch {
      alert("❌ Error al eliminar módulo.");
    }
  };

  const eliminarAula = async (id) => {
    if (!confirm("¿Eliminar esta aula?")) return;
    try {
      await AxiosInstance.delete(`/institucion/eliminar-aula/${id}/`);
      setAulas(a => a.filter(x => x.id !== id));
      alert("✅ Aula eliminada.");
    } catch {
      alert("❌ Error al eliminar aula.");
    }
  };

  return (
    <section className="space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Infraestructura</h1>
      </header>

      {/* Módulos */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Módulos</h2>
          <button
            onClick={() => { setEditModulo(null); setModalModuloOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Nuevo
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-blue-100 text-blue-600">
            <tr>
              <th className="text-left px-3 py-2">Nombre</th>
              <th className="text-left px-3 py-2">Unidad Educativa</th>
              <th className="text-right px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {modulos.map(m => (
              <tr key={m.id} className="hover:bg-blue-50">
                <td className="px-3 py-2">{m.nombre}</td>
                <td className="px-3 py-2">{unidades.find(u => u.id === m.unidad_id)?.codigo_sie || "—"}</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => { setEditModulo(m); setModalModuloOpen(true); }} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => eliminarModulo(m.id)} className="p-1 text-red-600 hover:bg-red-100 rounded ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Aulas */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Aulas</h2>
          <button
            onClick={() => { setEditAula(null); setModalAulaOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Nueva
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-blue-100 text-blue-600">
            <tr>
              <th className="text-left px-3 py-2">Nombre</th>
              <th className="text-left px-3 py-2">Capacidad</th>
              <th className="text-left px-3 py-2">Módulo</th>
              <th className="text-right px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {aulas.map(a => (
              <tr key={a.id} className="hover:bg-blue-50">
                <td className="px-3 py-2">{a.nombre}</td>
                <td className="px-3 py-2">{a.capacidad}</td>
                <td className="px-3 py-2">{modulos.find(m => m.id === a.modulo_id)?.nombre || "—"}</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => { setEditAula(a); setModalAulaOpen(true); }} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => eliminarAula(a.id)} className="p-1 text-red-600 hover:bg-red-100 rounded ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalModuloOpen && (
        <InfraModal
          type="Módulo"
          initial={editModulo}
          onCancel={() => setModalModuloOpen(false)}
          onSave={guardarModulo}
          unidades={unidades}
        />
      )}

      {modalAulaOpen && (
        <InfraModal
          type="Aula"
          initial={editAula}
          onCancel={() => setModalAulaOpen(false)}
          onSave={guardarAula}
          modulos={modulos}
        />
      )}
    </section>
  );
}

function InfraModal({ type, initial, onCancel, onSave, unidades = [], modulos = [] }) {
  const [form, setForm] = useState(initial ?? (type === "Módulo" ? { ...emptyModulo } : { ...emptyAula }));

  const handle = (e) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-lg relative">
        <button onClick={onCancel} className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6">Formulario de {type}</h2>

        <div className="grid gap-4">
          <div>
            <label className="block mb-1">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handle}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {type === "Aula" && (
            <div>
              <label className="block mb-1">Capacidad</label>
              <input
                name="capacidad"
                type="number"
                value={form.capacidad}
                onChange={handle}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          )}

          {type === "Módulo" && (
            <div>
              <label className="block mb-1">Unidad Educativa</label>
              <select
                name="unidad_id"
                value={form.unidad_id}
                onChange={handle}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">— Selecciona —</option>
                {unidades.map(u => (
                  <option key={u.id} value={u.id}>{u.codigo_sie}</option>
                ))}
              </select>
            </div>
          )}

          {type === "Aula" && (
            <div>
              <label className="block mb-1">Módulo</label>
              <select
                name="modulo_id"
                value={form.modulo_id}
                onChange={handle}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">— Selecciona —</option>
                {modulos.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
}
