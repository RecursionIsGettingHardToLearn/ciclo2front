import { useEffect, useState } from "react";
import AxiosInstance from "../../components/AxiosInstance";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// --- Interfaces y tipos ---
interface Colegio {
  id: string;
  nombre: string;
}

interface Admin {
  id: string;
  nombre: string;
  ci: string;
}

interface UnidadRow {
  id: string;
  nombre: string;
  colegioId: string;
  adminId: string;
  codigoSie: string;
  turno: string;
  nivel: string;
  direccion?: string;
  telefono?: string;
}

interface FormState {
  nombre: string;
  codigoSie: string;
  turno: string;
  nivel: string;
  colegioId: string;
  direccion: string;
  telefono: string;
  adminId: string;
}

type SortConfig = {
  key: keyof UnidadRow;
  asc: boolean;
};

// --- Componente ---
export default function SuperAdminUnidades(): JSX.Element {
  // Estado del formulario
  const [form, setForm] = useState<FormState>({
    nombre: "",
    codigoSie: "",
    turno: "",
    nivel: "",
    colegioId: "",
    direccion: "",
    telefono: "",
    adminId: "",
  });

  // Listas de datos
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [rows, setRows] = useState<UnidadRow[]>([]);

  // UI state
  const [open, setOpen] = useState<boolean>(false);
  const [edit, setEdit] = useState<UnidadRow | null>(null);
  const [adminQuery, setAdminQuery] = useState<string>("");

  // Configuración de ordenamiento
  const [sort, setSort] = useState<SortConfig>({ key: "nombre", asc: true });

  // Carga inicial de colegios y admins
  useEffect(() => {
    const cargarColegios = async (): Promise<void> => {
      try {
        const res = await AxiosInstance.get<Colegio[]>(
          "/institucion/listar-colegios/"
        );
        setColegios(res.data);
      } catch (error) {
        console.error("Error al cargar colegios:", error);
      }
    };

    const cargarAdmins = async (): Promise<void> => {
      try {
        const res = await AxiosInstance.get<Admin[]>(
          "/user/auth/listar-admins/"
        );
        setAdmins(res.data);
      } catch (error) {
        console.error("Error al cargar admins:", error);
      }
    };

    cargarColegios();
    cargarAdmins();
  }, []);

  // Carga inicial de unidades educativas
  useEffect(() => {
    const cargarUnidades = async (): Promise<void> => {
      try {
        const res = await AxiosInstance.get<any[]>(
          "/institucion/listar-unidades-educativas/"
        );
        const unidades = res.data.map((u) => ({
          id: String(u.id),
          nombre: u.nombre || "—",
          colegioId: u.colegio?.id || "",
          adminId: String(u.administrador_id || ""),
          codigoSie: u.codigo_sie,
          turno: u.turno,
          nivel: u.nivel,
          direccion: u.direccion,
          telefono: u.telefono,
        }));
        setRows(unidades);
      } catch (error) {
        console.error("Error al cargar unidades educativas:", error);
      }
    };
    cargarUnidades();
  }, []);

  // Filtrado de admins por CI
  /* const adminsFiltrados = adminQuery.length >= 7
    ? admins.filter((a) => a.ci.includes(adminQuery))
    : []; */

  // Iniciar creación de nueva unidad
  const nuevo = (): void => {
    setForm({
      nombre: "",
      codigoSie: "",
      turno: "",
      nivel: "",
      colegioId: "",
      direccion: "",
      telefono: "",
      adminId: "",
    });
    setAdminQuery("");
    setEdit(null);
    setOpen(true);
  };

  // Preparar edición de unidad existente
  const editar = (u: UnidadRow): void => {
    setForm({
      nombre: u.nombre,
      codigoSie: u.codigoSie,
      turno: u.turno,
      nivel: u.nivel,
      colegioId: u.colegioId,
      direccion: u.direccion || "",
      telefono: u.telefono || "",
      adminId: u.adminId,
    });
    setAdminQuery(admins.find((a) => a.id === u.adminId)?.ci || "");
    setEdit(u);
    setOpen(true);
  };

  // Guardar o actualizar unidad
  const guardarUnidad = async (): Promise<void> => {
    if (
      !form.nombre ||
      !form.codigoSie ||
      !form.turno ||
      !form.nivel ||
      !form.colegioId
    ) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const payload = {
      nombre: form.nombre,
      nivel: form.nivel,
      codigo_sie: form.codigoSie,
      turno: form.turno,
      colegio: form.colegioId,
      direccion: form.direccion,
      telefono: form.telefono,
      administrador_id: form.adminId,
    };

    try {
      if (edit) {
        await AxiosInstance.put(
          `/institucion/editar-unidad-educativa/${edit.id}/`,
          payload
        );
        setRows((prev) =>
          prev.map((row) =>
            row.id === edit.id ? { ...row, ...form } : row
          )
        );
        alert("Unidad educativa actualizada correctamente.");
      } else {
        const res = await AxiosInstance.post<{ id: string }>(
          "/institucion/nueva-unidad-educativa/",
          payload
        );
        setRows((prev) => [...prev, { id: res.data.id, ...form }]);
        alert("Unidad educativa creada correctamente.");
      }
      setOpen(false);
      setEdit(null);
    } catch (error) {
      console.error("Error al guardar la unidad educativa:", error);
    }
  };

  // Eliminar unidad
  const eliminar = async (id: string): Promise<void> => {
    if (!confirm("¿Seguro que deseas eliminar esta unidad educativa?"))
      return;
    try {
      await AxiosInstance.delete(
        `/institucion/eliminar-unidad-educativa/${id}/`
      );
      setRows((prev) => prev.filter((x) => x.id !== id));
      alert("Unidad educativa eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar unidad educativa:", error);
    }
  };

  // Ordenar filas
  const filasOrdenadas = [...rows].sort((a, b) => {
    const A = a[sort.key] ?? "";
    const B = b[sort.key] ?? "";
    return sort.asc
      ? (A > B ? 1 : -1)
      : (A < B ? 1 : -1);
  });

  const toggleSort = (key: keyof UnidadRow): void =>
    setSort((s) => ({
      key,
      asc: s.key === key ? !s.asc : true,
    }));

  // --- Renderizado ---
  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">
          Unidades educativas
        </h2>
        <button
          onClick={nuevo}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" /> Nueva unidad
        </button>
      </header>

      {/* Modal de formulario */}
      {open && (
        <div className="bg-white p-6 rounded-xl shadow space-y-5 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-semibold">
            {edit ? "Editar" : "Nueva"} unidad
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="font-medium">
                Nombre de la unidad
              </label>
              <input
                value={form.nombre}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    nombre: e.target.value,
                  }))
                }
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ej. Don Bosco Central A"
              />
            </div>
            {/* Colegio */}
            <div>
              <label className="font-medium">Colegio</label>
              <select
                value={form.colegioId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    colegioId: e.target.value,
                  }))
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">— Selecciona —</option>
                {colegios.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            {/* Código SIE */}
            <div>
              <label className="font-medium">Código SIE</label>
              <input
                value={form.codigoSie}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    codigoSie: e.target.value,
                  }))
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            {/* Turno */}
            <div>
              <label className="font-medium">Turno</label>
              <select
                value={form.turno}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    turno: e.target.value,
                  }))
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">— Selecciona —</option>
                <option value="MAÑANA">Mañana</option>
                <option value="TARDE">Tarde</option>
                <option value="NOCHE">Noche</option>
                <option value="COMPLETO">Jornada Completa</option>
              </select>
            </div>
            {/* Nivel */}
            <div>
              <label className="font-medium">Nivel</label>
              <select
                value={form.nivel}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    nivel: e.target.value,
                  }))
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">— Selecciona —</option>
                {["Inicial", "Primaria", "Secundaria"].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
            {/* Dirección y Teléfono */}
            <div>
              <label className="font-medium">Dirección</label>
              <input
                value={form.direccion}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    direccion: e.target.value,
                  }))
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="font-medium">Teléfono</label>
              <input
                value={form.telefono}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    telefono: e.target.value,
                  }))
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Búsqueda de Admin por CI */}
         <div className="md:col-span-2">
           <label className="font-medium">Buscar Admin (CI)</label>
           <input
             type="text"
             value={adminQuery}
             onChange={e => setAdminQuery(e.currentTarget.value)}
             className="w-full border rounded-lg px-3 py-2"
             placeholder="Empieza a escribir al menos 7 dígitos de CI"
           />
           {adminQuery.length >= 7 && (
             <ul className="border mt-1 max-h-32 overflow-auto rounded-lg">
               {admins
                 .filter(a => a.ci.includes(adminQuery))
                 .map(a => (
                   <li
                     key={a.id}
                     onClick={() => {
                       setForm(f => ({ ...f, adminId: a.id }));
                       setAdminQuery(`${a.nombre} — ${a.ci}`);
                     }}
                     className="px-3 py-1 cursor-pointer hover:bg-blue-100"
                   >
                     {a.nombre} — {a.ci}
                   </li>
                 ))
               }
             </ul>
           )}
         </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={guardarUnidad}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Tabla de unidades */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50 text-blue-600 select-none">
            {(
              [
                ["nombre", "Nombre unidad"],
                ["colegioId", "Colegio"],
                ["codigoSie", "Código SIE"],
                ["turno", "Turno"],
                ["nivel", "Nivel"],
                ["adminId", "Admin"],
              ] as Array<[keyof UnidadRow, string]>
            ).map(([key, label]) => {
              const active = sort.key === key;
              return (
                <th
                  key={key}
                  onClick={() => toggleSort(key)}
                  className="px-4 py-3 text-left cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {active &&
                      (sort.asc ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </span>
                </th>
              );
            })}
            <th className="px-4 py-3 text-right">Acciones</th>
          </thead>
          <tbody className="divide-y">
            {filasOrdenadas.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Sin unidades registradas
                </td>
              </tr>
            ) : (
              filasOrdenadas.map((u) => {
                const col = colegios.find((c) => c.id === u.colegioId)
                  ?.nombre;
                const adm = admins.find((a) => a.id === u.adminId);
                return (
                  <tr key={u.id} className="hover:bg-blue-50">
                    <td className="px-4 py-3">{u.nombre}</td>
                    <td className="px-4 py-3">{col}</td>
                    <td className="px-4 py-3">{u.codigoSie}</td>
                    <td className="px-4 py-3">{u.turno}</td>
                    <td className="px-4 py-3">{u.nivel}</td>
                    <td className="px-4 py-3">
                      {adm?.nombre} — {adm?.ci}
                    </td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      <button
                        onClick={() => editar(u)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => eliminar(u.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
