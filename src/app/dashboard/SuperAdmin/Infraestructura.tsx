import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AxiosInstance from "@/components/AxiosInstance";
import { Colegio, Modulo, Aula } from "@/app/modelos/Institucion";

import Modal from "./components/Modal";
import FormModulo from "./components/FormModulo";
import GestorAulas from "./components/GestorAulas";

export default function SuperAdminInfraestructura() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [modalMod, setModalMod] = useState<Modulo | null>(null);
  const [modalAulas, setModalAulas] = useState<Modulo | null>(null);
  const [colegios, setColegios] = useState<Colegio[]>([]);

  useEffect(() => {
    AxiosInstance.get<Colegio[]>("/institucion/listar-colegios/")
      .then(res => setColegios(res.data))
      .catch(() => alert("No se pudieron cargar los colegios."));
  }, []);


  useEffect(() => {
    AxiosInstance.get("/institucion/listar-modulos/")
      .then(res =>
        setModulos(
          res.data.map((m: any) => ({
            id: m.id,
            colegioId: m.colegio_fk,
            nombre: m.nombre,
            cantidadAulas: m.cantidad_aulas,
          }))
        )
      )
      .catch(() => alert("No se pudieron cargar los módulos."));
  }, []);

  const aulasDe = (modId: number) =>
    aulas.filter(a => a.moduloId === modId);

  const saveModulo = async (m: Modulo) => {
    try {
      if (m.id && m.id > 0) {
        // ── EDITAR ──
        const res = await AxiosInstance.put<{
          id: number;
          nombre: string;
          cantidad_aulas: number;
          colegio_fk: number;
        }>(`/institucion/editar-modulo/${m.id}/`, {
          nombre: m.nombre,
          cantidad_aulas: m.cantidadAulas,
          colegio_fk: m.colegioId,
        });
  
        // Actualizar en el estado local
        setModulos((prev) =>
          prev.map((x) =>
            x.id === m.id
              ? {
                  id: res.data.id,
                  nombre: res.data.nombre,
                  cantidadAulas: res.data.cantidad_aulas,
                  colegioId: res.data.colegio_fk,
                }
              : x
          )
        );
        alert("Módulo actualizado exitosamente.");
      } else {
        // ── CREAR ──
        const res = await AxiosInstance.post<{
          id: number;
          nombre: string;
          cantidad_aulas: number;
          colegio_fk: number;
        }>(`/institucion/crear-modulo/`, {
          nombre: m.nombre,
          cantidad_aulas: m.cantidadAulas,
          colegio_fk: m.colegioId,
        });
  
        // Añadir al estado local
        setModulos((prev) => [
          ...prev,
          {
            id: res.data.id,
            nombre: res.data.nombre,
            cantidadAulas: res.data.cantidad_aulas,
            colegioId: res.data.colegio_fk,
          },
        ]);
        alert("Módulo creado exitosamente.");
      }
  
      // Cerrar modal
      setModalMod(null);
    } catch (err: any) {
      console.error("Error al guardar módulo:", err);
      const detail = err.response?.data;
      if (detail && typeof detail === "object") {
        const msgs = Object.entries(detail)
        .map(([, m]) => Array.isArray(m) ? m.join(", ") : m)
        .join("\n");
        alert("Errores:\n" + msgs);
      } else {
        alert("Error inesperado al guardar módulo.");
      }
    }
  };
  
  // Función para eliminar un módulo
  const delModulo = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este módulo?")) return;
    try {
      await AxiosInstance.delete(`/institucion/eliminar-modulo/${id}/`);
  
      // Filtrar del estado local
      setModulos((prev) => prev.filter((x) => x.id !== id));
      alert("Módulo eliminado exitosamente.");
    } catch (err) {
      console.error("Error al eliminar módulo:", err);
      alert("Error al eliminar el módulo.");
    }
  };

  const saveAula = async (a: Aula) => {
    if (a.id) {
      // edición
      const res = await AxiosInstance.put<Aula>(
        `/institucion/editar-aula/${a.id}/`,
        a
      );
      setAulas(prev =>
        prev.map(x => (x.id === res.data.id ? res.data : x))
      );
    } else {
      // creación
      const res = await AxiosInstance.post<Aula>(
        `/institucion/crear-aula/`,
        { ...a, modulo: modalAulas!.id }
      );
      setAulas(prev => [...prev, res.data]);
    }
  };
  
  const delAula = async (id: number) => {
    await AxiosInstance.delete(`/institucion/eliminar-aula/${id}/`);
    setAulas(prev => prev.filter(x => x.id !== id));
  };

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">
          Infraestructura
        </h2>
        <button
          onClick={() => setModalMod({ id: 0, colegioId: 0, nombre: "", cantidadAulas: 0 })}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" /> Nuevo módulo
        </button>
      </header>

      {/* Tabla de módulos inline */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50 text-blue-600">
            <tr>
              <th className="px-4 py-3 text-left">Colegio</th>
              <th className="px-4 py-3 text-left">Módulo</th>
              <th className="px-4 py-3 text-left">Aulas</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {modulos.map(m => (
              <tr key={m.id}>
                <td className="px-4 py-3">{m.colegioId}</td>
                <td className="px-4 py-3">{m.nombre}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setModalAulas(m)}
                    className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs hover:bg-blue-200"
                  >
                    {aulasDe(m.id).length}/{m.cantidadAulas} Administrar
                  </button>
                </td>
                <td className="px-4 py-3 text-right flex gap-2 justify-end">
                  <button
                    onClick={() => setModalMod(m)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => delModulo(m.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {modulos.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Sin módulos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {modalMod !== null && (
        <Modal onClose={() => setModalMod(null)}>
          <FormModulo
            colegios={colegios}         // aquí pásale tu array de colegios
            initial={modalMod}
            onSave={saveModulo}
            onCancel={() => setModalMod(null)}
          />
        </Modal>
      )}

      {modalAulas !== null && (
        <Modal onClose={() => setModalAulas(null)}>
          <GestorAulas
            modulo={modalAulas}
            onSave={saveAula}
            onDelete={delAula}
          />
        </Modal>
      )}
    </section>
);
}
