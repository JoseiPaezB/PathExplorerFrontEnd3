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
import { ChevronDown, Target, Clock, AlertCircle } from "lucide-react";
import { MetaProfesional } from "@/types/informes";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

const filterConfig = {
  ESTADO: {
    label: "Estado",
    icon: Target,
    description: "Visualizar por estado de completitud"
  },
  PLAZO: {
    label: "Plazo",
    icon: Clock,
    description: "Visualizar por plazo de ejecución"
  },
  PRIORIDAD: {
    label: "Prioridad",
    icon: AlertCircle,
    description: "Visualizar por nivel de prioridad"
  }
};

function ProfessionalGoalsGraph({
  professionalGoals,
}: {
  professionalGoals: MetaProfesional[] | undefined;
}) {
  const [filter, setFilter] = useState<"ESTADO" | "PLAZO" | "PRIORIDAD">(
    "ESTADO"
  );
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processData = (): DonutData[] => {
    if (!professionalGoals || professionalGoals.length === 0) {
      return [];
    }

    switch (filter) {
      case "ESTADO":
        const estadoCounts = {
          COMPLETADA: 0,
          EN_PROGRESO: 0,
          PENDIENTE: 0,
          CANCELADA: 0,
        };

        professionalGoals.forEach((goal) => {
          if (goal.estado in estadoCounts) {
            estadoCounts[goal.estado as keyof typeof estadoCounts]++;
          }
        });

        return [
          {
            label: "Completada",
            value: estadoCounts.COMPLETADA,
            color: "hsl(142 71% 45%)", // Success green
          },
          {
            label: "En Progreso",
            value: estadoCounts.EN_PROGRESO,
            color: "hsl(221 83% 53%)", // Primary blue
          },
          {
            label: "Pendiente",
            value: estadoCounts.PENDIENTE,
            color: "hsl(38 92% 50%)", // Warning orange
          },
          {
            label: "Cancelada",
            value: estadoCounts.CANCELADA,
            color: "hsl(0 84% 60%)", // Destructive red
          },
        ];

      case "PLAZO":
        const plazoCounts = {
          CORTO: 0,
          MEDIANO: 0,
          LARGO: 0,
        };

        professionalGoals.forEach((goal) => {
          if (goal.plazo in plazoCounts) {
            plazoCounts[goal.plazo as keyof typeof plazoCounts]++;
          }
        });

        return [
          {
            label: "Corto Plazo",
            value: plazoCounts.CORTO,
            color: "hsl(0 84% 60%)", // Red for urgent
          },
          {
            label: "Mediano Plazo",
            value: plazoCounts.MEDIANO,
            color: "hsl(38 92% 50%)", // Orange for medium
          },
          {
            label: "Largo Plazo",
            value: plazoCounts.LARGO,
            color: "hsl(142 71% 45%)", // Green for long-term
          },
        ];

      case "PRIORIDAD":
        const prioridadCounts: { [key: number]: number } = {};

        professionalGoals.forEach((goal) => {
          prioridadCounts[goal.prioridad] =
            (prioridadCounts[goal.prioridad] || 0) + 1;
        });

        const prioridadColors = [
          "hsl(0 84% 60%)",    // Priority 1 - Red (highest)
          "hsl(25 95% 53%)",   // Priority 2 - Orange-red
          "hsl(38 92% 50%)",   // Priority 3 - Orange
          "hsl(47 96% 53%)",   // Priority 4 - Yellow-orange
          "hsl(142 71% 45%)",  // Priority 5 - Green (lowest)
        ];

        return Object.entries(prioridadCounts)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([prioridad, count], index) => ({
            label: `Prioridad ${prioridad}`,
            value: count,
            color: prioridadColors[index] || "hsl(240 5% 64%)",
          }));

      default:
        return [];
    }
  };

  const data = processData();
  const totalGoals = data.reduce((sum, item) => sum + item.value, 0);

  const getChartTitle = () => {
    switch (filter) {
      case "ESTADO":
        return "Distribución por Estado";
      case "PLAZO":
        return "Distribución por Plazo";
      case "PRIORIDAD":
        return "Distribución por Prioridad";
      default:
        return "Metas Profesionales";
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
                return `${label}: ${value} metas (${percentage}%)`;
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

  if (!professionalGoals || professionalGoals.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <Target className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">No hay datos disponibles</h3>
              <p className="text-sm text-muted-foreground">
                No se encontraron metas profesionales para mostrar
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
              <Target className="h-5 w-5 text-primary" />
              Metas Profesionales
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
            <span>Total: {totalGoals} metas</span>
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
                <div className="text-2xl font-bold text-foreground">{totalGoals}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Total Metas
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
              const percentage = totalGoals > 0 ? ((item.value / totalGoals) * 100).toFixed(1) : "0";
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

export default ProfessionalGoalsGraph;