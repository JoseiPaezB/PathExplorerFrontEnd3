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
import { ChevronDown, Star, Calendar, TrendingUp } from "lucide-react";
import { EvaluacionEmpleado } from "@/types/informes";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

const filterConfig = {
  CALIFICACION: {
    label: "Calificación",
    icon: Star,
    description: "Visualizar por rango de calificación"
  },
  PERIODO: {
    label: "Período",
    icon: Calendar,
    description: "Visualizar por período de evaluación"
  }
};

function EmployeeEvaluationsGraph({
  employeeEvaluations,
}: {
  employeeEvaluations: EvaluacionEmpleado[] | undefined;
}) {
  const [filter, setFilter] = useState<"CALIFICACION" | "PERIODO">(
    "CALIFICACION"
  );
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processData = (): DonutData[] => {
    if (!employeeEvaluations || employeeEvaluations.length === 0) {
      return [];
    }

    switch (filter) {
      case "CALIFICACION": {
        const calificacionCounts = {
          "Excelente (9-10)": 0,
          "Muy Bueno (7-8)": 0,
          "Bueno (5-6)": 0,
          "Regular (3-4)": 0,
          "Necesita Mejora (1-2)": 0,
        };

        employeeEvaluations.forEach((evaluation) => {
          const cal = evaluation.calificacion;
          if (cal >= 9) {
            calificacionCounts["Excelente (9-10)"]++;
          } else if (cal >= 7) {
            calificacionCounts["Muy Bueno (7-8)"]++;
          } else if (cal >= 5) {
            calificacionCounts["Bueno (5-6)"]++;
          } else if (cal >= 3) {
            calificacionCounts["Regular (3-4)"]++;
          } else {
            calificacionCounts["Necesita Mejora (1-2)"]++;
          }
        });

        return [
          {
            label: "Excelente (9-10)",
            value: calificacionCounts["Excelente (9-10)"],
            color: "hsl(142 71% 45%)", // Green for excellent
          },
          {
            label: "Muy Bueno (7-8)",
            value: calificacionCounts["Muy Bueno (7-8)"],
            color: "hsl(199 89% 48%)", // Light blue for very good
          },
          {
            label: "Bueno (5-6)",
            value: calificacionCounts["Bueno (5-6)"],
            color: "hsl(47 96% 53%)", // Yellow for good
          },
          {
            label: "Regular (3-4)",
            value: calificacionCounts["Regular (3-4)"],
            color: "hsl(38 92% 50%)", // Orange for regular
          },
          {
            label: "Necesita Mejora (1-2)",
            value: calificacionCounts["Necesita Mejora (1-2)"],
            color: "hsl(0 84% 60%)", // Red for needs improvement
          },
        ].filter(item => item.value > 0); // Only show ranges with data
      }

      case "PERIODO": {
        const periodoCounts: { [key: string]: number } = {};
        const now = new Date();

        employeeEvaluations.forEach((evaluation) => {
          const evalDate = new Date(evaluation.fecha);
          const monthsDiff =
            (now.getTime() - evalDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

          let periodo = "Otros";
          if (monthsDiff <= 3) {
            periodo = "Últimos 3 meses";
          } else if (monthsDiff <= 6) {
            periodo = "3-6 meses";
          } else if (monthsDiff <= 12) {
            periodo = "6-12 meses";
          } else {
            periodo = "Más de 1 año";
          }

          periodoCounts[periodo] = (periodoCounts[periodo] || 0) + 1;
        });

        const periodColors = {
          "Últimos 3 meses": "hsl(142 71% 45%)", // Green for recent
          "3-6 meses": "hsl(199 89% 48%)", // Blue for semi-recent
          "6-12 meses": "hsl(38 92% 50%)", // Orange for older
          "Más de 1 año": "hsl(0 84% 60%)", // Red for very old
          "Otros": "hsl(240 5% 64%)", // Gray for others
        };

        const orderedPeriods = [
          "Últimos 3 meses",
          "3-6 meses",
          "6-12 meses",
          "Más de 1 año",
          "Otros",
        ];

        return orderedPeriods
          .filter((periodo) => periodoCounts[periodo] > 0)
          .map((periodo) => ({
            label: periodo,
            value: periodoCounts[periodo],
            color: periodColors[periodo as keyof typeof periodColors],
          }));
      }

      default:
        return [];
    }
  };

  const data = processData();
  const totalEvaluations = data.reduce((sum, item) => sum + item.value, 0);

  const getChartTitle = () => {
    switch (filter) {
      case "CALIFICACION":
        return "Distribución por Calificación";
      case "PERIODO":
        return "Distribución por Período";
      default:
        return "Evaluaciones de Empleados";
    }
  };

  const getAverageScore = () => {
    if (!employeeEvaluations || employeeEvaluations.length === 0) return 0;
    const total = employeeEvaluations.reduce((sum, evaluation) => sum + evaluation.calificacion, 0);
    return (total / employeeEvaluations.length).toFixed(1);
  };

  const getScoreDistribution = () => {
    if (!employeeEvaluations || employeeEvaluations.length === 0) return { excellent: 0, good: 0, needsImprovement: 0 };
    const excellent = employeeEvaluations.filter(e => e.calificacion >= 9).length;
    const good = employeeEvaluations.filter(e => e.calificacion >= 7 && e.calificacion < 9).length;
    const needsImprovement = employeeEvaluations.filter(e => e.calificacion < 5).length;
    return { excellent, good, needsImprovement };
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
                return `${label}: ${value} evaluaciones (${percentage}%)`;
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

  if (!employeeEvaluations || employeeEvaluations.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <Star className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">No hay datos disponibles</h3>
              <p className="text-sm text-muted-foreground">
                No se encontraron evaluaciones de empleados para mostrar
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = filterConfig[filter].icon;
  const averageScore = getAverageScore();
  const scoreDistribution = getScoreDistribution();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Evaluaciones de Empleados
            </h3>
            <p className="text-sm text-muted-foreground">
              {filterConfig[filter].description}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 min-w-[130px]">
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
            <span>Total: {totalEvaluations} evaluaciones</span>
          </div>
          <div className="text-xs">•</div>
          <span>Promedio: {averageScore}/10</span>
          <div className="text-xs">•</div>
          <span className="capitalize">{getChartTitle().toLowerCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Chart */}
            <div className="xl:col-span-2">
              <div className="relative h-80 w-full">
                <canvas ref={chartRef} />
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{averageScore}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      Promedio
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
                  const percentage = totalEvaluations > 0 ? ((item.value / totalEvaluations) * 100).toFixed(1) : "0";
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

        {/* Stats Cards */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-foreground mb-4">Métricas Clave</h4>
          
          {/* Excellent Performance Card */}
          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Star className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">Excelente</h5>
                <p className="text-xs text-muted-foreground">Calificación 9-10</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {scoreDistribution.excellent}
              </div>
              <div className="text-xs text-muted-foreground">
                {totalEvaluations > 0 ? ((scoreDistribution.excellent / totalEvaluations) * 100).toFixed(1) : "0"}% del total
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalEvaluations > 0 ? (scoreDistribution.excellent / totalEvaluations) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Good Performance Card */}
          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">Muy Bueno</h5>
                <p className="text-xs text-muted-foreground">Calificación 7-8</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {scoreDistribution.good}
              </div>
              <div className="text-xs text-muted-foreground">
                {totalEvaluations > 0 ? ((scoreDistribution.good / totalEvaluations) * 100).toFixed(1) : "0"}% del total
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalEvaluations > 0 ? (scoreDistribution.good / totalEvaluations) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Needs Improvement Card */}
          <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Calendar className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">Necesita Mejora</h5>
                <p className="text-xs text-muted-foreground">Calificación &lt; 5</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {scoreDistribution.needsImprovement}
              </div>
              <div className="text-xs text-muted-foreground">
                {totalEvaluations > 0 ? ((scoreDistribution.needsImprovement / totalEvaluations) * 100).toFixed(1) : "0"}% del total
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalEvaluations > 0 ? (scoreDistribution.needsImprovement / totalEvaluations) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Average Score Card */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">Promedio General</h5>
                <p className="text-xs text-muted-foreground">Calificación promedio</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-foreground">
                {averageScore}
              </div>
              <div className="text-sm text-muted-foreground">
                / 10
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Basado en {totalEvaluations} evaluaciones
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeEvaluationsGraph;