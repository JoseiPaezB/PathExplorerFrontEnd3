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
import { ChevronDown, BookOpen, Star, Tag, CheckCircle } from "lucide-react";
import { CursoEmpleado } from "@/types/informes";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

const filterConfig = {
  ESTADO: {
    label: "Estado",
    icon: CheckCircle,
    description: "Visualizar por estado de completitud"
  },
  CALIFICACION: {
    label: "Calificación",
    icon: Star,
    description: "Visualizar por rango de calificación"
  },
  CATEGORIA: {
    label: "Categoría",
    icon: Tag,
    description: "Visualizar por área de conocimiento"
  }
};

// Category-specific colors for better visual distinction
const categoryColors = {
  "Desarrollo": "hsl(221 83% 53%)", // Blue for development
  "Cloud & DevOps": "hsl(199 89% 48%)", // Light blue for cloud
  "Gestión & Agilidad": "hsl(142 71% 45%)", // Green for management
  "Data & ML": "hsl(280 100% 70%)", // Purple for data science
  "Seguridad": "hsl(0 84% 60%)", // Red for security
  "Diseño": "hsl(340 75% 55%)", // Pink for design
  "Otros": "hsl(240 5% 64%)", // Gray for others
};

function EmployeeCoursesGraph({
  employeeCourses,
}: {
  employeeCourses: CursoEmpleado[] | undefined;
}) {
  const [filter, setFilter] = useState<"ESTADO" | "CALIFICACION" | "CATEGORIA">(
    "ESTADO"
  );
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processData = (): DonutData[] => {
    if (!employeeCourses || employeeCourses.length === 0) {
      return [];
    }

    switch (filter) {
      case "ESTADO": {
        const estadoCounts = {
          "Completado": 0,
          "En progreso": 0,
          "No iniciado": 0,
        };

        employeeCourses.forEach((course) => {
          const progress = parseFloat(course.progreso || "0");
          const hasFinished = course.fecha_finalizacion !== null;

          if (progress === 100 || hasFinished) {
            estadoCounts["Completado"]++;
          } else if (progress > 0) {
            estadoCounts["En progreso"]++;
          } else {
            estadoCounts["No iniciado"]++;
          }
        });

        return [
          {
            label: "Completado",
            value: estadoCounts["Completado"],
            color: "hsl(142 71% 45%)", // Green for completed
          },
          {
            label: "En progreso",
            value: estadoCounts["En progreso"],
            color: "hsl(38 92% 50%)", // Orange for in progress
          },
          {
            label: "No iniciado",
            value: estadoCounts["No iniciado"],
            color: "hsl(240 5% 64%)", // Gray for not started
          },
        ].filter(item => item.value > 0); // Only show states with data
      }

      case "CALIFICACION": {
        const calificacionCounts = {
          "Excelente (90-100)": 0,
          "Bueno (80-89)": 0,
          "Regular (70-79)": 0,
          "Bajo (< 70)": 0,
          "Sin calificación": 0,
        };

        employeeCourses.forEach((course) => {
          if (!course.calificacion) {
            calificacionCounts["Sin calificación"]++;
          } else {
            const cal = parseFloat(course.calificacion);
            if (cal >= 90) {
              calificacionCounts["Excelente (90-100)"]++;
            } else if (cal >= 80) {
              calificacionCounts["Bueno (80-89)"]++;
            } else if (cal >= 70) {
              calificacionCounts["Regular (70-79)"]++;
            } else {
              calificacionCounts["Bajo (< 70)"]++;
            }
          }
        });

        return [
          {
            label: "Excelente (90-100)",
            value: calificacionCounts["Excelente (90-100)"],
            color: "hsl(142 71% 45%)", // Green for excellent
          },
          {
            label: "Bueno (80-89)",
            value: calificacionCounts["Bueno (80-89)"],
            color: "hsl(199 89% 48%)", // Light blue for good
          },
          {
            label: "Regular (70-79)",
            value: calificacionCounts["Regular (70-79)"],
            color: "hsl(47 96% 53%)", // Yellow for regular
          },
          {
            label: "Bajo (< 70)",
            value: calificacionCounts["Bajo (< 70)"],
            color: "hsl(0 84% 60%)", // Red for low
          },
          {
            label: "Sin calificación",
            value: calificacionCounts["Sin calificación"],
            color: "hsl(240 5% 64%)", // Gray for no grade
          },
        ].filter(item => item.value > 0); // Only show grades with data
      }

      case "CATEGORIA": {
        const categoriaCounts: { [key: string]: number } = {};

        employeeCourses.forEach((course) => {
          // Categorizar cursos basándose en el nombre
          let categoria = "Otros";
          const courseName = course.nombre.toLowerCase();

          if (
            courseName.includes("java") ||
            courseName.includes("python") ||
            courseName.includes("react") ||
            courseName.includes("angular") ||
            courseName.includes("spring boot") ||
            courseName.includes("javascript") ||
            courseName.includes("node") ||
            courseName.includes("programming")
          ) {
            categoria = "Desarrollo";
          } else if (
            courseName.includes("cloud") ||
            courseName.includes("azure") ||
            courseName.includes("aws") ||
            courseName.includes("kubernetes") ||
            courseName.includes("docker") ||
            courseName.includes("devops")
          ) {
            categoria = "Cloud & DevOps";
          } else if (
            courseName.includes("scrum") ||
            courseName.includes("agile") ||
            courseName.includes("management") ||
            courseName.includes("leadership") ||
            courseName.includes("project") ||
            courseName.includes("team")
          ) {
            categoria = "Gestión & Agilidad";
          } else if (
            courseName.includes("data") ||
            courseName.includes("machine learning") ||
            courseName.includes("big data") ||
            courseName.includes("sql") ||
            courseName.includes("tensorflow") ||
            courseName.includes("analytics") ||
            courseName.includes("ai")
          ) {
            categoria = "Data & ML";
          } else if (
            courseName.includes("security") ||
            courseName.includes("cybersecurity") ||
            courseName.includes("ethical hacking")
          ) {
            categoria = "Seguridad";
          } else if (
            courseName.includes("ui/ux") ||
            courseName.includes("design") ||
            courseName.includes("figma") ||
            courseName.includes("user experience")
          ) {
            categoria = "Diseño";
          }

          categoriaCounts[categoria] = (categoriaCounts[categoria] || 0) + 1;
        });

        return Object.entries(categoriaCounts)
          .sort(([,a], [,b]) => b - a) // Sort by frequency
          .map(([categoria, count]) => ({
            label: categoria,
            value: count,
            color: categoryColors[categoria as keyof typeof categoryColors] || "hsl(240 5% 64%)",
          }));
      }

      default:
        return [];
    }
  };

  const data = processData();
  const totalCourses = data.reduce((sum, item) => sum + item.value, 0);

  const getChartTitle = () => {
    switch (filter) {
      case "ESTADO":
        return "Distribución por Estado";
      case "CALIFICACION":
        return "Distribución por Calificación";
      case "CATEGORIA":
        return "Distribución por Categoría";
      default:
        return "Cursos de Empleados";
    }
  };

  const getCourseStats = () => {
    if (!employeeCourses || employeeCourses.length === 0) {
      return { completed: 0, inProgress: 0, averageGrade: 0, withGrades: 0 };
    }

    const completed = employeeCourses.filter(course => {
      const progress = parseFloat(course.progreso || "0");
      return progress === 100 || course.fecha_finalizacion !== null;
    }).length;

    const inProgress = employeeCourses.filter(course => {
      const progress = parseFloat(course.progreso || "0");
      return progress > 0 && progress < 100 && !course.fecha_finalizacion;
    }).length;

    const coursesWithGrades = employeeCourses.filter(course => course.calificacion);
    const withGrades = coursesWithGrades.length;
    const averageGrade = withGrades > 0 
      ? coursesWithGrades.reduce((sum, course) => sum + parseFloat(course.calificacion), 0) / withGrades
      : 0;

    return { completed, inProgress, averageGrade, withGrades };
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
                return `${label}: ${value} cursos (${percentage}%)`;
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

  if (!employeeCourses || employeeCourses.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">No hay datos disponibles</h3>
              <p className="text-sm text-muted-foreground">
                No se encontraron cursos de empleados para mostrar
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = filterConfig[filter].icon;
  const courseStats = getCourseStats();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Cursos de Empleados
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
            <span>Total: {totalCourses} cursos</span>
          </div>
          <div className="text-xs">•</div>
          <span>Completados: {courseStats.completed}</span>
          {courseStats.averageGrade > 0 && (
            <>
              <div className="text-xs">•</div>
              <span>Promedio: {courseStats.averageGrade.toFixed(1)}/100</span>
            </>
          )}
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
                    <div className="text-2xl font-bold text-foreground">{totalCourses}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      Cursos
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
                  const percentage = totalCourses > 0 ? ((item.value / totalCourses) * 100).toFixed(1) : "0";
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
          <h4 className="font-medium text-sm text-foreground mb-4">Progreso de Aprendizaje</h4>
          
          {/* Completed Courses Card */}
          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">Completados</h5>
                <p className="text-xs text-muted-foreground">Cursos finalizados</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {courseStats.completed}
              </div>
              <div className="text-xs text-muted-foreground">
                {totalCourses > 0 ? ((courseStats.completed / totalCourses) * 100).toFixed(1) : "0"}% del total
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalCourses > 0 ? (courseStats.completed / totalCourses) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* In Progress Card */}
          <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <BookOpen className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">En Progreso</h5>
                <p className="text-xs text-muted-foreground">Cursos iniciados</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {courseStats.inProgress}
              </div>
              <div className="text-xs text-muted-foreground">
                {totalCourses > 0 ? ((courseStats.inProgress / totalCourses) * 100).toFixed(1) : "0"}% del total
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalCourses > 0 ? (courseStats.inProgress / totalCourses) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Average Grade Card */}
          {courseStats.withGrades > 0 && (
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Star className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium text-sm text-foreground">Promedio</h5>
                  <p className="text-xs text-muted-foreground">Calificación promedio</p>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-foreground">
                  {courseStats.averageGrade.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">
                  / 100
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Basado en {courseStats.withGrades} calificaciones
              </div>
            </div>
          )}

          {/* Total Courses Card */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">Total Cursos</h5>
                <p className="text-xs text-muted-foreground">Cursos registrados</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {totalCourses}
            </div>
            <div className="text-xs text-muted-foreground">
              Catálogo completo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeCoursesGraph;