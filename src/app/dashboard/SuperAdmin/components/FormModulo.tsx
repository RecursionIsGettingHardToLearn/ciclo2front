import { useState } from "react";
import { Colegio, Modulo } from "@/app/modelos/Institucion";

interface Props {
  colegios: Colegio[];
  initial: Modulo | null;
  onSave: (m: Modulo) => void;
  onCancel: () => void;
}

export default function FormModulo({ colegios, initial, onSave, onCancel }: Props) {
  const [f, setF] = useState<Modulo>(
    initial ?? { id: 0, colegioId: 0, nombre: "", cantidadAulas: 0 }
  );

  const handleSave = () => {
    if (!f.nombre || !f.colegioId) {
      alert("Completa los campos");
      return;
    }
    onSave(f);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">
        {initial ? "Editar" : "Nuevo"} módulo
      </h3>

      <div>
        <label className="block mb-1">Colegio</label>
        <select
          value={String(f.colegioId)}
          onChange={e =>
            setF({ ...f, colegioId: Number(e.target.value) })
          }
          className="w-full border rounded py-2 px-3"
        >
          <option value="">— Selecciona —</option>
          {colegios.map(c => (
            <option key={c.id} value={String(c.id)}>
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
        <label className="block mb-1">Aulas planificadas</label>
        <input
          type="number"
          min={1}
          value={f.cantidadAulas}
          onChange={e =>
            setF({ ...f, cantidadAulas: Number(e.target.value) })
          }
          className="w-full border rounded py-2 px-3"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 border rounded">
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
  );
}
