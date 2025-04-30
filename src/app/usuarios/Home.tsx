import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { myBaseUrl } from "@/components/AxiosInstance";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-yellow-400 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-2xl border-none rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Información izquierda */}
            <div className="bg-blue-800 text-white p-8 flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-yellow-300">Bienvenido a Don Bosco</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-200 mb-4">
                  Plataforma para la gestión educativa: acceso para profesores, estudiantes, administrativos y padres.
                </p>
                <p className="text-sm text-gray-300">
                  Mejora la comunicación escolar y realiza seguimiento académico en tiempo real.
                </p>
              </CardContent>
            </div>

            {/* Imagen o promoción derecha */}
            <div className="bg-white p-8 flex items-center justify-center">
              <img
                src={`${myBaseUrl}/static/img/logo-donbosco.png`}
                alt="Don Bosco"
                className="h-40 w-40 object-contain"
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
