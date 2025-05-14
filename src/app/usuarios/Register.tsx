"use client";

import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
} from "react";
import AxiosInstance from "../../components/AxiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Alert } from "@/components/ui/alert";

interface FormState {
  ci: string;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  telefono: string;
  rol_id: string;
  foto: File | null;
  password: string;
  confirmPassword: string;
}

const initialState: FormState = {
  ci: "",
  username: "",
  email: "",
  nombre: "",
  apellido: "",
  fecha_nacimiento: "",
  telefono: "",
  rol_id: "",
  foto: null,
  password: "",
  confirmPassword: "",
};

const Register: React.FC = (): JSX.Element => {
  const [formData, setFormData] =
    useState<FormState>(initialState);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const navigate = useNavigate();

  // Manejador genérico para inputs de texto, date, select y file
  const handleChange = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLSelectElement
      >
    ) => {
      const { name, type, value, files } = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "file"
            ? files?.[0] ?? null
            : value,
      }));
    },
    []
  );

  // Validaciones básicas
  const validate = (): string | null => {
    const {
      ci,
      username,
      email,
      nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      rol_id,
      password,
      confirmPassword,
    } = formData;

    if (
      !ci ||
      !username ||
      !email ||
      !nombre ||
      !apellido ||
      !fecha_nacimiento ||
      !telefono ||
      !rol_id ||
      !password ||
      !confirmPassword
    ) {
      return "Completa todos los campos obligatorios.";
    }
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return "Ingresa un correo electrónico válido.";
    }
    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden.";
    }
    return null;
  };

  // Envío del formulario
  const handleSubmit = async (
    e: FormEvent
  ): Promise<void> => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const error = validate();
    if (error) {
      setErrorMsg(error);
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(
      ([key, val]) => {
        if (val !== null) {
          payload.append(
            key,
            val as string | Blob
          );
        }
      }
    );

    try {
      await AxiosInstance.post(
        "/user/auth/register/",
        payload,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );
      setSuccessMsg(
        "Usuario registrado exitosamente."
      );
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      const resp = err.response?.data;
      if (resp) {
        if (typeof resp === "string") {
          setErrorMsg(resp);
        } else if (typeof resp === "object") {
          const msg = Object.values(resp)
            .flat()
            .join(", ");
          setErrorMsg(msg);
        } else {
          setErrorMsg(
            "Error desconocido del servidor."
          );
        }
      } else {
        setErrorMsg(
          "No fue posible conectar con el servidor."
        );
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-xl rounded-xl">
        <CardContent>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Registro de Usuario
          </h2>
          {errorMsg && (
            <Alert variant="destructive" className="mb-4">
              {errorMsg}
            </Alert>
          )}
          {successMsg && (
            <Alert variant="default" className="mb-4">
              {successMsg}
            </Alert>
          )}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ci">CI</Label>
                <Input
                  id="ci"
                  name="ci"
                  value={formData.ci}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="username">
                  Usuario
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">
                  Correo
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="rol_id">Rol</Label>
                <select
                  id="rol_id"
                  name="rol_id"
                  value={formData.rol_id}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">
                    Selecciona un rol
                  </option>
                  <option value="1">Admin</option>
                  <option value="4">
                    SuperAdmin
                  </option>
                  {/* Ajusta según tus roles reales */}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="apellido">
                  Apellido
                </Label>
                <Input
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fecha_nacimiento">
                  Fecha de nacimiento
                </Label>
                <Input
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="telefono">
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="foto">
                Foto de perfil
              </Label>
              <Input
                id="foto"
                name="foto"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">
                  Repetir contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl shadow-md transition"
            >
              Registrarse
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
