import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { ChartConfiguration } from "chart.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Brain, Users, BarChart3, Star } from "lucide-react";
import { HabilidadRequeridaRol, Rol } from "@/types/informes";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

const filterConfig = {
  TODOS: {
    label: "Todas",
    icon: Brain,
    description: "Vista general de todas las habilidades"
  },
  "POR ROL": {
    label: "Por Rol",
    icon: Users,
    description: "Filtrar por rol específico"
  },
  "POR NIVEL": {
    label: "Por Nivel",
    icon: BarChart3,
    description: "Agrupar por nivel mínimo requerido"
  },
  "POR IMPORTANCIA": {
    label: "Por Importancia",
    icon: Star,
    description: "Agrupar por nivel de importancia"
  }
};

// Predefined color palette for consistent visualization
const skillColors = [
  "hsl(221 83% 53%)", // Blue
  "hsl(142 71% 45%)", // Green
  "hsl(38 92% 50%)",  // Orange
  "hsl(280 100% 70%)", // Purple
  "hsl(0 84% 60%)",   // Red
  "hsl(199 89% 48%)", // Light blue
  "hsl(47 96% 53%)",  // Yellow
  "hsl(340 75% 55%)", // Pink
  "hsl(167 85% 45%)", // Teal
  "hsl(262 83% 58%)", // Violet
];

