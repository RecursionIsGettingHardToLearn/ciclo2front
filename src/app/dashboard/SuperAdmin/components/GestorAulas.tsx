import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import AxiosInstance from "@/components/AxiosInstance";
import { Aula, Modulo } from "@/app/modelos/Institucion";

interface Props {
  modulo: Modulo;
  onSave: (a: Aula) => void;
  onDelete: (id: number) => void;
}

export default function GestorAulas({ modulo, onSave, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState<Aula | null>(null);
  const [aulas, setAulas] = useState<Aula[]>([]);

  useEffect(() => {
    AxiosInstance.get("/institucion/listar-aulas/")
      .then(res => {
        const api: Aula[] = res.data
          .filter((a: any) => a.modulo === modulo.id)
          .map((a: any) => ({
            id: a.id,
            moduloId: a.modulo,
            nombre: a.nombre,
            capacidad: a.capacidad,
            estado: a.estado ? "Disponible" : "Ocupada",
            tipo: a.tipo,
            equipamiento: a.equipamiento,
            piso: a.piso,
          }));
        setAulas(api);
      })
      .catch(() => alert("No se pudieron cargar las aulas."));
  }, [modulo.id]);

  const visibles = aulas.filter(a =>
    `${a.nombre}${a.tipo}${a.estado}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-semibold">
        Aulas de {modulo.nombre}
      </h3>

      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 w-full border rounded py-2 px-3"
            placeholder="Filtrar..."
          />
        </div>
        <button
          onClick={() =>
            setEdit({
              id: 0,
              moduloId: modulo.id,
              nombre: "",
              capacidad: 1,
              estado: true,
              tipo: "AUL",
              equipamiento: "",
              piso: 1,
            })
          }
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <Plus className="w-4 h-4" /> Aula
        </button>
      </div>

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
                <td
                  colSpan={5}
                  className="px-3 py-6 text-center text-gray-500"
                >
                  Sin aulas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="border rounded p-4">
          <h4 className="font-medium mb-3">
            {edit.id ? "Editar" : "Nueva"} aula
          </h4>
          <div className="grid md:grid-cols-4 gap-4">
            {/* Aquí irían los campos de edición igual que antes */}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setEdit(null)}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onSave(edit);
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
