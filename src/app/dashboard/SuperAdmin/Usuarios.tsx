import AxiosInstance from "../../../components/AxiosInstance";
import UsuariosTable from "./components/UsuariosTable";
import UsuarioFormModal from "./components/UsuariosFormModal";
import { Usuario } from "../../modelos/Usuarios";
import { useState, useEffect } from "react";

export default function SuperAdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<keyof Usuario>("ci");
  const [asc, setAsc] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<Usuario | null>(null);

  // Carga inicial
  useEffect(() => {
    setLoading(true);
    AxiosInstance.get<Usuario[]>("/user/auth/listar-usuarios/")
      .then((res) => setUsuarios(res.data))
      .catch(() => setError("No se pudieron cargar los usuarios."))
      .finally(() => setLoading(false));
  }, []);

  // Ordenamiento
  const toggleSort = (key: keyof Usuario) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  };

  // Borra usuario
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await AxiosInstance.delete(`/user/auth/eliminar-usuario/${id}/`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Error al eliminar usuario.");
    }
  };

  // Abre modal en modo “nuevo” o “editar”
  const handleEdit = (u: Usuario | null) => {
    setEditUser(u);
    setModalOpen(true);
  };

  // Guarda cambios (crea o edita)
  const handleSave = (u: Usuario) => {
    // delegamos a UsuarioFormModal que devuelva el objeto completo
    const onSuccess = (updated: Usuario) => {
      setUsuarios((prev) =>
        updated.id
          ? prev.map((x) => (x.id === updated.id ? updated : x))
          : [...prev, updated]
      );
    };
    // simplemente cerramos el modal; la petición ya la hace el modal
    handleEdit(null);
    onSuccess(u);
  };

  return (
    <section className="p-6 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Usuarios</h1>
        <button
          onClick={() => handleEdit(null)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo
        </button>
      </header>

      {loading && <div className="text-center">Cargando…</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}

      {!loading && !error && (
        <UsuariosTable
          usuarios={usuarios}
          sortKey={sortKey}
          asc={asc}
          onToggleSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {modalOpen && (
        <UsuarioFormModal
          initial={editUser}
          onCancel={() => setModalOpen(false)}
          onSave={(u) => {
            handleSave(u);
            setModalOpen(false);
          }}
        />
      )}
    </section>
  );
}
