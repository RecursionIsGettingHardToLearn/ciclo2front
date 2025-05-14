import React, { useEffect, useState, ChangeEvent } from "react";
import { Plus, Pencil, Trash, X } from "lucide-react";
import AxiosInstance from "../../components/AxiosInstance";

interface Colegio {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  logoUrl?: string;
}

interface Superadmin {
  id: number;
  nombre: string;
}

interface FormState {
  nombre: string;
  direccion: string;
  telefono: string;
  logoFile: File | null;
  logoPreview: string;
  usuario_id: string;
}

const SuperAdminColegios: React.FC = (): JSX.Element => {
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [superadmins, setSuperadmins] = useState<Superadmin[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editando, setEditando] = useState<Colegio | null>(null);
  const [form, setForm] = useState<FormState>({
    nombre: "",
    direccion: "",
    telefono: "",
    logoFile: null,
    logoPreview: "",
    usuario_id: "",
  });

  // Cargar lista de colegios
  useEffect(() => {
    const cargarColegios = async (): Promise<void> => {
      try {
        const res = await AxiosInstance.get<any[]>("/institucion/listar-colegios/");
        const data: Colegio[] = res.data.map((item) => ({
          id: String(item.id),
          nombre: item.nombre,
          direccion: item.direccion,
          telefono: item.telefono,
          logoUrl: item.logo
            ? `${AxiosInstance.defaults.baseURL}${item.logo}`
            : undefined,
        }));
        setColegios(data);
      } catch (err) {
        console.error("Error al cargar colegios:", err);
        alert("No se pudieron cargar los colegios.");
      }
    };
    cargarColegios();
  }, []);

  // Cargar superadmins
  useEffect(() => {
    const cargarSuperadmins = async (): Promise<void> => {
      try {
        const res = await AxiosInstance.get<any[]>("/user/auth/listar-superadmins/");
        const data: Superadmin[] = res.data.map((item) => ({
          id: Number(item.usuario_id),
          nombre: `${item.usuario.nombre} ${item.usuario.apellido}`,
        }));
        setSuperadmins(data);
      } catch (err) {
        console.error("Error al cargar superadmins:", err);
      }
    };
    cargarSuperadmins();
  }, []);

  // Abrir formulario en modo "nuevo"
  const abrirNuevo = (): void => {
    setForm({
      nombre: "",
      direccion: "",
      telefono: "",
      logoFile: null,
      logoPreview: "",
      usuario_id: "",
    });
    setEditando(null);
    setShowForm(true);
  };

  // Abrir formulario en modo "editar"
  const abrirEditar = (c: Colegio): void => {
    setForm({
      nombre: c.nombre,
      direccion: c.direccion,
      telefono: c.telefono,
      logoFile: null,
      logoPreview: c.logoUrl ?? "",
      usuario_id: "", // asume que lo obtendrás del objeto si lo necesitas
    });
    setEditando(c);
    setShowForm(true);
  };

  // Manejar cambio de archivo
  const onFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null;
    const preview = file ? URL.createObjectURL(file) : form.logoPreview;
    setForm((f) => ({ ...f, logoFile: file, logoPreview: preview }));
  };

  // Guardar o actualizar colegio
  const guardar = async (): Promise<void> => {
    if (!form.nombre.trim() || !form.direccion.trim()) {
      alert("Nombre y dirección son obligatorios.");
      return;
    }

    const payload = new FormData();
    payload.append("nombre", form.nombre);
    payload.append("direccion", form.direccion);
    payload.append("telefono", form.telefono);
    payload.append("usuario_id", form.usuario_id);
    if (form.logoFile) {
      payload.append("logo", form.logoFile);
    }

    try {
      if (editando) {
        await AxiosInstance.put(
          `/institucion/editar-colegio/${editando.id}/`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setColegios((prev) =>
          prev.map((c) =>
            c.id === editando.id
              ? {
                  ...c,
                  nombre: form.nombre,
                  direccion: form.direccion,
                  telefono: form.telefono,
                  logoUrl: form.logoPreview,
                }
              : c
          )
        );
      } else {
        const res = await AxiosInstance.post<Colegio>(
          "/institucion/nuevo-colegio/",
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setColegios((prev) => [...prev, res.data]);
        alert("✅ Colegio creado exitosamente");
      }
      setShowForm(false);
    } catch (err) {
      console.error("Error al guardar colegio:", err);
      alert("❌ Ocurrió un error al guardar el colegio.");
    }
  };

  // Eliminar colegio
  const borrar = async (id: string): Promise<void> => {
    if (!confirm("¿Seguro que deseas eliminar este colegio?")) return;
    try {
      await AxiosInstance.delete(`/institucion/eliminar-colegio/${id}/`);
      setColegios((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error al eliminar colegio:", err);
      alert("Ocurrió un error al eliminar el colegio.");
    }
  };

  return (
    <section className="space-y-6">
      {/* Cabecera */}
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">Colegios</h2>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <Plus className="w-5 h-5" /> Nuevo colegio
        </button>
      </header>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 relative">
          <button
            onClick={() => setShowForm(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-semibold mb-4">
            {editando ? "Editar colegio" : "Nuevo colegio"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block mb-1 font-medium">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) =>
                  setForm({ ...form, nombre: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Nombre del colegio"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block mb-1 font-medium">Teléfono</label>
              <input
                type="text"
                value={form.telefono}
                onChange={(e) =>
                  setForm({ ...form, telefono: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="+591 7xxxxxxx"
              />
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Dirección</label>
              <input
                type="text"
                value={form.direccion}
                onChange={(e) =>
                  setForm({ ...form, direccion: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Av. Ejemplo 123, Calle 45 Nº6"
              />
            </div>

            {/* Logo */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">
                Logo del colegio
              </label>
              <div className="flex items-center gap-4">
                <label className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg cursor-pointer">
                  Seleccionar archivo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                  />
                </label>
                {form.logoPreview && (
                  <img
                    src={form.logoPreview}
                    alt="Logo preview"
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                )}
              </div>
            </div>

            {/* Superadmin */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Superadmin</label>
              <select
                value={form.usuario_id}
                onChange={(e) =>
                  setForm({ ...form, usuario_id: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Seleccione un Superadmin</option>
                {superadmins.map((sa) => (
                  <option key={sa.id} value={sa.id.toString()}>
                    {sa.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={guardar}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50 text-blue-600">
            <tr>
              <th className="px-4 py-3 text-left">Logo</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Dirección</th>
              <th className="px-4 py-3 text-left">Teléfono</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {colegios.map((c) => (
              <tr key={c.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-4 py-3">
                  {c.logoUrl ? (
                    <img
                      src={c.logoUrl}
                      alt={`Logo de ${c.nombre}`}
                      className="w-10 h-10 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                      N/A
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">{c.nombre}</td>
                <td className="px-4 py-3">{c.direccion}</td>
                <td className="px-4 py-3">{c.telefono}</td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  <button
                    onClick={() => abrirEditar(c)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="Editar"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => borrar(c.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    title="Eliminar"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {colegios.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center space-y-4">
                    <p>Sin colegios registrados</p>
                    <button
                      onClick={async () => {
                        try {
                          const res = await AxiosInstance.get<any[]>(
                            "/institucion/listar-colegios/"
                          );
                          setColegios(res.data);
                        } catch (error) {
                          console.error("Error al recargar colegios:", error);
                          alert("No se pudieron recargar los colegios.");
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Recargar lista
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SuperAdminColegios;
