// src/app/dashboard/components/UnidadFormModal.tsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Colegio, UnidadEducativa } from '@/app/modelos/Institucion';
import { Admin } from '@/app/modelos/Usuarios';


export interface FormState {
  id?: number;
  nombre: string;
  codigoSie: string;
  turno: UnidadEducativa['turno'];
  nivel: string;
  colegioId: number | null;
  direccion: string;
  telefono: string;
  adminId: number | null;
}


interface Props {
  open: boolean;
  initial: FormState;
  colegios: Colegio[];
  admins: Admin[];
  onClose: () => void;
  onSave: (data: FormState) => void;
}

export default function UnidadFormModal({
  open,
  initial,
  colegios,
  admins,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<FormState>(initial);
  const [adminQuery, setAdminQuery] = useState<string>('');

  // Cada vez que cambie el `initial`, reiniciamos el formulario
  useEffect(() => {
    setForm(initial);
    setAdminQuery('');
  }, [initial]);

  if (!open) return null;

  const handleSave = () => {
    // Validaciones básicas
    if (
      !form.nombre ||
      !form.codigoSie ||
      !form.turno ||
      !form.nivel ||
      form.colegioId == null
    ) {
      alert('Completa todos los campos obligatorios.');
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow-lg relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold">
          {form.id ? 'Editar unidad' : 'Nueva unidad'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="md:col-span-2">
            <label className="block mb-1">Nombre</label>
            <input
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="Ej. Don Bosco Central A"
            />
          </div>

          {/* Colegio */}
          <div>
            <label className="block mb-1">Colegio</label>
            <select
              value={form.colegioId ?? ''}
              onChange={e =>
                setForm({
                  ...form,
                  colegioId: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">— Selecciona —</option>
              {colegios.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Código SIE */}
          <div>
            <label className="block mb-1">Código SIE</label>
            <input
              value={form.codigoSie}
              onChange={e =>
                setForm({ ...form, codigoSie: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Turno */}
          <div>
            <label className="block mb-1">Turno</label>
            <select
              value={form.turno}
              onChange={e =>
                setForm({
                  ...form,
                  turno: e.target.value as FormState['turno'],
                })
              }
              className="w-full border rounded px-3 py-2"
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
            <label className="block mb-1">Nivel</label>
            <select
              value={form.nivel}
              onChange={e => setForm({ ...form, nivel: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">— Selecciona —</option>
              <option value="Inicial">Inicial</option>
              <option value="Primaria">Primaria</option>
              <option value="Secundaria">Secundaria</option>
            </select>
          </div>

          {/* Dirección */}
          <div>
            <label className="block mb-1">Dirección</label>
            <input
              value={form.direccion}
              onChange={e =>
                setForm({ ...form, direccion: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block mb-1">Teléfono</label>
            <input
              value={form.telefono}
              onChange={e =>
                setForm({ ...form, telefono: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Búsqueda de Admin por CI */}
          <div className="md:col-span-2">
            <label className="block mb-1">Buscar Admin (CI)</label>
            <input
              value={adminQuery}
              onChange={e => setAdminQuery(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Al menos 7 dígitos de CI"
            />
            {adminQuery.length >= 7 && (
              <ul className="border mt-1 max-h-32 overflow-y-auto rounded">
                {admins
                  .filter(a => a.usuario.ci.includes(adminQuery))
                  .map(a => (
                    <li
                      key={a.usuario.id}
                      onClick={() => {
                        setForm(f => ({ ...f, adminId: Number(a.usuario.id) }));
                        setAdminQuery(`${a.usuario.nombre} — ${a.usuario.ci}`);
                      }}
                      className="px-3 py-1 cursor-pointer hover:bg-blue-100"
                    >
                      {a.usuario.nombre} — {a.usuario.ci}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
