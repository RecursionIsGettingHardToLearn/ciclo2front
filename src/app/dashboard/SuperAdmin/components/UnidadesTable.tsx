import { ChevronUp, ChevronDown } from 'lucide-react';
import { Colegio, UnidadEducativa } from '@/app/modelos/Institucion';
import { Admin } from '@/app/modelos/Usuarios';
import UnidadActions from './UnidadActions';

export interface SortConfig {
  key: keyof UnidadEducativa;
  asc: boolean;
}

interface Props {
  rows: UnidadEducativa[];
  colegios: Colegio[];
  admins: Admin[];
  sort: SortConfig;
  onToggleSort: (key: keyof UnidadEducativa) => void;
  onEdit: (u: UnidadEducativa) => void;
  onDelete: (id: number) => void;
}

export default function UnidadesTable({
  rows,
  colegios,
  admins,
  sort,
  onToggleSort,
  onEdit,
  onDelete,
}: Props) {
  const sorted = [...rows].sort((a, b) => {
    const A = a[sort.key] ?? '';
    const B = b[sort.key] ?? '';
    return sort.asc ? (A > B ? 1 : -1) : A < B ? 1 : -1;
  });

  const headers: Array<[keyof UnidadEducativa, string]> = [
    ['nombre', 'Nombre'],
    ['colegioId', 'Colegio'],
    ['codigoSie', 'Código SIE'],
    ['turno', 'Turno'],
    ['nivel', 'Nivel'],
    ['adminId', 'Admin'],
  ];

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-blue-50 text-blue-600 select-none">
          <tr>
            {headers.map(([key, label]) => {
              const active = sort.key === key;
              return (
                <th
                  key={key}
                  onClick={() => onToggleSort(key)}
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
          </tr>
        </thead>
        <tbody className="divide-y">
          {sorted.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length + 1}
                className="p-8 text-center text-gray-500"
              >
                Sin unidades registradas
              </td>
            </tr>
          ) : (
            sorted.map(u => {
              const colegio = colegios.find(c => c.id === Number(u.colegioId))
                ?.nombre;
              const admin = admins.find(a => a.usuario.id === Number(u.adminId));
              return (
                <tr key={u.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3">{u.nombre}</td>
                  <td className="px-4 py-3">{colegio}</td>
                  <td className="px-4 py-3">{u.codigoSie}</td>
                  <td className="px-4 py-3">{u.turno}</td>
                  <td className="px-4 py-3">{u.nivel}</td>
                  <td className="px-4 py-3">
                    {admin?.usuario.nombre} — {admin?.usuario.ci}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <UnidadActions
                      onEdit={() => onEdit(u)}
                      onDelete={() => onDelete(u.id)}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
