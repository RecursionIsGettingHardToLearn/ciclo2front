import { useEffect, useState } from "react";
import AxiosInstance from "../../components/AxiosInstance";
import { Plus, Pencil, Trash2, X, ChevronUp, ChevronDown, Search } from "lucide-react";

export default function SuperAdminUnidades() {
  const [form, setForm] = useState({
    nombre: "",
    codigo_sie: "",
    turno: "",
    nivel: "",
    colegio_id: "",
    direccion: "",
    telefono: "",
    adminId: "",
    colegioId: "",
    codigoSie: "",
  });

  const [colegios, setColegios] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [adminQuery, setAdminQuery] = useState("");

  const [sort, setSort] = useState({ key: "nombre", asc: true });

  useEffect(() => {
    const cargarColegios = async () => {
      try {
        const res = await AxiosInstance.get("/institucion/listar-colegios/");
        setColegios(res.data);
      } catch (error) {
        console.error("Error al cargar colegios:", error);
      }
    };

    const cargarAdmins = async () => {
      try {
        const res = await AxiosInstance.get("/user/auth/listar-admins/");
        setAdmins(res.data);
      } catch (error) {
        console.error("Error al cargar admins:", error);
      }
    };

    cargarColegios();
    cargarAdmins();
  }, []);

  useEffect(() => {
    const cargarUnidades = async () => {
      try {
        const res = await AxiosInstance.get("/institucion/listar-unidades-educativas/");
        const data = res.data;
        const unidades = data.map((u) => ({
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

  const adminsFiltrados = adminQuery.length >= 7 ? admins.filter((a) => a.ci.includes(adminQuery)) : [];

  const nuevo = () => {
    setForm({ nombre: "", colegioId: "", adminId: "", codigoSie: "", turno: "", nivel: "", codigo_sie: "", direccion: "", telefono: "", colegio_id: "" });
    setAdminQuery("");
    setEdit(null);
    setOpen(true);
  };

  const editar = (u) => {
    setForm({
      nombre: u.nombre,
      colegioId: u.colegioId,
      adminId: u.adminId,
      codigoSie: u.codigoSie,
      turno: u.turno,
      nivel: u.nivel,
      direccion: u.direccion || "",
      telefono: u.telefono || "",
      codigo_sie: u.codigoSie,
      colegio_id: u.colegioId,
    });
    setAdminQuery(admins.find((a) => a.id === u.adminId)?.ci || "");
    setEdit(u);
    setOpen(true);
  };

  const guardarUnidad = async () => {
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

    if (!form.nombre || !form.codigoSie || !form.turno || !form.nivel || !form.colegioId) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      if (edit) {
        await AxiosInstance.put(`/institucion/editar-unidad-educativa/${edit.id}/`, payload);
        setRows((prev) => prev.map((row) => (row.id === edit.id ? { ...row, ...form } : row)));
        alert("Unidad educativa actualizada correctamente.");
      } else {
        const res = await AxiosInstance.post("/institucion/nueva-unidad-educativa/", payload);
        setRows((prev) => [...prev, { id: res.data.id, ...form }]);
        alert("Unidad educativa creada correctamente.");
      }
      setOpen(false);
      setEdit(null);
    } catch (error) {
      console.error("Error al guardar la unidad educativa:", error);
    }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta unidad educativa?")) return;
    try {
      await AxiosInstance.delete(`/institucion/eliminar-unidad-educativa/${id}/`);
      setRows((prev) => prev.filter((x) => x.id !== id));
      alert("Unidad educativa eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar unidad educativa:", error);
    }
  };

  const filas = [...rows].sort((a, b) => {
    const A = a[sort.key], B = b[sort.key];
    return sort.asc ? (A > B ? 1 : -1) : A < B ? 1 : -1;
  });

  const toggleSort = (key) => setSort((s) => ({ key, asc: s.key === key ? !s.asc : true }));

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">Unidades educativas</h2>
        <button onClick={nuevo} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          <Plus className="w-5 h-5" /> Nueva unidad
        </button>
      </header>

      {open && (
        <div className="bg-white p-6 rounded-xl shadow space-y-5 relative">
          <button onClick={() => setOpen(false)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-semibold">{edit ? "Editar" : "Nueva"} unidad</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="font-medium">Nombre de la unidad</label>
              <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} className="w-full border rounded-lg px-3 py-2" placeholder="Ej. Don Bosco Central A" />
            </div>
            <div>
              <label className="font-medium">Colegio</label>
              <select value={form.colegioId} onChange={e => setForm(f => ({ ...f, colegioId: e.target.value }))} className="w-full border rounded-lg px-3 py-2">
                <option value="">— Selecciona —</option>
                {colegios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="font-medium">Código SIE</label>
              <input value={form.codigoSie} onChange={e => setForm(f => ({ ...f, codigoSie: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="font-medium">Turno</label>
              <select value={form.turno} onChange={e => setForm(f => ({ ...f, turno: e.target.value }))} className="w-full border rounded-lg px-3 py-2">
                <option value="">— Selecciona —</option>
                <option value="MAÑANA">Mañana</option>
                <option value="TARDE">Tarde</option>
                <option value="NOCHE">Noche</option>
                <option value="COMPLETO">Jornada Completa</option>
              </select>
            </div>
            <div>
              <label className="font-medium">Nivel</label>
              <select value={form.nivel} onChange={e => setForm(f => ({ ...f, nivel: e.target.value }))} className="w-full border rounded-lg px-3 py-2">
                <option value="">— Selecciona —</option>
                {["Inicial", "Primaria", "Secundaria"].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            {/* en esta opcion adicionar  */}
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setOpen(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
            <button onClick={guardarUnidad} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Guardar</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50 text-blue-600 select-none">
            {[
              ["nombre", "Nombre unidad"],
              ["colegioId", "Colegio"],
              ["codigoSie", "Código SIE"],
              ["turno", "Turno"],
              ["nivel", "Nivel"],
              ["adminId", "Admin"],
            ].map(([key, label]) => {
              const active = sort.key === key;
              return (
                <th key={key} onClick={() => toggleSort(key)} className="px-4 py-3 text-left cursor-pointer">
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {active && (sort.asc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </span>
                </th>
              );
            })}
            <th className="px-4 py-3 text-right">Acciones</th>
          </thead>
          <tbody className="divide-y">
            {filas.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500">Sin unidades registradas</td></tr>
            ) : (
              filas.map(u => {
                const col = colegios.find(c => c.id === u.colegioId)?.nombre;
                const adm = admins.find(a => a.id === u.adminId);
                return (
                  <tr key={u.id} className="hover:bg-blue-50">
                    <td className="px-4 py-3">{u.nombre}</td>
                    <td className="px-4 py-3">{col}</td>
                    <td className="px-4 py-3">{u.codigoSie}</td>
                    <td className="px-4 py-3">{u.turno}</td>
                    <td className="px-4 py-3">{u.nivel}</td>
                    <td className="px-4 py-3">{adm?.nombre} — {adm?.ci}</td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      <button onClick={() => editar(u)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => eliminar(u.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
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
