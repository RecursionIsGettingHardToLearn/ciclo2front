import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, X, Search,
} from "lucide-react";
import AxiosInstance from "../../components/AxiosInstance";


interface Colegio {
  id: string;
  nombre: string;
}

interface Modulo {
  id: string;
  colegioId: string;
  nombre: string;
  cantidadAulas: number;
}

interface Aula {
  id: string;
  moduloId: string;
  nombre: string;
  capacidad: number;
  estado: "Disponible" | "Ocupada";
  tipo: "Teórica" | "Laboratorio";
}

/* ╭────── Datos mock (reemplaza con fetch al backend) ─────╮ */
const COLEGIOS: Colegio[] = [{ id: "c1", nombre: "Don Bosco" }];
const TIPOS_AULA = [
  { value: "AUL", label: "Aula Regular" },
  { value: "LAB", label: "Laboratorio" },
  { value: "TAL", label: "Taller" },
  { value: "AUD", label: "Auditorio" },
  { value: "COM", label: "Sala de Computación" },
  { value: "GIM", label: "Gimnasio" },
  { value: "BIB", label: "Biblioteca" },
];


/* ╭──────────────── Componente principal ────────────────╮ */
export default function SuperAdminInfraestructura() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [modalMod, setModalMod] = useState<{ edit: Modulo | null } | null>(null);
  const [modalAulas, setModalAulas] = useState<{ mod: Modulo } | null>(null);


  useEffect(() => {
    AxiosInstance.get("institucion/listar-modulos/")
      .then(res => {
        const modulosApi = res.data.map((m: any) => ({
          id: String(m.id),
          colegioId: "c1", // Asigna el colegio correcto si viene en la respuesta
          nombre: m.nombre,
          cantidadAulas: m.cantidad_aulas,
        }));
        setModulos(modulosApi);
      })
      .catch(err => {
        console.error("Error al cargar módulos:", err);
        alert("No se pudieron cargar los módulos del servidor.");
      });
  }, []);

  const [colegios, setColegios] = useState<Colegio[]>([]);

  useEffect(() => {
    AxiosInstance.get("institucion/listar-colegios/")
      .then(res => {
        const colegiosApi = res.data.map((c: any) => ({
          id: String(c.id),
          nombre: c.nombre,
        }));
        setColegios(colegiosApi);
      })
      .catch(err => {
        console.error("Error al cargar colegios:", err);
        alert("No se pudieron cargar los colegios.");
      });
  }, []);


  const aulasDe = (modId: string) => aulas.filter(a => a.moduloId === modId);

  /* ───────── CRUD módulos ───────── */
  const saveModulo = (m: Modulo) => {
    if (!m.nombre || !m.colegioId) return alert("Completa los campos");

    if (m.id) {
      // Módulo existente → PUT
      AxiosInstance.put(
        `institucion/editar-modulo/${m.id}/`,
        {
          nombre: m.nombre,
          cantidad_aulas: m.cantidadAulas,
          descripcion: "", // si lo usas en el backend
        }
      )
      .then(() => {              //  <-- ya no hay `res`
        setModulos(list =>
          list.map(x => (x.id === m.id ? { ...m } : x))
        );
        setModalMod(null);
      })
      .catch(err => {
        console.error("Error al editar módulo", err);
        alert("No se pudo actualizar el módulo.");
      });
      
    } else {
      alert(`Datos a enviar:\n\nNombre: ${m.nombre}\nAulas: ${m.cantidadAulas}\nColegio ID: ${m.colegioId}`);
      // Módulo nuevo → POST
      AxiosInstance.post("institucion/nuevo-modulo/", {
        nombre: m.nombre,
        cantidad_aulas: m.cantidadAulas,
        descripcion: "", // opcional
        colegio_fk: m.colegioId, 
      })
        .then(res => {
          const nuevoModulo: Modulo = {
            id: String(res.data.id),
            colegioId: "c1", // O usa el que venga del backend si aplica
            nombre: res.data.nombre,
            cantidadAulas: res.data.cantidad_aulas,
          };
          setModulos(list => [...list, nuevoModulo]);
          setModalMod(null);
        })
        .catch(err => {
          console.error("Error al crear módulo", err);
          alert("No se pudo crear el módulo.");
        });
    }
  };

  const delModulo = (id: string) => {
    if (!confirm("¿Eliminar bloque y sus aulas?")) return;

    AxiosInstance.delete(`institucion/eliminar-modulo/${id}/`)
      .then(() => {
        // Si todo va bien, elimina del estado local
        setModulos(m => m.filter(x => x.id !== id));
        setAulas(a => a.filter(x => x.moduloId !== id));
      })
      .catch(err => {
        console.error("Error al eliminar módulo", err);
        alert("No se pudo eliminar el módulo.");
      });
  };

  /* ───────── CRUD aulas ───────── */
  const saveAula = (a: Aula) => {
    if (!a.nombre) return alert("El nombre del aula es obligatorio");

    if (!a.id || a.id.startsWith("temp-")) {
      const payload = {
        modulo: a.moduloId,
        nombre: a.nombre,
        capacidad: a.capacidad,
        estado: a.estado === "Disponible",
        tipo: a.tipo,
      };

      console.log("Enviando aula al backend:", payload);

      AxiosInstance.post("institucion/nuevo-aula/", payload)
        .then(res => {
          const nuevaAula: Aula = {
            id: String(res.data.id),
            moduloId: String(res.data.modulo),
            nombre: res.data.nombre,
            capacidad: res.data.capacidad,
            estado: res.data.estado ? "Disponible" : "Ocupada",
            tipo: res.data.tipo,
          };
          setAulas(list => [...list, nuevaAula]);
        })
        .catch(err => {
          console.error("Error al crear aula", err.response?.data || err);
          alert("No se pudo crear el aula.");
        });
    } else {

      const payload = {
        modulo: a.moduloId,
        nombre: a.nombre,
        capacidad: a.capacidad,
        estado: a.estado === "Disponible",
        tipo: a.tipo,
      };

      AxiosInstance.put(`institucion/editar-aula/${a.id}/`, payload)
        .then(res => {
          const aulaActualizada: Aula = {
            id: String(res.data.id),
            moduloId: String(res.data.modulo),
            nombre: res.data.nombre,
            capacidad: res.data.capacidad,
            estado: res.data.estado ? "Disponible" : "Ocupada",
            tipo: res.data.tipo,
          };
          setAulas(list =>
            list.map(x => (x.id === aulaActualizada.id ? aulaActualizada : x))
          );
        })
        .catch(err => {
          console.error("❌ Error al actualizar aula", err.response?.data || err);
          alert("No se pudo actualizar el aula.");
        });


    }
  };
  const delAula = (id: string) => {
    if (!confirm("¿Eliminar aula?")) return;

    AxiosInstance.delete(`institucion/eliminar-aula/${id}/`)
      .then(() => {
        setAulas(a => a.filter(x => x.id !== id));
      })
      .catch(err => {
        console.error("Error al eliminar aula", err);
        alert("No se pudo eliminar el aula.");
      });
  };

  /* ╭──────────────── UI principal ────────────────╮ */
  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">Infraestructura</h2>
        <button
          onClick={() => setModalMod({ edit: null })}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" /> Nuevo módulo
        </button>
      </header>

      {/* Tabla de módulos */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50 text-blue-600">
            <tr>
              <th className="px-4 py-3 text-left">Colegio</th>
              <th className="px-4 py-3 text-left">Módulo</th>
              <th className="px-4 py-3 text-left">Aulas</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {modulos.map(m => {
              const colegio = COLEGIOS.find(c => c.id === m.colegioId)?.nombre;
              const total = aulasDe(m.id).length;
              return (
                <tr key={m.id}>
                  <td className="px-4 py-3">{colegio}</td>
                  <td className="px-4 py-3">{m.nombre}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setModalAulas({ mod: m })}
                      className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs hover:bg-blue-200"
                    >
                      {total}/{m.cantidadAulas} &nbsp;Administrar
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => setModalMod({ edit: m })}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => delModulo(m.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {modulos.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Sin módulos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal módulo */}
      {modalMod && (
        <Modal onClose={() => setModalMod(null)}>
          <FormModulo
            colegios={colegios}
            initial={modalMod.edit}
            onCancel={() => setModalMod(null)}
            onSave={saveModulo}
          />
        </Modal>
      )}

      {/* Modal gestor de aulas */}
      {modalAulas && (
        <Modal onClose={() => setModalAulas(null)}>
          <GestorAulas
            modulo={modalAulas.mod}
            aulas={aulasDe(modalAulas.mod.id)}
            onSave={saveAula}
            onDelete={delAula}
          />
        </Modal>
      )}
    </section>
  );
}

/* ╭───────────── Modal genérico ─────────────╮ */
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ╭───────────── Formulario módulo ───────────╮ */
function FormModulo({
  colegios,
  initial,
  onSave,
  onCancel,
}: {
  colegios: Colegio[];
  initial: Modulo | null;
  onSave: (m: Modulo) => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState<Modulo>(
    initial ?? { id: "", colegioId: "", nombre: "", cantidadAulas: 0 },
  );
  const save = () =>
    !f.colegioId || !f.nombre
      ? alert("Completa los campos")
      : onSave(f);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{initial ? "Editar" : "Nuevo"} módulo</h3>
      <div>
        <label className="block mb-1">Colegio</label>
        <select
          value={f.colegioId}
          onChange={e => setF({ ...f, colegioId: e.target.value })}
          className="w-full border rounded py-2 px-3"
        >
          <option value="">— Selecciona —</option>
          {colegios.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Nombre módulo</label>
        <input
          value={f.nombre}
          onChange={e => setF({ ...f, nombre: e.target.value })}
          className="w-full border rounded py-2 px-3"
        />
      </div>
      <div>
        <label className="block mb-1">Capacidad planificada de aulas</label>
        <input
          type="number"
          min={0}
          value={f.cantidadAulas}
          onChange={e => setF({ ...f, cantidadAulas: Number(e.target.value) })}
          className="w-full border rounded py-2 px-3"
        />
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 border rounded">
          Cancelar
        </button>
        <button onClick={save} className="px-6 py-2 bg-blue-600 text-white rounded">
          Guardar
        </button>
      </div>
    </div>
  );
}

function GestorAulas({
  modulo,
  // aulas,
  onSave,
  onDelete,
}: {
  modulo: Modulo;
  aulas: Aula[];
  onSave: (a: Aula) => void;
  onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState<Aula | null>(null);
  const [loadedAulas, setLoadedAulas] = useState<Aula[]>([]);

  useEffect(() => {
    AxiosInstance.get("institucion/listar-aulas/")
      .then(res => {
        console.log("▶️ Aulas desde el backend:", res.data);
        const aulasApi: Aula[] = res.data
          .filter((a: any) => a.modulo === Number(modulo.id))
          .map((a: any) => ({
            id: String(a.id),
            moduloId: String(a.modulo),
            nombre: a.nombre,
            capacidad: a.capacidad,
            estado: a.estado ? "Disponible" : "Ocupada",
            tipo: a.tipo,
          }));
        setLoadedAulas(aulasApi);
      })
      .catch(err => {
        console.error("❌ Error al cargar aulas", err);
      });
  }, [modulo.id]);
  const visibles = loadedAulas.filter(a =>
    `${a.nombre}${a.tipo}${a.estado}`.toLowerCase().includes(search.toLowerCase())
  );

 /* const handleSave = (a: Aula) => {
    onSave(a);
    setLoadedAulas(prev =>
      prev.find(x => x.id === a.id)
        ? prev.map(x => (x.id === a.id ? a : x))
        : [...prev, a]
    );
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setLoadedAulas(prev => prev.filter(x => x.id !== id));
  }; */

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-semibold">Aulas de {modulo.nombre}</h3>

      {/* buscador y botón nuevo */}
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 w-full border rounded py-2 px-3"
            placeholder="Filtrar por nombre / tipo / estado"
          />
        </div>
        <button
          onClick={() =>
            setEdit({
              id: "",
              moduloId: modulo.id,
              nombre: "",
              capacidad: 0,
              estado: "Disponible",
              tipo: "Teórica",
            })
          }
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <Plus className="w-4 h-4" /> Aula
        </button>
      </div>

      {/* tabla aulas */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-xs">
          <thead className="bg-blue-50 text-blue-600">
            <tr>
              <th className="px-3 py-2 text-left">Nombre</th>
              <th className="px-3 py-2 text-left">Tipo</th>
              <th className="px-3 py-2 text-left">Capacidad</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {visibles.map(a => (
              <tr key={a.id}>
                <td className="px-3 py-2">{a.nombre}</td>
                <td className="px-3 py-2">{a.tipo}</td>
                <td className="px-3 py-2">{a.capacidad}</td>
                <td className="px-3 py-2">{a.estado}</td>
                <td className="px-3 py-2 text-right flex gap-1 justify-end">
                  <button
                    onClick={() => setEdit(a)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDelete(a.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                  Sin aulas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* formulario aula inline */}
      {edit && (
        <div className="border rounded p-4">
          <h4 className="font-medium mb-3">{edit.id ? "Editar" : "Nueva"} aula</h4>
          <div className="grid md:grid-cols-4 gap-4">
            {/* Nombre */}
            <div>
              <label className="block mb-1">Nombre</label>
              <input
                value={edit.nombre}
                onChange={e => setEdit({ ...edit!, nombre: e.target.value })}
                className="w-full border rounded py-2 px-3"
                placeholder="Ej. A‑101"
              />
            </div>
            {/* Tipo */}
            <div>
              <label className="block mb-1">Tipo</label>
              <select
                value={edit.tipo}
                onChange={e => setEdit({ ...edit!, tipo: e.target.value as any })}
                className="w-full border rounded py-2 px-3"
              >
                <option value="">— Selecciona —</option>
                {TIPOS_AULA.map(op => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Capacidad */}
            <div>
              <label className="block mb-1">Capacidad</label>
              <input
                type="number"
                min={1}
                value={edit.capacidad}
                onChange={e => setEdit({ ...edit!, capacidad: Number(e.target.value) })}
                className="w-full border rounded py-2 px-3"
              />
            </div>
            {/* Estado */}
            <div>
              <label className="block mb-1">Estado</label>
              <select
                value={edit.estado}
                onChange={e => setEdit({ ...edit!, estado: e.target.value as any })}
                className="w-full border rounded py-2 px-3"
              >
                <option value="true">Disponible</option>
                <option value="false">Ocupada</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setEdit(null)} className="px-4 py-2 border rounded">
              Cancelar
            </button>
            <button
              onClick={() => {
                onSave(edit!);
                setEdit(null);
              }}
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
