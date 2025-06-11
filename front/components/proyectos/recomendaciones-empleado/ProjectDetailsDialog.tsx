import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, MapPin, Clock, Target, Star, Award, Briefcase } from "lucide-react";
import { RecommendedRole, Skill } from "@/types/recommendations";

interface ProjectDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRole: RecommendedRole | null;
  onClose: () => void;
}

export function ProjectDetailsDialog({
  open,
  onOpenChange,
  selectedRole,
  onClose,
}: ProjectDetailsDialogProps) {
  if (!selectedRole) return null;

  const project = selectedRole.roleWithProject?.project?.[0];
  const manager = selectedRole.roleWithProject?.manager?.[0];
  const role = selectedRole.roleWithProject;

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EN_PROGRESO":
        return "bg-success/10 text-success border-success/20";
      case "PLANIFICACION":
        return "bg-info/10 text-info border-info/20";
      case "PAUSADO":
        return "bg-warning/10 text-warning border-warning/20";
      case "FINALIZADO":
        return "bg-muted/30 text-muted-foreground border-muted";
      default:
        return "bg-muted/30 text-muted-foreground border-muted";
    }
  };

  const getImportanceBadgeColor = (importancia: string) => {
    const level = parseInt(importancia);
    if (level >= 4) return "bg-destructive/10 text-destructive border-destructive/20";
    if (level >= 3) return "bg-warning/10 text-warning border-warning/20";
    return "bg-muted/30 text-muted-foreground border-muted";
  };

  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 80) return "bg-success/10 text-success border-success/20";
    if (compatibility >= 60) return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const compatibility = selectedRole.compatibilidad || 85;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="flex items-center gap-3 text-card-foreground">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="text-xl font-bold">Detalles del Proyecto y Rol</span>
              <Badge className={`ml-3 ${getStatusColor(project?.estado || "")}`}>
                {project?.estado?.replace("_", " ") || "Estado desconocido"}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Información completa sobre el proyecto y el rol seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Información del Proyecto */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/20 rounded-lg">
                <Briefcase className="h-5 w-5 text-info" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">
                Información del Proyecto
              </h3>
            </div>

            <div className="bg-accent/20 rounded-xl p-6 border border-accent/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-card/50 rounded-lg p-4 border border-border">
                    <p className="text-sm font-semibold text-primary mb-2">
                      Nombre del Proyecto
                    </p>
                    <p className="text-foreground font-medium">
                      {project?.nombre || "No especificado"}
                    </p>
                  </div>

                  <div className="bg-card/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-primary">
                        Fecha de Inicio
                      </p>
                    </div>
                    <p className="text-foreground font-medium">
                      {formatDate(project?.fecha_inicio || "")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-card/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-primary">
                        Fecha Estimada de Finalización
                      </p>
                    </div>
                    <p className="text-foreground font-medium">
                      {formatDate(project?.fecha_fin_estimada || "")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-primary mb-3">
                  Descripción del Proyecto
                </p>
                <div className="bg-card/50 rounded-lg p-4 border border-border">
                  <p className="text-foreground leading-relaxed">
                    {project?.descripcion || "No hay descripción disponible"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Información del Rol */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Award className="h-5 w-5 text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">
                Información del Rol
              </h3>
            </div>

            <div className="bg-warning/10 rounded-xl p-6 border border-warning/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card/50 rounded-lg p-4 border border-border">
                  <p className="text-sm font-semibold text-primary mb-2">
                    Título del Rol
                  </p>
                  <p className="text-foreground font-medium">
                    {role?.titulo || "No especificado"}
                  </p>
                </div>

                <div className="bg-card/50 rounded-lg p-4 border border-border">
                  <p className="text-sm font-semibold text-primary mb-2">
                    Nivel de Experiencia Requerido
                  </p>
                  <p className="text-foreground font-medium">
                    {role?.nivel_experiencia_requerido
                      ? `Nivel ${role.nivel_experiencia_requerido}`
                      : "No especificado"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-primary mb-3">
                  Descripción del Rol
                </p>
                <div className="bg-card/50 rounded-lg p-4 border border-border">
                  <p className="text-foreground leading-relaxed">
                    {role?.descripcion || "No hay descripción disponible"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Manager Information */}
          {manager && (
            <>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/20 rounded-lg">
                    <User className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground">
                    Manager del Proyecto
                  </h3>
                </div>

                <div className="bg-success/10 rounded-xl p-6 border border-success/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card/50 rounded-lg p-4 border border-border">
                      <p className="text-sm font-semibold text-primary mb-2">
                        Nombre Completo
                      </p>
                      <p className="text-foreground font-medium">
                        {`${manager.nombre} ${manager.apellido}`}
                      </p>
                    </div>

                    <div className="bg-card/50 rounded-lg p-4 border border-border">
                      <p className="text-sm font-semibold text-primary mb-2">
                        Email
                      </p>
                      <p className="text-foreground font-medium">
                        {manager.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />
            </>
          )}

          {/* Habilidades Requeridas */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">
                Habilidades Requeridas
              </h3>
            </div>

            {role?.skills && role.skills.length > 0 ? (
              <div className="space-y-4">
                {role.skills.map((skill: Skill, index: number) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl p-5 border border-border hover:border-primary/30 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-foreground">
                            {skill.nombre}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className="bg-accent/30 text-foreground border-accent"
                          >
                            {skill.categoria}
                          </Badge>
                        </div>
                        {skill.descripcion && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {skill.descripcion}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right space-y-2">
                        <div className="bg-accent/20 rounded-lg p-3 border border-accent/30">
                          <p className="text-xs font-medium text-primary mb-1">
                            Nivel mínimo
                          </p>
                          <p className="font-bold text-lg text-foreground">
                            {skill.nivel_minimo_requerido}
                          </p>
                        </div>
                        
                        <Badge
                          className={`text-xs font-medium ${getImportanceBadgeColor(skill.importancia || "1")}`}
                        >
                          Importancia: <span className="font-bold">{skill.importancia}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-xl p-6 border border-muted text-center">
                <p className="text-muted-foreground">
                  No hay habilidades específicas definidas para este rol
                </p>
              </div>
            )}
          </div>

          {/* Compatibilidad */}
          <div className={`rounded-xl p-6 border ${getCompatibilityColor(compatibility)}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Star className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">
                    Tu Compatibilidad
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Basada en tus habilidades y experiencia actual
                </p>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${compatibility >= 80 ? 'text-success' : compatibility >= 60 ? 'text-warning' : 'text-destructive'}`}>
                  {compatibility}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Compatibilidad
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-card border-border text-card-foreground hover:bg-accent/50"
          >
            Cerrar
          </Button>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Aplicar a este Rol
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}