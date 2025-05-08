"use client";

import { useState } from "react";
import AxiosInstance from "../../components/AxiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Alert } from "@/components/ui/alert";

const Register = () => {
  const [formData, setFormData] = useState({
    ci: "88",
    username: "aaa",
    email: "superadmin@clegio.edu.bo",
    nombre: "Juan",
    apellido: "Pérez",
    fecha_nacimiento: "1990-01-01",
    foto: null,
    telefono: "7123567",
    rol_id: "4", // SuperAdmin
    password: "aaa",
    confirmPassword: "aaa",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.ci ||
      !formData.rol_id
    ) {
      setErrorMsg("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (!formData.fecha_nacimiento) {
      setErrorMsg("Por favor, ingresa una fecha de nacimiento válida.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append("ci", formData.ci);
      dataToSend.append("username", formData.username);
      dataToSend.append("email", formData.email);
      dataToSend.append("nombre", formData.nombre);
      dataToSend.append("apellido", formData.apellido);
      dataToSend.append("fecha_nacimiento", formData.fecha_nacimiento);
      dataToSend.append("telefono", formData.telefono);
      dataToSend.append("rol_id", formData.rol_id);
      dataToSend.append("password", formData.password);

      if (formData.foto) {
        dataToSend.append("foto", formData.foto);
      }

      const response = await AxiosInstance.post("/user/auth/register/", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg("Usuario registrado exitosamente.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      if (error.response && error.response.data) {
        const serverErrors = error.response.data;
        if (typeof serverErrors === "string") {
          setErrorMsg(serverErrors);
        } else if (typeof serverErrors === "object") {
          const errorMessages = Object.values(serverErrors).flat().join(", ");
          setErrorMsg(errorMessages);
        } else {
          setErrorMsg("Error desconocido del servidor.");
        }
      } else {
        setErrorMsg("Error al conectar con el servidor.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 shadow-xl rounded-xl">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">Registro</h2>
          <div className="space-y-4">
            
            <div>
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="text" value={formData.password} onChange={handleChange} />
            </div>
            
            {errorMsg && <Alert variant="destructive">{errorMsg}</Alert>}
            {successMsg && <Alert variant="default">{successMsg}</Alert>}
            <Button
              onClick={handleRegister}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
            >Registrarse
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
