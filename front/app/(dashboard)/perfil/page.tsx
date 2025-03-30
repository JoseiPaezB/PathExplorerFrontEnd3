"use client"

import { useState } from "react"
import {
  Award,
  Briefcase,
  Calendar,
  Edit,
  FileText,
  Flag,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState("informacion")

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Juan Díaz" />
              <AvatarFallback className="text-2xl">JD</AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">Juan Díaz</h2>
                <Badge className="bg-primary">Senior</Badge>
              </div>
              <p className="text-lg text-muted-foreground">Desarrollador Full Stack</p>
              <div className="flex flex-wrap gap-3 pt-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>Departamento de Tecnología</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Madrid, España</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Incorporación: Enero 2020</span>
                </div>
              </div>
            </div>
            <div className="ml-auto flex flex-col gap-2 md:flex-row">
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                Editar perfil
              </Button>
              <Button size="sm" className="gap-1 bg-primary hover:bg-primary/90">
                <FileText className="h-4 w-4" />
                Descargar CV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="informacion">Información</TabsTrigger>
          <TabsTrigger value="habilidades">Habilidades</TabsTrigger>
          <TabsTrigger value="metas">Metas Profesionales</TabsTrigger>
        </TabsList>

        <TabsContent value="informacion" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">juan.diaz@empresa.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Teléfono:</span>
                    <span className="text-sm">+34 612 345 678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Ubicación:</span>
                    <span className="text-sm">Madrid, España</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Educación y Certificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Ingeniería Informática</h4>
                      <span className="text-xs text-muted-foreground">2015 - 2019</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Universidad Politécnica de Madrid</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">AWS Solutions Architect</h4>
                      <span className="text-xs text-muted-foreground">2022</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Amazon Web Services</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Scrum Master Certified</h4>
                      <span className="text-xs text-muted-foreground">2021</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Scrum Alliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Historial Profesional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    role: "Desarrollador Full Stack Senior",
                    company: "Empresa Actual",
                    period: "Enero 2022 - Presente",
                    description:
                      "Desarrollo de aplicaciones web y móviles utilizando React, Node.js y AWS. Liderazgo técnico en proyectos de transformación digital para clientes del sector financiero.",
                    achievements: [
                      "Reducción del 40% en tiempo de carga de la aplicación principal",
                      "Implementación de CI/CD que redujo el tiempo de despliegue en un 60%",
                      "Mentoría a 5 desarrolladores junior",
                    ],
                  },
                  {
                    role: "Desarrollador Full Stack",
                    company: "Empresa Anterior",
                    period: "Marzo 2020 - Diciembre 2021",
                    description:
                      "Desarrollo de aplicaciones web utilizando Angular y .NET Core. Participación en proyectos de e-commerce y sistemas de gestión interna.",
                    achievements: [
                      "Migración exitosa de aplicación legacy a arquitectura moderna",
                      "Implementación de sistema de autenticación OAuth 2.0",
                    ],
                  },
                  {
                    role: "Desarrollador Frontend",
                    company: "Primera Empresa",
                    period: "Julio 2019 - Febrero 2020",
                    description:
                      "Desarrollo de interfaces de usuario con HTML, CSS y JavaScript. Colaboración en proyectos de marketing digital.",
                    achievements: ["Rediseño de la página principal que aumentó conversiones en un 25%"],
                  },
                ].map((job, index) => (
                  <div key={index} className="relative border-l border-muted pl-6">
                    <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-primary" />
                    <div className="space-y-2">
                      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                        <h4 className="font-medium">{job.role}</h4>
                        <span className="text-sm text-muted-foreground">{job.period}</span>
                      </div>
                      <p className="text-sm font-medium text-primary">{job.company}</p>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                      {job.achievements && job.achievements.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Logros destacados:</p>
                          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                            {job.achievements.map((achievement, i) => (
                              <li key={i}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habilidades" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Habilidades Técnicas
                </CardTitle>
                <CardDescription>
                  Evaluación de competencias técnicas basada en proyectos y certificaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "JavaScript/TypeScript", level: 90 },
                    { name: "React/Angular", level: 85 },
                    { name: "Node.js", level: 80 },
                    { name: "AWS", level: 75 },
                    { name: "Python", level: 65 },
                    { name: "DevOps/CI/CD", level: 70 },
                  ].map((skill, index) => (
                    <div key={index} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Habilidades Blandas
                </CardTitle>
                <CardDescription>
                  Evaluación de competencias interpersonales basada en feedback de equipo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Trabajo en equipo", level: 95 },
                    { name: "Comunicación", level: 85 },
                    { name: "Resolución de problemas", level: 90 },
                    { name: "Liderazgo", level: 75 },
                    { name: "Gestión del tiempo", level: 80 },
                    { name: "Adaptabilidad", level: 85 },
                  ].map((skill, index) => (
                    <div key={index} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Gráfico de Competencias
              </CardTitle>
              <CardDescription>Visualización de habilidades técnicas y blandas en formato radar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-80 items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    El gráfico de radar de habilidades se visualizará aquí
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-primary" />
                Plan de Carrera
              </CardTitle>
              <CardDescription>Objetivos profesionales y plan de desarrollo a corto y largo plazo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="relative border-l border-primary pl-6">
                  <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-primary" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Objetivo a Corto Plazo (6 meses)</h4>
                      <Badge className="inline-flex items-center px-3 py-1 whitespace-nowrap bg-emerald-500 text-white">
                        En progreso
                      </Badge>

                    </div>
                    <p className="text-sm text-muted-foreground">
                      Obtener certificación en AWS Solutions Architect Professional y liderar un proyecto de migración a
                      la nube.
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progreso</span>
                        <span className="font-medium">40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div className="space-y-1 pt-2">
                      <p className="text-sm font-medium">Pasos a seguir:</p>
                      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>Completar curso online de preparación (Completado)</li>
                        <li>Realizar laboratorios prácticos (En progreso)</li>
                        <li>Programar examen de certificación</li>
                        <li>Proponer proyecto de migración al equipo directivo</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="relative border-l border-muted pl-6">
                  <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-muted" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Objetivo a Medio Plazo (1-2 años)</h4>
                      <Badge variant="outline" className="text-muted-foreground">
                        Planificado
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Asumir rol de Arquitecto de Soluciones y liderar un equipo técnico de al menos 5 personas.
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progreso</span>
                        <span className="font-medium">10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                    <div className="space-y-1 pt-2">
                      <p className="text-sm font-medium">Pasos a seguir:</p>
                      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>Completar certificaciones avanzadas en arquitectura de software</li>
                        <li>Participar en programa de liderazgo interno</li>
                        <li>Mentorizar a desarrolladores junior</li>
                        <li>Proponer mejoras arquitectónicas en proyectos actuales</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="relative border-l border-muted pl-6">
                  <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-muted" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Objetivo a Largo Plazo (3-5 años)</h4>
                      <Badge variant="outline" className="text-muted-foreground">
                        Planificado
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Alcanzar posición de Director Técnico (CTO) o Director de Ingeniería, liderando la estrategia
                      tecnológica.
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progreso</span>
                        <span className="font-medium">5%</span>
                      </div>
                      <Progress value={5} className="h-2" />
                    </div>
                    <div className="space-y-1 pt-2">
                      <p className="text-sm font-medium">Pasos a seguir:</p>
                      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>Completar MBA o formación en gestión tecnológica</li>
                        <li>Ampliar red de contactos en la industria</li>
                        <li>Participar en conferencias como ponente</li>
                        <li>Liderar iniciativas de innovación en la empresa</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Áreas de Interés y Desarrollo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  "Arquitectura Cloud",
                  "Inteligencia Artificial",
                  "DevOps",
                  "Seguridad Informática",
                  "Blockchain",
                  "Liderazgo Técnico",
                  "Gestión de Proyectos",
                  "Microservicios",
                  "Serverless",
                  "Big Data",
                ].map((interest, index) => (
                  <Badge key={index} variant="outline" className="bg-muted">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

