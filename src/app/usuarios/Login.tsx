"use client";

import { useState } from "react";
import AxiosInstance from "../../components/AxiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Datos enviados al backend:", { username, password }); // Log de los datos enviados al backend
    try {
      const response = await AxiosInstance.post("/user/auth/login/", {
        username,
        password,
      });
      console.log("Respuesta del servidor:", response); // Log de la respuesta completa
      console.log("Datos de la respuesta:", response.data); // Log de los datos de la respuesta
      
      console.log("Estado de la respuesta:", response.status); // Log del estado de la respuesta

      console.log(response.data)
  
      const { token, user } = response.data;
      console.log("Rol del usuario:", user.rol.nombre); // Log del rol del usuario
  
      localStorage.setItem("token", token); // Guarda el token
  
      setErrorMsg("");
      console.log(`Bienvenido, ${user.username} (${user.rol})`);
  
      // Redirección según el rol
      console.log(user.rol.nombre)
      switch (user.rol.nombre) {
        case "alumno":
          navigate("/dashboard/alumno", { state: { user } });
          break;
        case "tutor":
          navigate("/dashboard/tutor", { state: { user } });
          break;
        case "profesor":
          navigate("/dashboard/profesor", { state: { user } });
          break;
        case "admin":
          navigate("/dashboard/admin", { state: { user } });
          break;
        case "SuperAdmin":
          navigate("/dashboard/superadmin", { state: { user } });
          break;
        default:
          setErrorMsg("Rol no reconocido");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error?.response?.data?.error || "Error de login");
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 shadow-xl rounded-xl">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            <Button onClick={handleLogin} className="w-full">
              Iniciar sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
