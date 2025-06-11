"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    User, Briefcase, GraduationCap, Award, Lightbulb,
    ArrowLeft, Save, Loader2, Trash2, Plus, X, 
    Mail, Phone, MapPin, Linkedin, Github, Building,
    Calendar, Edit3, FileText
} from "lucide-react";

interface CVDataPreviewProps {
    data: any;
    onSave: (editedData: any) => void;
    onBack: () => void;
    isLoading: boolean;
}

export default function CVDataPreview({ data, onSave, onBack, isLoading }: CVDataPreviewProps) {
    const [editableData, setEditableData] = useState(data);

    const updatePersonalInfo = (field: string, value: string) => {
        setEditableData((prev: any) => ({
            ...prev,
            informacion_personal: { ...prev.informacion_personal, [field]: value }
        }));
    };

    const updateExperience = (index: number, field: string, value: string) => {
        setEditableData((prev: any) => ({
            ...prev,
            experiencia_laboral: prev.experiencia_laboral?.map((exp: any, i: number) =>
                i === index ? { ...exp, [field]: value } : exp
            ) || []
        }));
    };

    const removeExperience = (index: number) => {
        setEditableData((prev: any) => ({
            ...prev,
            experiencia_laboral: prev.experiencia_laboral?.filter((_: any, i: number) => i !== index) || []
        }));
    };

    const addExperience = () => {
        setEditableData((prev: any) => ({
            ...prev,
            experiencia_laboral: [...(prev.experiencia_laboral || []), {
                cargo: "",
                empresa: "",
                fecha_inicio: "",
                fecha_fin: ""
            }]
        }));
    };

    const updateEducation = (index: number, field: string, value: string) => {
        setEditableData((prev: any) => ({
            ...prev,
            educacion: prev.educacion?.map((edu: any, i: number) =>
                i === index ? { ...edu, [field]: value } : edu
            ) || []
        }));
    };

    const removeEducation = (index: number) => {
        setEditableData((prev: any) => ({
            ...prev,
            educacion: prev.educacion?.filter((_: any, i: number) => i !== index) || []
        }));
    };

    const addEducation = () => {
        setEditableData((prev: any) => ({
            ...prev,
            educacion: [...(prev.educacion || []), {
                titulo: "",
                institucion: "",
                fecha_inicio: "",
                fecha_fin: ""
            }]
        }));
    };

    const updateSkill = (category: 'tecnicas' | 'blandas', index: number, value: string) => {
        setEditableData((prev: any) => ({
            ...prev,
            habilidades: {
                ...prev.habilidades,
                [category]: prev.habilidades?.[category]?.map((skill: string, i: number) =>
                    i === index ? value : skill
                ) || []
            }
        }));
    };

    const removeSkill = (category: 'tecnicas' | 'blandas', index: number) => {
        setEditableData((prev: any) => ({
            ...prev,
            habilidades: {
                ...prev.habilidades,
                [category]: prev.habilidades?.[category]?.filter((_: string, i: number) => i !== index) || []
            }
        }));
    };

    const addSkill = (category: 'tecnicas' | 'blandas') => {
        setEditableData((prev: any) => ({
            ...prev,
            habilidades: {
                ...prev.habilidades,
                [category]: [...(prev.habilidades?.[category] || []), ""]
            }
        }));
    };

    const updateCertification = (index: number, field: string, value: string) => {
        setEditableData((prev: any) => ({
            ...prev,
            certificaciones: prev.certificaciones?.map((cert: any, i: number) =>
                i === index ? { ...cert, [field]: value } : cert
            ) || []
        }));
    };

    const removeCertification = (index: number) => {
        setEditableData((prev: any) => ({
            ...prev,
            certificaciones: prev.certificaciones?.filter((_: any, i: number) => i !== index) || []
        }));
    };

    const addCertification = () => {
        setEditableData((prev: any) => ({
            ...prev,
            certificaciones: [...(prev.certificaciones || []), {
                nombre: "",
                emisor: "",
                fecha_obtencion: ""
            }]
        }));
    };

    const InfoCard = ({ icon: Icon, title, children, count, onAdd }: any) => (
        <Card className="border-muted">
            <CardHeader className="pb-4 bg-muted/30">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-lg text-foreground">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <span>{title}</span>
                            {count !== undefined && (
                                <Badge variant="secondary" className="ml-2">
                                    {count}
                                </Badge>
                            )}
                        </div>
                    </CardTitle>
                    {onAdd && (
                        <Button onClick={onAdd} size="sm" variant="outline" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Agregar
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-6">{children}</CardContent>
        </Card>
    );

    const EmptyState = ({ icon: Icon, title, description }: any) => (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
                <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header fijo */}
            <div className="shrink-0 border-b bg-card px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={onBack} disabled={isLoading}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground">Vista Previa y Edición</h3>
                                <p className="text-sm text-muted-foreground">Revisa y edita la información extraída de tu CV</p>
                            </div>
                        </div>
                    </div>

                    <Button 
                        onClick={() => onSave(editableData)} 
                        disabled={isLoading} 
                        size="lg" 
                        className="gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Guardar en mi Perfil
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Contenido con scroll */}
            <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <div className="p-6 max-w-6xl mx-auto">
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="grid w-full grid-cols-5 mb-8 h-12">
                                <TabsTrigger value="personal" className="gap-2">
                                    <User className="h-4 w-4" />
                                    Personal
                                </TabsTrigger>
                                <TabsTrigger value="experience" className="gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    Experiencia
                                </TabsTrigger>
                                <TabsTrigger value="education" className="gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    Educación
                                </TabsTrigger>
                                <TabsTrigger value="skills" className="gap-2">
                                    <Lightbulb className="h-4 w-4" />
                                    Habilidades
                                </TabsTrigger>
                                <TabsTrigger value="certifications" className="gap-2">
                                    <Award className="h-4 w-4" />
                                    Certificaciones
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="space-y-6">
                                <InfoCard icon={User} title="Información Personal">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                <User className="h-4 w-4" />
                                                Nombre Completo
                                            </Label>
                                            <Input
                                                value={editableData.informacion_personal?.nombre_completo || ''}
                                                onChange={(e) => updatePersonalInfo('nombre_completo', e.target.value)}
                                                placeholder="Tu nombre completo"
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                <Mail className="h-4 w-4" />
                                                Email
                                            </Label>
                                            <Input
                                                value={editableData.informacion_personal?.email || ''}
                                                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                                placeholder="tu@email.com"
                                                type="email"
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                <Phone className="h-4 w-4" />
                                                Teléfono
                                            </Label>
                                            <Input
                                                value={editableData.informacion_personal?.telefono || ''}
                                                onChange={(e) => updatePersonalInfo('telefono', e.target.value)}
                                                placeholder="+52 81 1234 5678"
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                <MapPin className="h-4 w-4" />
                                                Ubicación
                                            </Label>
                                            <Input
                                                value={editableData.informacion_personal?.direccion || ''}
                                                onChange={(e) => updatePersonalInfo('direccion', e.target.value)}
                                                placeholder="Ciudad, País"
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                <Linkedin className="h-4 w-4" />
                                                LinkedIn
                                            </Label>
                                            <Input
                                                value={editableData.informacion_personal?.linkedin || ''}
                                                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                                                placeholder="https://linkedin.com/in/usuario"
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                <Github className="h-4 w-4" />
                                                GitHub
                                            </Label>
                                            <Input
                                                value={editableData.informacion_personal?.github || ''}
                                                onChange={(e) => updatePersonalInfo('github', e.target.value)}
                                                placeholder="https://github.com/usuario"
                                                className="h-11"
                                            />
                                        </div>
                                    </div>
                                </InfoCard>
                            </TabsContent>

                            <TabsContent value="experience" className="space-y-6">
                                <InfoCard 
                                    icon={Briefcase} 
                                    title="Experiencia Laboral" 
                                    count={editableData.experiencia_laboral?.length || 0}
                                    onAdd={addExperience}
                                >
                                    {editableData.experiencia_laboral?.length > 0 ? (
                                        <div className="space-y-6">
                                            {editableData.experiencia_laboral.map((exp: any, index: number) => (
                                                <div key={index} className="border rounded-lg p-6 bg-muted/20 relative">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeExperience(index)}
                                                        className="absolute top-3 right-3 h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>

                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-12">
                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                                <Edit3 className="h-4 w-4" />
                                                                Cargo
                                                            </Label>
                                                            <Input
                                                                value={exp.cargo || ''}
                                                                onChange={(e) => updateExperience(index, 'cargo', e.target.value)}
                                                                placeholder="Ej: Desarrollador Senior"
                                                                className="h-11"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                                <Building className="h-4 w-4" />
                                                                Empresa
                                                            </Label>
                                                            <Input
                                                                value={exp.empresa || ''}
                                                                onChange={(e) => updateExperience(index, 'empresa', e.target.value)}
                                                                placeholder="Nombre de la empresa"
                                                                className="h-11"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                                <Calendar className="h-4 w-4" />
                                                                Fecha Inicio
                                                            </Label>
                                                            <Input
                                                                value={exp.fecha_inicio || ''}
                                                                onChange={(e) => updateExperience(index, 'fecha_inicio', e.target.value)}
                                                                placeholder="Ej: Enero 2020"
                                                                className="h-11"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                                <Calendar className="h-4 w-4" />
                                                                Fecha Fin
                                                            </Label>
                                                            <Input
                                                                value={exp.fecha_fin || ''}
                                                                onChange={(e) => updateExperience(index, 'fecha_fin', e.target.value)}
                                                                placeholder="Ej: Presente"
                                                                className="h-11"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={Briefcase}
                                            title="No se encontró experiencia laboral"
                                            description="Agrega tu experiencia profesional para mostrar tu trayectoria laboral"
                                        />
                                    )}
                                </InfoCard>
                            </TabsContent>

                            <TabsContent value="education" className="space-y-6">
                                <InfoCard 
                                    icon={GraduationCap} 
                                    title="Educación" 
                                    count={editableData.educacion?.length || 0}
                                    onAdd={addEducation}
                                >
                                    {editableData.educacion?.length > 0 ? (
                                        <div className="space-y-6">
                                            {editableData.educacion.map((edu: any, index: number) => (
                                                <div key={index} className="border rounded-lg p-6 bg-muted/20 relative">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeEducation(index)}
                                                        className="absolute top-3 right-3 h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>

                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-12">
                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                                <Award className="h-4 w-4" />
                                                                Título/Grado
                                                            </Label>
                                                            <Input
                                                                value={edu.titulo || ''}
                                                                onChange={(e) => updateEducation(index, 'titulo', e.target.value)}
                                                                placeholder="Ej: Licenciatura en Ingeniería"
                                                                className="h-11"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                                <Building className="h-4 w-4" />
                                                                Institución
                                                            </Label>
                                                            <Input
                                                                value={edu.institucion || ''}
                                                                onChange={(e) => updateEducation(index, 'institucion', e.target.value)}
                                                                placeholder="Nombre de la institución"
                                                                className="h-11"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={GraduationCap}
                                            title="No se encontró información educativa"
                                            description="Agrega tu formación académica para completar tu perfil profesional"
                                        />
                                    )}
                                </InfoCard>
                            </TabsContent>

                            <TabsContent value="skills" className="space-y-6">
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    <InfoCard 
                                        icon={Lightbulb} 
                                        title="Habilidades Técnicas" 
                                        count={editableData.habilidades?.tecnicas?.length || 0}
                                        onAdd={() => addSkill('tecnicas')}
                                    >
                                        {editableData.habilidades?.tecnicas?.length > 0 ? (
                                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                                {editableData.habilidades.tecnicas.map((skill: string, index: number) => (
                                                    <div key={index} className="flex gap-3 items-center">
                                                        <Input
                                                            value={skill}
                                                            onChange={(e) => updateSkill('tecnicas', index, e.target.value)}
                                                            placeholder="Ej: React, Python, AWS"
                                                            className="flex-1 h-10"
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeSkill('tecnicas', index)}
                                                            className="h-10 w-10 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <EmptyState
                                                icon={Lightbulb}
                                                title="No se encontraron habilidades técnicas"
                                                description="Agrega las tecnologías y herramientas que dominas"
                                            />
                                        )}
                                    </InfoCard>

                                    <InfoCard 
                                        icon={User} 
                                        title="Habilidades Blandas" 
                                        count={editableData.habilidades?.blandas?.length || 0}
                                        onAdd={() => addSkill('blandas')}
                                    >
                                        {editableData.habilidades?.blandas?.length > 0 ? (
                                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                                {editableData.habilidades.blandas.map((skill: string, index: number) => (
                                                    <div key={index} className="flex gap-3 items-center">
                                                        <Input
                                                            value={skill}
                                                            onChange={(e) => updateSkill('blandas', index, e.target.value)}
                                                            placeholder="Ej: Liderazgo, Comunicación"
                                                            className="flex-1 h-10"
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeSkill('blandas', index)}
                                                            className="h-10 w-10 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <EmptyState
                                                icon={User}
                                                title="No se encontraron habilidades blandas"
                                                description="Agrega tus habilidades interpersonales y de gestión"
                                            />
                                        )}
                                    </InfoCard>
                                </div>
                            </TabsContent>

                            <TabsContent value="certifications" className="space-y-6">
                                <InfoCard 
                                    icon={Award} 
                                    title="Certificaciones" 
                                    count={editableData.certificaciones?.length || 0}
                                    onAdd={addCertification}
                                >
                                    {editableData.certificaciones?.length > 0 ? (
                                        <div className="space-y-6">
                                            {editableData.certificaciones.map((cert: any, index: number) => (
                                                <div key={index} className="border rounded-lg p-6 bg-muted/20 relative">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeCertification(index)}
                                                        className="absolute top-3 right-3 h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>

                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-12">
                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                                <Award className="h-4 w-4" />
                                                                Nombre
                                                            </Label>
                                                            <Input
                                                                value={cert.nombre || ''}
                                                                onChange={(e) => updateCertification(index, 'nombre', e.target.value)}
                                                                placeholder="Ej: AWS Solutions Architect"
                                                                className="h-11"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                                <Building className="h-4 w-4" />
                                                                Emisor
                                                            </Label>
                                                            <Input
                                                                value={cert.emisor || ''}
                                                                onChange={(e) => updateCertification(index, 'emisor', e.target.value)}
                                                                placeholder="Ej: Amazon Web Services"
                                                                className="h-11"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={Award}
                                            title="No se encontraron certificaciones"
                                            description="Agrega las certificaciones profesionales que has obtenido"
                                        />
                                    )}
                                </InfoCard>
                            </TabsContent>
                        </Tabs>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}