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
import { ChevronDown, TrendingUp, BarChart3, Users } from "lucide-react";
import { TrayectoriaProfesional } from "@/types/informes";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

const filterConfig = {
  ETAPA: {
    label: "Etapa",
    icon: TrendingUp,
    description: "Visualizar por etapa de desarrollo"
  },
  PROGRESO: {
    label: "Progreso",
    icon: BarChart3,
    description: "Visualizar por rango de progreso"
  },
  "POR NOMBRE": {
    label: "Por Nombre",
    icon: Users,
    description: "Visualizar por nombre de trayectoria"
  }
};

function ProfessionalTrajectoryGraph({
  professionalTrajectory,
}: {
  professionalTrajectory: TrayectoriaProfesional[] | undefined;
}) {
  const [filter, setFilter] = useState<"ETAPA" | "PROGRESO" | "POR NOMBRE">(
    "ETAPA"
  );
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processData = (): DonutData[] => {
    if (!professionalTrajectory || professionalTrajectory.length === 0) {
      return [];
    }

    switch (filter) {
      case "ETAPA":
        const etapaCounts = {
          "FASE INICIAL": 0,
          "FASE INTERMEDIA": 0,
          "FASE AVANZADA": 0,
        };

        professionalTrajectory.forEach((trajectory) => {
          const etapa = trajectory.etapa_actual.toUpperCase();
          if (etapa in etapaCounts) {
            etapaCounts[etapa as keyof typeof etapaCounts]++;
          }
        });

        return [
          {
            label: "Fase Inicial",
            value: etapaCounts["FASE INICIAL"],
            color: "hsl(199 89% 48%)", // Blue for initial
          },
          {
            label: "Fase Intermedia",
            value: etapaCounts["FASE INTERMEDIA"],
            color: "hsl(38 92% 50%)", // Orange for intermediate
          },
          {
            label: "Fase Avanzada",
            value: etapaCounts["FASE AVANZADA"],
            color: "hsl(142 71% 45%)", // Green for advanced
          },
        ];

      case "PROGRESO":
        const progresoCounts = {
          "0-25%": 0,
          "26-50%": 0,
          "51-75%": 0,
          "76-100%": 0,
        };
        professionalTrajectory.forEach((trajectory) => {
          const progreso = parseFloat(trajectory.progreso);
          if (progreso >= 0 && progreso <= 25) {
            progresoCounts["0-25%"]++;
          } else if (progreso > 25 && progreso <= 50) {
            progresoCounts["26-50%"]++;
          } else if (progreso > 50 && progreso <= 75) {
            progresoCounts["51-75%"]++;
          } else if (progreso > 75 && progreso <= 100) {
            progresoCounts["76-100%"]++;
          }
        });

        return [
          {
            label: "0-25%",
            value: progresoCounts["0-25%"],
            color: "hsl(0 84% 60%)", // Red for low progress
          },
          {
            label: "26-50%",
            value: progresoCounts["26-50%"],
            color: "hsl(25 95% 53%)", // Orange-red for medium-low
          },
          {
            label: "51-75%",
            value: progresoCounts["51-75%"],
            color: "hsl(38 92% 50%)", // Orange for medium-high
          },
          {
            label: "76-100%",
            value: progresoCounts["76-100%"],
            color: "hsl(142 71% 45%)", // Green for high progress
          },
        ];

      case "POR NOMBRE":
        const nombreCounts: { [key: string]: number } = {};
        professionalTrajectory.forEach((trajectory) => {
          const nombre = trajectory.nombre;
          if (nombre in nombreCounts) {
            nombreCounts[nombre]++;
          } else {
            nombreCounts[nombre] = 1;
          }
        });

        const nombreColors = [
          "hsl(221 83% 53%)", // Blue
          "hsl(142 71% 45%)", // Green
          "hsl(38 92% 50%)",  // Orange
          "hsl(280 100% 70%)", // Purple
          "hsl(0 84% 60%)",   // Red
          "hsl(199 89% 48%)", // Light blue
          "hsl(47 96% 53%)",  // Yellow
          "hsl(340 75% 55%)", // Pink
        ];

        const nombres = Object.keys(nombreCounts).slice(0, 8); // Show top 8
        return nombres.map((nombre, index) => ({
          label: nombre.length > 20 ? nombre.substring(0, 20) + "..." : nombre,
          value: nombreCounts[nombre],
          color: nombreColors[index % nombreColors.length],
        }));

      default:
        return [];
    }
  };

  const data = processData();
  const totalTrajectories = data.reduce((sum, item) => sum + item.value, 0);

  const getChartTitle = () => {
    switch (filter) {
      case "ETAPA":
        return "Distribución por Etapa";
      case "PROGRESO":
        return "Distribución por Progreso";
      case "POR NOMBRE":
        return "Distribución por Trayectoria";
      default:
        return "Trayectorias Profesionales";
    }
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
                return `${label}: ${value} trayectorias (${percentage}%)`;
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
  }, [data, filter]);

  if (!professionalTrajectory || professionalTrajectory.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <TrendingUp className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">No hay datos disponibles</h3>
              <p className="text-sm text-muted-foreground">
                No se encontraron trayectorias profesionales para mostrar
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
              <TrendingUp className="h-5 w-5 text-primary" />
              Trayectorias Profesionales
            </h3>
            <p className="text-sm text-muted-foreground">
              {filterConfig[filter].description}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 min-w-[120px]">
                <IconComponent className="h-4 w-4" />
                <span>{filterConfig[filter].label}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
        </div>

        {/* Stats Summary */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>Total: {totalTrajectories} trayectorias</span>
          </div>
          <div className="text-xs">•</div>
          <span className="capitalize">{getChartTitle().toLowerCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="relative h-80 w-full">
            <canvas ref={chartRef} />
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{totalTrajectories}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Total Trayectorias
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-foreground mb-4">Distribución</h4>
          <div className="space-y-2">
            {data.map((item, index) => {
              const percentage = totalTrajectories > 0 ? ((item.value / totalTrajectories) * 100).toFixed(1) : "0";
              return (
                <div key={index} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div 
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-medium text-foreground truncate">
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
    </div>
  );
}

export default ProfessionalTrajectoryGraph;