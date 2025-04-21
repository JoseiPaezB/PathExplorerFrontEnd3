"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Briefcase,
  Calendar,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
  ArrowLeft,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserInfoBanca } from "@/types/users";
import { params } from "@/types/parameters";

export default function UserDetailsPage({ params }: { params: params }) {
  const unwrappedParams: params = use(params);
  const userId = unwrappedParams.id;
  const router = useRouter();
  const [user, setUser] = useState<UserInfoBanca | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("informacion");

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("selectedUser");

      if (storedUser) {
        const userData = JSON.parse(storedUser) as UserInfoBanca;
        if (userData.id_persona.toString() === userId) {
          setUser(userData);
          setLoading(false);
          return;
        }
      }

      setError("No se encontró información del usuario");
      setLoading(false);
    } catch (err) {
      console.error("Error retrieving user data:", err);
      setError("Error al cargar los datos del usuario");
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="space-y-4 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p>Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">{error || "Usuario no encontrado"}</p>
            <Button onClick={() => router.push("/usuarios")} className="mt-4">
              Volver a la lista de usuarios
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a usuarios</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nombre}`}
                alt={user.nombre}
              />
              <AvatarFallback className="text-2xl">
                {user.nombre.charAt(0)}
                {user.apellido?.charAt(0) || ""}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{`${user.nombre} ${
                  user.apellido || ""
                }`}</h2>
                <Badge
                  className={
                    user.estado === "ASIGNADO" ? "bg-green-500" : "bg-red-500"
                  }
                >
                  {user.estado}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">
                {user.puesto_actual}
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{user.puesto_actual}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Contratado:{" "}
                    {new Date(user.fecha_contratacion).toLocaleDateString(
                      "es-ES"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="informacion">Información</TabsTrigger>
          <TabsTrigger value="historial">Historial Profesional</TabsTrigger>
          <TabsTrigger value="disponibilidad">Disponibilidad</TabsTrigger>
        </TabsList>

        <TabsContent value="informacion" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Teléfono:</span>
                    <span className="text-sm">No disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Ubicación:</span>
                    <span className="text-sm">No disponible</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Información Laboral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Posición actual:
                    </span>
                    <span className="text-sm">{user.puesto_actual}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge
                      className={
                        user.estado === "ASIGNADO"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }
                    >
                      {user.estado}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Disponibilidad:</span>
                    <span className="text-sm">
                      {user.porcentaje_disponibilidad}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Antigüedad:</span>
                    <span className="text-sm">{user.antiguedad} años</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Historial Profesional
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.historial_profesional ? (
                <div className="space-y-4 whitespace-pre-line">
                  {user.historial_profesional}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay historial profesional disponible
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disponibilidad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Disponibilidad y Asignación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    Porcentaje de disponibilidad:
                  </span>
                  <Badge variant="outline" className="ml-auto">
                    {user.porcentaje_disponibilidad}%
                  </Badge>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${user.porcentaje_disponibilidad}%` }}
                  ></div>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Estado actual:</h4>
                  <Badge
                    className={
                      user.estado === "ASIGNADO"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-red-100 text-red-800 border-red-300"
                    }
                  >
                    {user.estado}
                  </Badge>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {user.estado === "ASIGNADO"
                      ? "El empleado está actualmente asignado a un proyecto."
                      : "El empleado está disponible para asignación a proyectos."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
