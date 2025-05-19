import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AxiosInstance from "../../components/AxiosInstance";

interface MateriaCurso {
  id: string;
  materia: string;
  curso: string;

}

interface Materias {
  id: string;
  nombre: string;
}
interface Cursos {
  paralelo: string;
  nombre: string;
}
export default function MateriaCurso() {
  const [modalMod, setModalMod] = useState<{ edit: MateriaCurso | null } | null>(null);
  const [materiasCursos, setMateriasCursos] = useState<MateriaCurso[]>([]);
  const [materias, setMaterias] = useState<Materias[]>([]);
  const [cursos, setCursos] = useState<Cursos[]>([]);


  const listarMateriaCurso = () => {
    AxiosInstance.get("academico/listar-materias-cursos/")
      .then(res => {
        const data: MateriaCurso[] = res.data.map((m: any) => ({
          id: m.id,
          materia: m.materia,
          curso: m.curso,
        }));
        setMateriasCursos(data);
      })
      .catch(err => {
        console.error("Error al cargar módulos:", err);
        alert("No se pudieron cargar los módulos del servidor.");
      });
  };
  const listarMaterias = () => {
    AxiosInstance.get("academico/listar-materias/")
      .then(res => {
        const data: Materias[] = res.data.map((m: any) => ({
          id: m.id,
          nombre: m.nombre,
        }));
        setMaterias(data);
      })
      .catch(err => {
        console.error("Error al cargar módulos:", err);
        alert("No se pudieron cargar los módulos del servidor.");
      });
  };
  const listarCursos = () => {
    AxiosInstance.get("academico/listar-cursos/")
      .then(res => {
        const data: Cursos[] = res.data.map((m: any) => ({
          paralelo: m.paralelo,
          nombre: m.nombre,
        }));
        setCursos(data);
      })
      .catch(err => {
        console.error("Error al cargar módulos:", err);
        alert("No se pudieron cargar los módulos del servidor.");
      });
  };


  useEffect(() => {
    listarMateriaCurso();
    listarMaterias();
    listarCursos();
  }, []);


  const guardarMateriaCurso = (m: MateriaCurso) => {
    if (!m.materia) return alert("Completa los campos");

    if (m.id) {
      AxiosInstance.put(`academico/editar-materia-curso/${m.id}/`, {
        materia: m.materia,
        curso: m.curso,
      })
        .then(() => {
          setMateriasCursos(list =>
            list.map(x =>
            (x.id === m.id ?
              { ...m } :
              x))
          );
          setModalMod(null);
        })
        .catch(err => {
          console.error("Error al editar módulo", err);
          alert("No se pudo actualizar el módulo.");
        });
    } else {
      AxiosInstance.post("academico/nuevo-materia-curso/", {
        materia: m.materia,
        curso: m.curso,
      })
        .then(res => {
          const nuevoModulo: MateriaCurso = {
            id: res.data.id,
            materia: res.data.materia,
            curso: res.data.curso,
          };
          setMateriasCursos(list => [...list, nuevoModulo]);
          setModalMod(null);
        })
        .catch(err => {
          console.error("Error al crear módulo", err);
          alert("No se pudo crear el módulo.");
        });
    }
  };

  const delMateriaCurso = (id: string) => {
    if (!confirm("¿Eliminar materia curso?")) return;

    AxiosInstance.delete(`academico/eliminar-materia-curso/${id}/`)
      .then(() => {
        setMateriasCursos(m => m.filter(x => x.id.toString() !== id.toString()));
      })
      .catch(err => {
        console.error("Error al eliminar materia curso", err);
        alert("No se pudo eliminar el materia curso.");
      });
  };

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">MateriaCurso</h2>
        <button
          onClick={() => setModalMod({ edit: null })}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" /> Nuevo MateriaCurso
        </button>
      </header>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50 text-blue-600">
            <tr>
              <th className="px-4 py-3 text-left">curso</th>
              <th className="px-4 py-3 text-left">materia</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {materiasCursos.map(m => {

              return (
                <tr key={m.id}>
                  <td className="px-4 py-3">{cursos.find(c => c.paralelo.toString() === m.curso.toString())?.nombre?? "-"}</td>
                  <td className="px-4 py-3">{materias.find(mat => mat.id.toString() === m.materia.toString())?.nombre?? "-"}</td>
                  <td className="px-4 py-3 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => setModalMod({ edit: m })}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => delMateriaCurso(m.id.toString())}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {materiasCursos.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Sin módulos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalMod && (
        <Modal onClose={() => setModalMod(null)}>
          <FormModulo
            materias={materias}
            cursos={cursos}
            initial={modalMod.edit}
            onCancel={() => setModalMod(null)}
            onSave={guardarMateriaCurso}
          />
        </Modal>
      )}
    </section>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

function FormModulo({
  initial,
  materias,
  cursos,
  onSave,
  onCancel,
}: {

  materias: Materias[];
  cursos: Cursos[];
  initial: MateriaCurso | null;
  onSave: (m: MateriaCurso) => void;
  onCancel: () => void;
}) {
const [f, setF] = useState<MateriaCurso>(
  initial ?? { id: "", materia: "", curso: "" }
);

  const save = () => !f.curso || !f.materia ? alert("Completa los campos") : onSave(f);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{initial ? "Editar" : "Nuevo"} Materia -Curso</h3>

      <div>
        <label className="block mb-1">materia</label>
        <select
          value={f.materia}
          onChange={e => setF({ ...f, materia: e.target.value })}
          className="w-full border rounded py-2 px-3"
        >
          <option value="">Seleccione una materia</option>
          {materias.map(m => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">curso</label>
        <select
          value={f.curso}
          onChange={e => setF({ ...f, curso: e.target.value })}
          className="w-full border rounded py-2 px-3"
        >
          <option value="">Seleccione un curso</option>
          {cursos.map(c => (
            <option key={c.paralelo} value={c.paralelo}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 border rounded">
          Cancelar
        </button>
        <button onClick={save} className="px-6 py-2 bg-blue-600 text-white rounded">
          Guardar
        </button>
      </div>
    </div>
  );
}