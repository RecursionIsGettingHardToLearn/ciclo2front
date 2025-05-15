import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "@/components/AxiosInstance";
export default function SuperAdminInicio() {
  const [cantidadColegios, setCantidadColegios] = useState<number | null>(null);
  const [cantidadUnidades, setCantidadUnidades] = useState<number | null>(null);
  const [cantidadUsuarios, setCantidadUsuarios] = useState<number | null>(null);


  useEffect(() => {
    // Colegios
    AxiosInstance
      .get("/institucion/cantidad-colegios")
      .then(res => setCantidadColegios(res.data.cantidad_colegios))
      .catch(error => {
        console.error("Error al obtener cantidad de colegios:", error);
        setCantidadColegios(0);
      });

    // Unidades educativas
    AxiosInstance
      .get("/institucion/cantidad-unidades-educativas/")
      .then(res => setCantidadUnidades(res.data.cantidad_unidades_educativas))
      .catch(error => {
        console.error("Error al obtener cantidad de unidades educativas:", error);
        setCantidadUnidades(0);
      });

    // Usuarios
    AxiosInstance
      .get("/user/auth/cantidad/")
      .then(res => setCantidadUsuarios(res.data.cantidad_usuarios))
      .catch(error => {
        console.error("Error al obtener cantidad de usuarios:", error);
        setCantidadUsuarios(0);
      });
  }, []);

  const cards = [
    { titulo: "Colegios", valor: cantidadColegios ?? "...", hint: "registrados", enlace: "colegios" },
    { titulo: "Unidades", valor: cantidadUnidades ?? "...", hint: "totales", enlace: "unidades" },
    { titulo: "Usuarios", valor: cantidadUsuarios ?? "...", hint: "activos", enlace: "usuarios" },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map(c => (
        <Link
          to={`/dashboard/superadmin/${c.enlace}`}
          key={c.titulo}
          className="bg-white rounded-xl shadow p-6 flex flex-col hover:shadow-lg transition-shadow"
        >
          <span className="text-sm text-gray-500">{c.titulo}</span>
          <span className="text-3xl font-bold text-blue-600 mt-2">{c.valor}</span>
          <span className="text-xs text-gray-400 mt-auto">{c.hint}</span>
        </Link>
      ))}
    </section>
  );
}
