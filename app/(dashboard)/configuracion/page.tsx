"use client"

import { useState } from "react"
import { Bell, Globe, Key, Lock, Mail, Moon, Palette, Shield, Sun, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState("cuenta")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">Administra tus preferencias y configuración de cuenta</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
        </TabsList>

        <TabsContent value="cuenta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualiza tu información personal y detalles de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" placeholder="Juan" defaultValue="Juan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input id="apellido" placeholder="Díaz" defaultValue="Díaz" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan.diaz@empresa.com"
                    defaultValue="juan.diaz@empresa.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" type="tel" placeholder="+34 612 345 678" defaultValue="+34 612 345 678" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  placeholder="Desarrollador Full Stack Senior"
                  defaultValue="Desarrollador Full Stack Senior"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento</Label>
                <Select defaultValue="tecnologia">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tecnologia">Tecnología</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="ventas">Ventas</SelectItem>
                    <SelectItem value="rrhh">Recursos Humanos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-primary hover:bg-primary/90">Guardar cambios</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Idioma y Región</CardTitle>
              <CardDescription>Configura el idioma y la zona horaria de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="idioma">Idioma</Label>
                  <Select defaultValue="es">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zona-horaria">Zona Horaria</Label>
                  <Select defaultValue="europe-madrid">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una zona horaria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe-madrid">Europa/Madrid (UTC+1)</SelectItem>
                      <SelectItem value="europe-london">Europa/Londres (UTC+0)</SelectItem>
                      <SelectItem value="america-new_york">América/Nueva York (UTC-5)</SelectItem>
                      <SelectItem value="asia-tokyo">Asia/Tokio (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="formato-fecha">Formato de fecha</Label>
                <Select defaultValue="dd-mm-yyyy">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-primary hover:bg-primary/90">Guardar preferencias</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña actual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Key className="mr-2 h-4 w-4" />
                Actualizar contraseña
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Autenticación de Dos Factores</CardTitle>
              <CardDescription>Añade una capa extra de seguridad a tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticación 2FA</Label>
                  <p className="text-sm text-muted-foreground">Protege tu cuenta con autenticación de dos factores</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticación biométrica</Label>
                  <p className="text-sm text-muted-foreground">Usa tu huella digital o reconocimiento facial</p>
                </div>
                <Switch />
              </div>
              <Button variant="outline" className="w-full">
                <Shield className="mr-2 h-4 w-4" />
                Configurar autenticación
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sesiones Activas</CardTitle>
              <CardDescription>Gestiona tus sesiones activas en diferentes dispositivos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  device: "MacBook Pro",
                  location: "Madrid, España",
                  lastActive: "Ahora",
                  isCurrentDevice: true,
                },
                {
                  device: "iPhone 13",
                  location: "Barcelona, España",
                  lastActive: "Hace 2 horas",
                  isCurrentDevice: false,
                },
                {
                  device: "Windows PC",
                  location: "Madrid, España",
                  lastActive: "Hace 3 días",
                  isCurrentDevice: false,
                },
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {session.device}
                      {session.isCurrentDevice && (
                        <span className="ml-2 text-xs text-muted-foreground">(Dispositivo actual)</span>
                      )}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{session.location}</span>
                      <span>•</span>
                      <span>{session.lastActive}</span>
                    </div>
                  </div>
                  {!session.isCurrentDevice && (
                    <Button variant="outline" size="sm">
                      <Lock className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>Configura cómo y cuándo quieres recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-3 font-medium">Notificaciones por correo</h4>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Actualizaciones de proyectos",
                        description: "Recibe notificaciones cuando haya cambios en tus proyectos",
                      },
                      {
                        title: "Asignaciones de tareas",
                        description: "Notificaciones cuando se te asignen nuevas tareas",
                      },
                      {
                        title: "Menciones y comentarios",
                        description: "Cuando alguien te mencione o comente en tus tareas",
                      },
                      {
                        title: "Recordatorios de deadlines",
                        description: "Recordatorios de fechas límite próximas",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <Label className="text-base">{item.title}</Label>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 font-medium">Notificaciones push</h4>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Mensajes directos",
                        description: "Notificaciones de mensajes privados",
                      },
                      {
                        title: "Actualizaciones de estado",
                        description: "Cambios en el estado de tus tareas",
                      },
                      {
                        title: "Recordatorios de reuniones",
                        description: "Alertas de próximas reuniones",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <Label className="text-base">{item.title}</Label>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Resumen diario</Label>
                <Select defaultValue="end-of-day">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Nunca</SelectItem>
                    <SelectItem value="start-of-day">Inicio del día</SelectItem>
                    <SelectItem value="end-of-day">Final del día</SelectItem>
                    <SelectItem value="twice-daily">Dos veces al día</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Bell className="mr-2 h-4 w-4" />
                Guardar preferencias
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Canales de Comunicación</CardTitle>
              <CardDescription>Configura tus métodos preferidos de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
                  {
                    type: "Email",
                    value: "juan.diaz@empresa.com",
                    icon: Mail,
                    verified: true,
                  },
                  {
                    type: "Slack",
                    value: "@juandiaz",
                    icon: User,
                    verified: true,
                  },
                  {
                    type: "Microsoft Teams",
                    value: "Juan Díaz",
                    icon: User,
                    verified: false,
                  },
                ].map((channel, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <channel.icon className="h-5 w-5 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{channel.type}</p>
                        <p className="text-sm text-muted-foreground">{channel.value}</p>
                      </div>
                    </div>
                    {channel.verified ? (
                      <Button variant="outline" size="sm" className="gap-1">
                        Verificado
                      </Button>
                    ) : (
                      <Button size="sm" className="gap-1 bg-primary hover:bg-primary/90">
                        Verificar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                Añadir nuevo canal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apariencia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tema y Visualización</CardTitle>
              <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tema</Label>
                    <p className="text-sm text-muted-foreground">Selecciona el tema de la interfaz</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Sun className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Moon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Color del tema</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: "Púrpura", color: "bg-[#A100FF]" },
                      { name: "Azul", color: "bg-blue-600" },
                      { name: "Verde", color: "bg-green-600" },
                      { name: "Rojo", color: "bg-red-600" },
                      { name: "Naranja", color: "bg-orange-600" },
                      { name: "Rosa", color: "bg-pink-600" },
                    ].map((theme, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`h-8 w-full justify-start gap-2 ${index === 0 ? "border-2 border-primary" : ""}`}
                      >
                        <div className={`h-4 w-4 rounded-full ${theme.color}`} />
                        <span className="text-xs">{theme.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Densidad de contenido</Label>
                    <p className="text-sm text-muted-foreground">Ajusta el espaciado entre elementos</p>
                  </div>
                  <Select defaultValue="normal">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Selecciona densidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compacta</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="comfortable">Cómoda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Palette className="mr-2 h-4 w-4" />
                Aplicar cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

