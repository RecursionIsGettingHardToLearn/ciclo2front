import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";

export default function SuperAdminInicio() {
  const [data, setData] = useState({
    colegios: 0,
    unidades: 0,
    usuarios: 0,
  });

  useEffect(() => {
    // Obtener cantidad de colegios
    const fetchColegios = async () => {
      try {
        const res = await AxiosInstance.get("/institucion/listar-colegios/");
        setData(prev => ({ ...prev, colegios: res.data.length }));
      } catch (error) {
        console.error("Error al obtener colegios", error);
      }
    };

    // Obtener cantidad de unidades educativas
    const fetchUnidades = async () => {
      try {
        const res = await AxiosInstance.get("/institucion/listar-unidades-educativas/");
        setData(prev => ({ ...prev, unidades: res.data.length }));
      } catch (error) {
        console.error("Error al obtener unidades educativas", error);
      }
    };

    // Obtener cantidad de usuarios
    const fetchUsuarios = async () => {
      try {
        const res = await AxiosInstance.get("/institucion/auth/listar-usuarios/");
        setData(prev => ({ ...prev, usuarios: res.data.length }));
      } catch (error) {
        console.error("Error al obtener usuarios", error);
      }
    };

    fetchColegios();
    fetchUnidades();
    fetchUsuarios();
  }, []);

  const cards = [
    { titulo: "Colegios",  valor: data.colegios,  hint: "registrados", enlace: "colegios" },
    { titulo: "Unidades",  valor: data.unidades,  hint: "totales",     enlace: "unidades" },
    { titulo: "Usuarios",  valor: data.usuarios,  hint: "activos",     enlace: "usuarios" },
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
