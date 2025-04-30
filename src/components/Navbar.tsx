import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { myBaseUrl } from "./AxiosInstance";

export default function Navbar() {
  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo + Nombre */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={`${myBaseUrl}/static/img/logo-donbosco.png`}
            alt="Colegio Don Bosco"
            className="h-10 w-10 object-contain"
          />
          <span className="font-bold text-lg text-yellow-300">Colegio Don Bosco</span>
        </Link>

        {/* Menú */}
        <nav className="space-x-6">
          <Link to="/" className="hover:text-yellow-300 font-medium">Inicio</Link>
          <Link to="/sobre-nosotros" className="hover:text-yellow-300 font-medium">Sobre Nosotros</Link>
          <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold">
            <Link to="/login">Iniciar Sesión</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
