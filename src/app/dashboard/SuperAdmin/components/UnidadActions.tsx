import { Pencil, Trash2 } from 'lucide-react';

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

export default function UnidadActions({ onEdit, onDelete }: Props) {
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={onEdit}
        title="Editar"
        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        title="Eliminar"
        className="p-1 text-red-600 hover:bg-red-100 rounded"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