function MostRequiredSkillsForRoleGraph({
  requiredAbilitiesForRoles,
  roles,
}: {
  requiredAbilitiesForRoles: HabilidadRequeridaRol[] | undefined;
  roles: Rol[] | undefined;
}) {
  const [filter, setFilter] = useState<
    "TODOS" | "POR ROL" | "POR NIVEL" | "POR IMPORTANCIA"
  >("TODOS");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processData = (): DonutData[] => {
    if (!requiredAbilitiesForRoles || requiredAbilitiesForRoles.length === 0) {
      return [];
    }

    switch (filter) {
      case "POR ROL":
        if (!roleFilter) return [];
        const filteredByRole = requiredAbilitiesForRoles.filter(
          (skill) => skill.titulo === roleFilter
        );
        const skillCounts: { [key: string]: number } = {};
        filteredByRole.forEach((skill) => {
          skillCounts[skill.nombre] = (skillCounts[skill.nombre] || 0) + 1;
        });

        return Object.entries(skillCounts)
          .sort(([,a], [,b]) => b - a) // Sort by frequency
          .slice(0, 10) // Limit to top 10
          .map(([label, value], index) => ({
            label: label.length > 25 ? label.substring(0, 25) + "..." : label,
            value,
            color: skillColors[index % skillColors.length],
          }));

      case "POR NIVEL":
        const levelCounts = {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0,
        };

        requiredAbilitiesForRoles.forEach((skill) => {
          const level = String(skill.nivel_minimo_requerido);
          if (level in levelCounts) {
            levelCounts[level as keyof typeof levelCounts]++;
          }
        });

        return [
          {
            label: "Nivel 1 (Básico)",
            value: levelCounts["1"],
            color: "hsl(142 71% 45%)", // Green for basic
          },
          {
            label: "Nivel 2 (Intermedio Bajo)",
            value: levelCounts["2"],
            color: "hsl(47 96% 53%)", // Yellow
          },
          {
            label: "Nivel 3 (Intermedio)",
            value: levelCounts["3"],
            color: "hsl(38 92% 50%)", // Orange
          },
          {
            label: "Nivel 4 (Avanzado)",
            value: levelCounts["4"],
            color: "hsl(25 95% 53%)", // Orange-red
          },
          {
            label: "Nivel 5 (Experto)",
            value: levelCounts["5"],
            color: "hsl(0 84% 60%)", // Red for expert
          },
        ].filter(item => item.value > 0); // Only show levels with data

      case "POR IMPORTANCIA":
        const importanceCounts = {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0,
        };

        requiredAbilitiesForRoles.forEach((skill) => {
          const importance = String(skill.importancia);
          if (importance in importanceCounts) {
            importanceCounts[importance as keyof typeof importanceCounts]++;
          }
        });

        return [
          {
            label: "Importancia 1 (Baja)",
            value: importanceCounts["1"],
            color: "hsl(240 5% 64%)", // Gray for low importance
          },
          {
            label: "Importancia 2 (Media-Baja)",
            value: importanceCounts["2"],
            color: "hsl(199 89% 48%)", // Light blue
          },
          {
            label: "Importancia 3 (Media)",
            value: importanceCounts["3"],
            color: "hsl(38 92% 50%)", // Orange
          },
          {
            label: "Importancia 4 (Alta)",
            value: importanceCounts["4"],
            color: "hsl(25 95% 53%)", // Orange-red
          },
          {
            label: "Importancia 5 (Crítica)",
            value: importanceCounts["5"],
            color: "hsl(0 84% 60%)", // Red for critical
          },
        ].filter(item => item.value > 0); // Only show levels with data

      default: // TODOS
        const allCounts: { [key: string]: number } = {};
        requiredAbilitiesForRoles.forEach((skill) => {
          allCounts[skill.nombre] = (allCounts[skill.nombre] || 0) + 1;
        });
        return Object.entries(allCounts)
          .sort(([,a], [,b]) => b - a) // Sort by frequency  
          .slice(0, 10) // Limit to top 10 most required skills
          .map(([label, value], index) => ({
            label: label.length > 25 ? label.substring(0, 25) + "..." : label,
            value,
            color: skillColors[index % skillColors.length],
          }));
    }
  };

  const data = processData();
  const totalSkills = data.reduce((sum, item) => sum + item.value, 0);

  const getChartTitle = () => {
    switch (filter) {
      case "POR ROL":
        return roleFilter ? `Habilidades para ${roleFilter}` : "Seleccione un Rol";
      case "POR NIVEL":
        return "Distribución por Nivel Mínimo";
      case "POR IMPORTANCIA":
        return "Distribución por Importancia";
      default:
        return "Top 10 Habilidades Más Requeridas";
    }
  };

  const getSubtitle = () => {
    if (filter === "POR ROL" && roleFilter) {
      return `Habilidades específicas requeridas para el rol de ${roleFilter}`;
    }
    return filterConfig[filter].description;
  };

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: "doughnut",
      data: {
        labels: data.map((item) => item.label),
        datasets: [
          {
            data: data.map((item) => item.value),
            backgroundColor: data.map((item) => item.color),
            borderColor: "hsl(0 0% 100%)",
            borderWidth: 3,
            hoverOffset: 8,
            hoverBorderWidth: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: {
            display: false, // We'll create a custom legend
          },
          title: {
            display: false, // We'll use our own title
          },
          tooltip: {
            backgroundColor: "hsl(0 0% 3.9%)",
            titleColor: "hsl(0 0% 98%)",
            bodyColor: "hsl(0 0% 98%)",
            borderColor: "hsl(0 0% 14.9%)",
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            titleFont: {
              size: 14,
              weight: "600",
            },
            bodyFont: {
              size: 13,
            },
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.parsed || 0;
                const dataset = context.dataset;
                const total = dataset.data.reduce(
                  (sum: number, val: any) => sum + val,
                  0
                );
                const percentage =
                  total > 0 ? ((value / total) * 100).toFixed(1) : "0";
                return `${label}: ${value} requisitos (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 800,
          easing: 'easeInOutCubic',
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, filter, roleFilter]);

  // Reset role filter when changing away from "POR ROL"
  useEffect(() => {
    if (filter !== "POR ROL") {
      setRoleFilter(null);
    }
  }, [filter]);

  if (!requiredAbilitiesForRoles || requiredAbilitiesForRoles.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <Brain className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">No hay datos disponibles</h3>
              <p className="text-sm text-muted-foreground">
                No se encontraron habilidades requeridas para mostrar
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = filterConfig[filter].icon;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Habilidades Requeridas por Rol
            </h3>
            <p className="text-sm text-muted-foreground">
              {getSubtitle()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 min-w-[140px]">
                  <IconComponent className="h-4 w-4" />
                  <span>{filterConfig[filter].label}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(filterConfig) as Array<keyof typeof filterConfig>).map((key) => {
                  const config = filterConfig[key];
                  const Icon = config.icon;
                  return (
                    <DropdownMenuItem 
                      key={key}
                      onSelect={() => setFilter(key)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{config.label}</span>
                        <span className="text-xs text-muted-foreground">{config.description}</span>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            {filter === "POR ROL" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 min-w-[160px]">
                    <Users className="h-4 w-4" />
                    <span className="truncate">{roleFilter || "Seleccionar Rol"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="max-h-48 overflow-y-auto w-64"
                >
                  <DropdownMenuLabel>Seleccionar Rol</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {roles?.map((role: Rol) => (
                    <DropdownMenuItem
                      key={role?.id_rol}
                      onSelect={() => setRoleFilter(role?.titulo)}
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      <span className="truncate">{role.titulo}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>Total: {totalSkills} requisitos</span>
          </div>
          <div className="text-xs">•</div>
          <span className="capitalize">{getChartTitle().toLowerCase()}</span>
          {filter === "POR ROL" && roleFilter && (
            <>
              <div className="text-xs">•</div>
              <span>Rol: {roleFilter}</span>
            </>
          )}
        </div>
      </div>

      {filter === "POR ROL" && !roleFilter ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Seleccione un rol</h3>
              <p className="text-sm text-muted-foreground">
                Elija un rol específico para ver sus habilidades requeridas
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2">
            <div className="relative h-80 w-full">
              <canvas ref={chartRef} />
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{totalSkills}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Requisitos
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-foreground mb-4">Distribución</h4>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {data.map((item, index) => {
                const percentage = totalSkills > 0 ? ((item.value / totalSkills) * 100).toFixed(1) : "0";
                return (
                  <div key={index} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div 
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-medium text-foreground truncate" title={item.label}>
                        {item.label}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="text-xs font-semibold text-foreground">
                        {item.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground leading-tight">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {data.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Sin datos para mostrar</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MostRequiredSkillsForRoleGraph;