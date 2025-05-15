import { Pencil, Trash } from "lucide-react";
import { Colegio } from "@/app/modelos/Institucion";

interface Props {
  colegios: Colegio[];
  onEdit: (c: Colegio) => void;
  onDelete: (id: number) => void;
}

export default function ColegiosTable({
  colegios,
  onEdit,
  onDelete,
}: Props) {
  return (
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
          {colegios.map(c => (
            <tr key={c.id} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-3">
                {c.logo ? (
                  <img
                    src={c.logo}
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
                  onClick={() => onEdit(c)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  title="Editar"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(Number(c.id))}
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
                Sin colegios registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
