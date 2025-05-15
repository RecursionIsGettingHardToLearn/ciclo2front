import { useState, useEffect } from 'react';
import AxiosInstance from '@/components/AxiosInstance';
import { Plus } from 'lucide-react';

import { Colegio, UnidadEducativa } from '@/app/modelos/Institucion';
import { Admin } from '@/app/modelos/Usuarios';
import { FormState } from './components/UnidadFormModal';
import { SortConfig } from './components/UnidadesTable';

import UnidadFormModal from './components/UnidadFormModal';
import UnidadesTable from './components/UnidadesTable';

export default function SuperAdminUnidades() {
  const [rows, setRows] = useState<UnidadEducativa[]>([]);
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const [open, setOpen] = useState(false);
  const [editUnit, setEditUnit] = useState<UnidadEducativa | null>(null);

  const [sort, setSort] = useState<SortConfig>({
    key: 'nombre',
    asc: true,
  });

  // Cargas iniciales...
  useEffect(() => {
    AxiosInstance.get<Colegio[]>('/institucion/listar-colegios/')
      .then(r => setColegios(r.data));
    AxiosInstance.get<Admin[]>('/user/auth/listar-admins/')
      .then(r => setAdmins(r.data));
    AxiosInstance.get<UnidadEducativa[]>('/institucion/listar-unidades-educativas/')
      .then(r => setRows(r.data));
  }, []);

  const handleSave = (f: FormState) => {
    // aquí posteas/pones y luego:
    if (editUnit) {
      setRows(rs =>
        rs.map(r => (r.id === f.id ? { ...r, ...f } : r))
      );
    } else {
      setRows(rs => [...rs, { id: Date.now(), ...f }]);
    }
    setOpen(false);
    setEditUnit(null);
  };

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">
          Unidades educativas
        </h2>
        <button
          onClick={() => {
            setEditUnit(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" /> Nueva unidad
        </button>
      </header>

      <UnidadesTable
        rows={rows}
        colegios={colegios}
        admins={admins}
        sort={sort}
        onToggleSort={k => setSort(s => ({ key: k, asc: s.key === k ? !s.asc : true }))}
        onEdit={u => {
          setEditUnit(u);
          setOpen(true);
        }}
        onDelete={id => setRows(rs => rs.filter(r => r.id !== id))}
      />

<UnidadFormModal
  open={open}
  initial={
        editUnit
          ? {
              id: editUnit.id,
              nombre: editUnit.nombre  ?? '',      // nunca undefined
              codigoSie: editUnit.codigoSie,       // siempre string
              turno: editUnit.turno,               // literal ok
              nivel: editUnit.nivel        ?? '',  // nunca undefined
              colegioId: editUnit.colegioId ?? null,
              direccion: editUnit.direccion ?? '',
              telefono: editUnit.telefono   ?? '',
              adminId: editUnit.adminId     ?? null,
            }
          : {
              nombre: '',
              codigoSie: '',
              turno: 'MAÑANA',
              nivel: '',
              colegioId: null,
              direccion: '',
              telefono: '',
              adminId: null,
            }
      }
      colegios={colegios}
      admins={admins}
      onClose={() => setOpen(false)}
      onSave={handleSave}
    />
    </section>
  );
}
