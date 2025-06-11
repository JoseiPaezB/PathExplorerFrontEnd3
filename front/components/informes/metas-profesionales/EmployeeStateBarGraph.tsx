import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { ChartConfiguration } from "chart.js";
import { Users, UserCheck, User } from "lucide-react";
import { EstadoEmpleado } from "@/types/informes";

function EmployeeStateBarGraph({
  employeesStates,
}: {
  employeesStates: EstadoEmpleado[] | undefined;
}) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !employeesStates || employeesStates.length === 0)
      return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const employeesByState = {
      ASIGNADO: employeesStates.filter((emp) => emp.estado === "ASIGNADO").length,
      BANCA: employeesStates.filter((emp) => emp.estado === "BANCA").length,
    };

    const data = {
      labels: ["Asignados", "En Banca"],
      datasets: [
        {
          label: "Número de Empleados",
          data: [employeesByState.ASIGNADO, employeesByState.BANCA],
          backgroundColor: [
            "hsl(221 83% 53%)", // Primary blue for assigned
            "hsl(38 92% 50%)",  // Warning orange for bench
          ],
          borderColor: [
            "hsl(221 83% 53%)",
            "hsl(38 92% 50%)",
          ],
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
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
                const value = context.parsed.y || 0;
                const total = employeesByState.ASIGNADO + employeesByState.BANCA;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
                return `${context.label}: ${value} empleados (${percentage}%)`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: "hsl(0 0% 45.1%)",
              font: {
                size: 13,
                weight: "500",
              },
              maxRotation: 0,
              minRotation: 0,
            },
          },
          y: {
            beginAtZero: true,
            max: Math.max(employeesByState.ASIGNADO, employeesByState.BANCA) * 1.2,
            grid: {
              color: "hsl(0 0% 89.8%)",
              lineWidth: 1,
            },
            border: {
              display: false,
            },
            ticks: {
              color: "hsl(0 0% 45.1%)",
              font: {
                size: 12,
              },
              stepSize: Math.ceil(Math.max(employeesByState.ASIGNADO, employeesByState.BANCA) / 5),
              callback: function (value) {
                return Number.isInteger(Number(value)) ? value : '';
              },
            },
          },
        },
        animation: {
          duration: 800,
          easing: 'easeInOutCubic',
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [employeesStates]);

  if (!employeesStates || employeesStates.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">No hay datos disponibles</h3>
              <p className="text-sm text-muted-foreground">
                No se encontraron estados de empleados para mostrar
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const employeesByState = {
    ASIGNADO: employeesStates.filter((emp) => emp.estado === "ASIGNADO").length,
    BANCA: employeesStates.filter((emp) => emp.estado === "BANCA").length,
  };

  const totalEmployees = employeesByState.ASIGNADO + employeesByState.BANCA;
  const assignedPercentage = totalEmployees > 0 ? ((employeesByState.ASIGNADO / totalEmployees) * 100).toFixed(1) : "0";
  const benchPercentage = totalEmployees > 0 ? ((employeesByState.BANCA / totalEmployees) * 100).toFixed(1) : "0";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Estado de Empleados
            </h3>
            <p className="text-sm text-muted-foreground">
              Distribución de empleados por estado de asignación
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>Total: {totalEmployees} empleados</span>
          </div>
          <div className="text-xs">•</div>
          <span>Disponibilidad y asignaciones</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          <div className="h-80 w-full">
            <canvas ref={chartRef} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-foreground mb-4">Resumen</h4>
          
          {/* Assigned Card */}
          <div className="p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <UserCheck className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">Asignados</h5>
                <p className="text-xs text-muted-foreground">En proyectos activos</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {employeesByState.ASIGNADO}
              </div>
              <div className="text-xs text-muted-foreground">
                {assignedPercentage}% del total
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${assignedPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Bench Card */}
          <div className="p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <User className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">En Banca</h5>
                <p className="text-xs text-muted-foreground">Disponibles para asignación</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {employeesByState.BANCA}
              </div>
              <div className="text-xs text-muted-foreground">
                {benchPercentage}% del total
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${benchPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Total Card */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">Total</h5>
                <p className="text-xs text-muted-foreground">Empleados registrados</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {totalEmployees}
            </div>
            <div className="text-xs text-muted-foreground">
              100% de la plantilla
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeStateBarGraph;