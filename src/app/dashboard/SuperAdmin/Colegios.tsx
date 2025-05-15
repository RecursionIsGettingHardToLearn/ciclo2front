// src/app/dashboard/SuperAdminColegios.tsx

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AxiosInstance from "@/components/AxiosInstance";

import { Colegio } from "@/app/modelos/Institucion";
import { FormState } from "./components/ColegioForm";
import { Usuario, Rol, SuperAdmin } from "@/app/modelos/Usuarios";

import ColegioForm from "./components/ColegioForm";
import ColegiosTable from "./components/ColegiosTable";


export default function SuperAdminColegios() {
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [superadmins, setSuperadmins] = useState<SuperAdmin[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Colegio | null>(null);

  useEffect(() => {
    const cargarColegios = async (): Promise<void> => {
      try {
        const res = await AxiosInstance.get<any[]>("/institucion/listar-colegios/");
        const data: Colegio[] = res.data.map(item => ({
          id: Number(item.id),            // ← aquí convertir a number
          nombre: item.nombre,
          direccion: item.direccion,
          telefono: item.telefono,
          logoUrl: item.logo
            ? `${AxiosInstance.defaults.baseURL}${item.logo}`
            : undefined,
        }));
        setColegios(data);
      } catch (err) {
        console.error("Error al cargar colegios:", err);
        alert("No se pudieron cargar los colegios.");
      }
    };
    cargarColegios();
  }, []);
  

  // Cargar lista de superadmins
  useEffect(() => {
    const cargarSuperadmins = async () => {
      try {
        const res = await AxiosInstance.get<any[]>("/user/auth/listar-superadmins/");
        const data: SuperAdmin[] = res.data.map(item => new SuperAdmin({
          usuarioId: Number(item.usuario_id),
          usuario: new Usuario({
            id:         item.usuario.id,
            ci:         item.usuario.ci,
            foto:       item.usuario.foto,
            nombre:     item.usuario.nombre,
            apellido:   item.usuario.apellido,
            email:      item.usuario.email,
            fecha_nacimiento: item.usuario.fecha_nacimiento,
            username:   item.usuario.username,
            estado:     item.usuario.estado,
            rol:        new Rol({ id: item.usuario.rol.id, nombre: item.usuario.rol.nombre }),
            telefono:            item.usuario.telefono,
            password:  item.usuario.password,
            is_staff:            item.usuario.is_staff,
            is_active:           item.usuario.is_active,
            date_joined:         item.usuario.date_joined,
          })
        }));
        setSuperadmins(data);
      } catch (err) {
        console.error("Error al cargar superadmins:", err);
      }
    };
    cargarSuperadmins();
  }, []);

  const handleSave = async (form: FormState) => {
    try {
      let res;
      const payload = new FormData();
      payload.append("nombre", form.nombre);
      payload.append("direccion", form.direccion);
      payload.append("telefono", form.telefono);
      if (form.logoFile) payload.append("logo", form.logoFile);
      payload.append("usuario_id", form.usuario_id);
  
      if (editing) {
        // ── EDICIÓN ──
        res = await AxiosInstance.put(
          `/institucion/editar/${editing.id}/`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        const updated = res.data;
        setColegios((prev) =>
          prev.map((c) =>
            c.id === editing.id
              ? {
                  id: Number(updated.id),
                  nombre: updated.nombre,
                  direccion: updated.direccion,
                  telefono: updated.telefono,
                  logo: updated.logo || c.logo,
                }
              : c
          )
        );
        alert("Colegio actualizado exitosamente.");
      } else {
        // ── CREACIÓN ──
        res = await AxiosInstance.post(
          `/institucion/crear/`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        const created = res.data;
        setColegios((prev) => [
          ...prev,
          {
            id: created.id,
            nombre: created.nombre,
            direccion: created.direccion,
            telefono: created.telefono,
            logo: created.logo
              ? `${AxiosInstance.defaults.baseURL}${created.logo}`
              : undefined,
          },
        ]);
        alert("Colegio creado exitosamente.");
      }
  
      setShowForm(false);
      setEditing(null);
    } catch (err: any) {
      console.error("Error al guardar colegio:", err);
      const detail = err.response?.data;
      if (detail && typeof detail === "object") {
        const msgs = Object.values(detail)
          .map((m) => (Array.isArray(m) ? m.join(", ") : m))
          .join("\n");
        alert("Errores:\n" + msgs);
      } else {
        alert("Error inesperado al guardar colegio.");
      }
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este colegio?")) return;
    try {
      await AxiosInstance.delete(`/institucion/eliminar/${id}/`);
      setColegios((prev) => prev.filter((c) => c.id !== id));
      alert("Colegio eliminado exitosamente.");
    } catch (err) {
      console.error("Error al eliminar colegio:", err);
      alert("Error al eliminar el colegio.");
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">Colegios</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <Plus className="w-5 h-5" /> Nuevo colegio
        </button>
      </header>

      {showForm && (
        <ColegioForm
          initial={
            editing
              ? {
                  nombre: editing.nombre,
                  direccion: editing.direccion ?? "",
                  telefono: editing.telefono ?? "",
                  logoFile: null,
                  logoPreview: editing.logo ?? "",
                  usuario_id: "",
                }
              : undefined
          }
          superadmins={superadmins}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ColegiosTable
        colegios={colegios}
        onEdit={c => {
          setEditing(c);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />
    </section>
  );
}
