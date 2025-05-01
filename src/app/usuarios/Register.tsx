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
  const [formData, setFormData] = useState<{
    ci: string;
    username: string;
    email: string;
    nombre: string;
    apellido: string;
    edad: string;
    foto: File | null; // Cambiar el tipo de foto
    telefono: string;
    rol_id: string;
    password: string;
    confirmPassword: string;
  }>({
    ci: "",
    username: "",
    email: "",
    nombre: "",
    apellido: "",
    edad: "",
    foto: null, // Inicializar como null
    telefono: "",
    rol_id: "",
    password: "",
    confirmPassword: "",
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
 
     // Validaciones
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
 
     if (isNaN(Number(formData.edad)) || Number(formData.edad) <= 0) {
       setErrorMsg("Por favor, ingresa una edad válida.");
       return;
     }
 
     if (formData.password !== formData.confirmPassword) {
       setErrorMsg("Las contraseñas no coinciden.");
       return;
     }
 
     try {
       // Crear un objeto FormData
       const dataToSend = new FormData();
       dataToSend.append("ci", formData.ci);
       dataToSend.append("username", formData.username);
       dataToSend.append("email", formData.email);
       dataToSend.append("nombre", formData.nombre);
       dataToSend.append("apellido", formData.apellido);
       dataToSend.append("edad", formData.edad);
       dataToSend.append("telefono", formData.telefono);
       dataToSend.append("rol_id", formData.rol_id);
       dataToSend.append("password", formData.password);
 
       // Agregar la foto si existe
       if (formData.foto) {
         dataToSend.append("foto", formData.foto);
       }
 
       // Enviar la solicitud con Axios
       const response = await AxiosInstance.post("/user/auth/register/", dataToSend, {
         headers: {
           "Content-Type": "multipart/form-data",
         },
       });
 
       setSuccessMsg("Usuario registrado exitosamente.");
       console.log("User registered successfully:", response.data);
 
       setTimeout(() => {
         navigate("/login");
       }, 2000);
     } catch (error: any) {
       console.error(error);
 
       // Manejar errores del servidor
       if (error.response && error.response.data) {
         const serverErrors = error.response.data;
         if (typeof serverErrors === "string") {
           setErrorMsg(serverErrors); // Si el servidor devuelve un mensaje de error como string
         } else if (typeof serverErrors === "object") {
           // Si el servidor devuelve un objeto con múltiples errores
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
               <Label htmlFor="ci">CI</Label>
               <Input id="ci" name="ci" value={formData.ci} onChange={handleChange} />
             </div>
             <div>
               <Label htmlFor="username">Usuario</Label>
               <Input id="username" name="username" value={formData.username} onChange={handleChange} />
             </div>
             <div>
               <Label htmlFor="email">Correo Electrónico</Label>
               <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
             </div>
             <div>
               <Label htmlFor="nombre">Nombre</Label>
               <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
             </div>
             <div>
               <Label htmlFor="apellido">Apellido</Label>
               <Input id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} />
             </div>
             <div>
               <Label htmlFor="edad">Edad</Label>
               <Input id="edad" name="edad" type="number" value={formData.edad} onChange={handleChange} />
             </div>
             <div>
               <Label htmlFor="foto">Foto</Label>
               <Input
                 id="foto"
                 name="foto"
                 type="file"
                 onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                     setFormData({ ...formData, foto: file });
                   }
                 }}
               />
             </div>
             <div>
               <Label htmlFor="telefono">Teléfono</Label>
               <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
             </div>
             <div>
               <Label htmlFor="rol_id">Rol</Label>
               <select
                 id="rol_id"
                 name="rol_id"
                 value={formData.rol_id}
                 onChange={(e) => setFormData({ ...formData, rol_id: e.target.value })}
                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                 <option value="">Selecciona un rol</option>
                 <option value="1">Alumno</option>
                 <option value="2">Director</option>
                 <option value="3">Director Distrital</option>
                 <option value="4">Profesor</option>
                 <option value="5">Tutor</option>
               </select>
             </div>
             <div>
               <Label htmlFor="password">Contraseña</Label>
               <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
             </div>
             <div>
               <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
               <Input
                 id="confirmPassword"
                 name="confirmPassword"
                 type="password"
                 value={formData.confirmPassword}
                 onChange={handleChange}
               />
             </div>
             {errorMsg && <Alert variant="destructive">{errorMsg}</Alert>}
             {successMsg && <Alert variant="default">{successMsg}</Alert>}
             <Button onClick={handleRegister} className="w-full">
               Registrarse
             </Button>
           </div>
         </CardContent>
       </Card>
     </div>
   );
 };
 
 
 export function ObtenerRolID(nombreRol: string): number {
  switch (nombreRol) {
    case "SuperAdmin":
      return 1;
    case "Admin":
      return 2;
    case "profesor":
      return 3;
    case "alumno":
      return 4;
    case "tutor":
      return 5;
    default:
      return 0;
  }
}
 
 
 export default Register;
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
    ci: "",
    username: "",
    email: "",
    nombre: "",
    apellido: "",
    edad: "",
    foto: "",
    telefono: "",
    rol_id: "",
    password: "",
    confirmPassword: "",
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

    // Validaciones
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

    if (isNaN(Number(formData.edad)) || Number(formData.edad) <= 0) {
      setErrorMsg("Por favor, ingresa una edad válida.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Crear un objeto FormData
      const dataToSend = new FormData();
      dataToSend.append("ci", formData.ci);
      dataToSend.append("username", formData.username);
      dataToSend.append("email", formData.email);
      dataToSend.append("nombre", formData.nombre);
      dataToSend.append("apellido", formData.apellido);
      dataToSend.append("edad", formData.edad);
      dataToSend.append("telefono", formData.telefono);
      dataToSend.append("rol_id", formData.rol_id);
      dataToSend.append("password", formData.password);

      // Agregar la foto si existe
      if (formData.foto) {
        dataToSend.append("foto", formData.foto);
      }

      // Enviar la solicitud con Axios
      const response = await AxiosInstance.post("/user/auth/register/", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg("Usuario registrado exitosamente.");
      console.log("User registered successfully:", response.data);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error(error);

      // Manejar errores del servidor
      if (error.response && error.response.data) {
        const serverErrors = error.response.data;
        if (typeof serverErrors === "string") {
          setErrorMsg(serverErrors); // Si el servidor devuelve un mensaje de error como string
        } else if (typeof serverErrors === "object") {
          // Si el servidor devuelve un objeto con múltiples errores
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
              <Label htmlFor="ci">CI</Label>
              <Input id="ci" name="ci" value={formData.ci} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="edad">Edad</Label>
              <Input id="edad" name="edad" type="number" value={formData.edad} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="foto">Foto</Label>
              <Input
                id="foto"
                name="foto"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, foto: file });
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="rol_id">Rol</Label>
              <select
                id="rol_id"
                name="rol_id"
                value={formData.rol_id}
                onChange={(e) => setFormData({ ...formData, rol_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un rol</option>
                <option value="1">Alumno</option>
                <option value="2">Director</option>
                <option value="3">Director Distrital</option>
                <option value="4">Profesor</option>
                <option value="5">Tutor</option>
              </select>
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {errorMsg && <Alert variant="destructive">{errorMsg}</Alert>}
            {successMsg && <Alert variant="default">{successMsg}</Alert>}
            <Button onClick={handleRegister} className="w-full">
              Registrarse
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export function ObtenerRolID(nombreRol) {
    switch (nombreRol) {
      case "alumno":
        return 1;
      case "director":
        return 2;
      case "director distrital":
        return 3;
      case "profesor":
        return 4;
      case "tutor":
        return 5;
      default:
        return 0;
    }
}


export default Register;
