import { ChangeEvent, useState, useEffect } from "react";
import { X } from "lucide-react";
import { SuperAdmin } from "@/app/modelos/Usuarios";

export interface FormState {
  nombre: string;
  direccion: string;
  telefono: string;
  logoFile: File | null;
  logoPreview: string;
  usuario_id: string;
}

interface Props {
  initial?: FormState;
  superadmins: SuperAdmin[];
  onSave: (data: FormState) => void;
  onCancel: () => void;
}

const defaultForm: FormState = {
  nombre: "",
  direccion: "",
  telefono: "",
  logoFile: null,
  logoPreview: "",
  usuario_id: "",
};

export default function ColegioForm({
  initial = defaultForm,
  superadmins,
  onSave,
  onCancel,
}: Props) {
  const [form, setForm] = useState<FormState>(initial);

  // Resync if `initial` changes (e.j. al pasar de editar a nuevo)
  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(f => ({
      ...f,
      logoFile: file,
      logoPreview: file ? URL.createObjectURL(file) : f.logoPreview,
    }));
  };

  const handleSubmit = () => {
    if (!form.nombre.trim() || !form.direccion.trim()) {
      alert("Nombre y dirección son obligatorios");
      return;
    }
    onSave(form);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 relative space-y-4">
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-xl font-semibold">
        {initial !== defaultForm ? "Editar Colegio" : "Nuevo Colegio"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nombre del colegio"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block mb-1">Teléfono</label>
          <input
            value={form.telefono}
            onChange={e => setForm({ ...form, telefono: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="+591 7xxxxxxx"
          />
        </div>

        {/* Dirección */}
        <div className="md:col-span-2">
          <label className="block mb-1">Dirección</label>
          <input
            value={form.direccion}
            onChange={e => setForm({ ...form, direccion: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Av. Ejemplo 123"
          />
        </div>

        {/* Logo */}
        <div className="md:col-span-2">
          <label className="block mb-1">Logo</label>
          <div className="flex items-center gap-4">
            <label className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded cursor-pointer">
              Seleccionar archivo
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
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
          <label className="block mb-1">Superadmin</label>
          <select
            value={form.usuario_id}
            onChange={e => setForm({ ...form, usuario_id: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccione un Superadmin</option>
            {superadmins.map(sa => (
              <option key={sa.usuario.id} value={sa.usuario.id.toString()}>
                {sa.usuario.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
