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
import { ChevronDown, Award, Clock, ShieldCheck, Building } from "lucide-react";
import { CertificacionEmpleado } from "@/types/informes";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

const filterConfig = {
  TIPO: {
    label: "Proveedor",
    icon: Building,
    description: "Visualizar por proveedor de certificación"
  },
  VENCIMIENTO: {
    label: "Vigencia",
    icon: Clock,
    description: "Visualizar por estado de vigencia"
  },
  VALIDACION: {
    label: "Validación",
    icon: ShieldCheck,
    description: "Visualizar por estado de validación"
  }
};

// Provider-specific colors for better brand recognition
const providerColors = {
  "AWS": "hsl(25 100% 50%)", // AWS Orange
  "Microsoft": "hsl(207 90% 54%)", // Microsoft Blue
  "Google": "hsl(214 89% 52%)", // Google Blue
  "Oracle": "hsl(0 100% 50%)", // Oracle Red
  "Scrum": "hsl(142 71% 45%)", // Green for Scrum
  "Kubernetes": "hsl(221 83% 53%)", // Blue for K8s
  "Security": "hsl(0 84% 60%)", // Red for Security
  "TensorFlow": "hsl(38 92% 50%)", // Orange for TensorFlow
  "Tableau": "hsl(199 89% 48%)", // Light Blue for Tableau
  "Power BI": "hsl(47 96% 53%)", // Yellow for Power BI
  "Otros": "hsl(240 5% 64%)", // Gray for Others
};

function EmployeeCertificationsGraph({
  employeeCertifications,
}: {
  employeeCertifications: CertificacionEmpleado[] | undefined;
}) {
  const [filter, setFilter] = useState<"TIPO" | "VENCIMIENTO" | "VALIDACION">(
    "TIPO"
  );
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processData = (): DonutData[] => {
    if (!employeeCertifications || employeeCertifications.length === 0) {
      return [];
    }

    switch (filter) {
      case "TIPO": {
        const tipoCounts: { [key: string]: number } = {};

        employeeCertifications.forEach((cert) => {
          let provider = "Otros";
          const certName = cert.nombre.toLowerCase();
          
          if (certName.includes("aws")) provider = "AWS";
          else if (certName.includes("microsoft") || certName.includes("azure"))
            provider = "Microsoft";
          else if (certName.includes("oracle") || certName.includes("java"))
            provider = "Oracle";
          else if (certName.includes("google cloud") || certName.includes("gcp")) 
            provider = "Google";
          else if (certName.includes("scrum") || certName.includes("psm") || certName.includes("csm"))
            provider = "Scrum";
          else if (certName.includes("kubernetes") || certName.includes("k8s")) 
            provider = "Kubernetes";
          else if (certName.includes("security") || certName.includes("cissp") || 
                   certName.includes("ethical hacker") || certName.includes("ccsp"))
            provider = "Security";
          else if (certName.includes("tensorflow")) provider = "TensorFlow";
          else if (certName.includes("tableau")) provider = "Tableau";
          else if (certName.includes("power bi")) provider = "Power BI";

          tipoCounts[provider] = (tipoCounts[provider] || 0) + 1;
        });

        return Object.entries(tipoCounts)
          .sort(([,a], [,b]) => b - a) // Sort by frequency
          .map(([tipo, count]) => ({
            label: tipo,
            value: count,
            color: providerColors[tipo as keyof typeof providerColors] || "hsl(240 5% 64%)",
          }));
      }

      case "VENCIMIENTO": {
        const vencimientoCounts = {
          "Sin vencimiento": 0,
          "Vencido": 0,
          "Vigente < 1 año": 0,
          "Vigente 1-2 años": 0,
          "Vigente > 2 años": 0,
        };

        const now = new Date();

        employeeCertifications.forEach((cert) => {
          if (!cert.fecha_vencimiento) {
            vencimientoCounts["Sin vencimiento"]++;
          } else {
            const expDate = new Date(cert.fecha_vencimiento);
            const monthsUntilExpiration =
              (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);

            if (monthsUntilExpiration < 0) {
              vencimientoCounts["Vencido"]++;
            } else if (monthsUntilExpiration < 12) {
              vencimientoCounts["Vigente < 1 año"]++;
            } else if (monthsUntilExpiration < 24) {
              vencimientoCounts["Vigente 1-2 años"]++;
            } else {
              vencimientoCounts["Vigente > 2 años"]++;
            }
          }
        });

        return [
          {
            label: "Sin vencimiento",
            value: vencimientoCounts["Sin vencimiento"],
            color: "hsl(199 89% 48%)", // Blue for no expiry
          },
          {
            label: "Vencido",
            value: vencimientoCounts["Vencido"],
            color: "hsl(0 84% 60%)", // Red for expired
          },
          {
            label: "Vigente < 1 año",
            value: vencimientoCounts["Vigente < 1 año"],
            color: "hsl(38 92% 50%)", // Orange for expiring soon
          },
          {
            label: "Vigente 1-2 años",
            value: vencimientoCounts["Vigente 1-2 años"],
            color: "hsl(47 96% 53%)", // Yellow for medium term
          },
          {
            label: "Vigente > 2 años",
            value: vencimientoCounts["Vigente > 2 años"],
            color: "hsl(142 71% 45%)", // Green for long term
          },
        ].filter(item => item.value > 0); // Only show categories with data
      }

      case "VALIDACION": {
        const validacionCounts = {
          "Validado": 0,
          "No validado": 0,
        };

        employeeCertifications.forEach((cert) => {
          if (cert.estado_validacion) {
            validacionCounts["Validado"]++;
          } else {
            validacionCounts["No validado"]++;
          }
        });

        return [
          {
            label: "Validado",
            value: validacionCounts["Validado"],
            color: "hsl(142 71% 45%)", // Green for validated
          },
          {
            label: "No validado",
            value: validacionCounts["No validado"],
            color: "hsl(0 84% 60%)", // Red for not validated
          },
        ].filter(item => item.value > 0); // Only show categories with data
      }

      default:
        return [];
    }
  };

  const data = processData();
  const totalCertifications = data.reduce((sum, item) => sum + item.value, 0);

  const getChartTitle = () => {
    switch (filter) {
      case "TIPO":
        return "Distribución por Proveedor";
      case "VENCIMIENTO":
        return "Distribución por Vigencia";
      case "VALIDACION":
        return "Distribución por Validación";
      default:
        return "Certificaciones de Empleados";
    }
  };

  const getCertificationStats = () => {
    if (!employeeCertifications || employeeCertifications.length === 0) {
      return { validated: 0, expired: 0, expiringSoon: 0 };
    }

    const now = new Date();
    const validated = employeeCertifications.filter(cert => cert.estado_validacion).length;
    const expired = employeeCertifications.filter(cert => {
      if (!cert.fecha_vencimiento) return false;
      const expDate = new Date(cert.fecha_vencimiento);
      return expDate.getTime() < now.getTime();
    }).length;
    const expiringSoon = employeeCertifications.filter(cert => {
      if (!cert.fecha_vencimiento) return false;
      const expDate = new Date(cert.fecha_vencimiento);
      const monthsUntilExpiration = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return monthsUntilExpiration > 0 && monthsUntilExpiration < 12;
    }).length;

    return { validated, expired, expiringSoon };
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
                return `${label}: ${value} certificaciones (${percentage}%)`;
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

  if (!employeeCertifications || employeeCertifications.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <Award className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">No hay datos disponibles</h3>
              <p className="text-sm text-muted-foreground">
                No se encontraron certificaciones de empleados para mostrar
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = filterConfig[filter].icon;
  const certStats = getCertificationStats();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Certificaciones de Empleados
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
            <span>Total: {totalCertifications} certificaciones</span>
          </div>
          <div className="text-xs">•</div>
          <span>Validadas: {certStats.validated}</span>
          {certStats.expiringSoon > 0 && (
            <>
              <div className="text-xs">•</div>
              <span className="text-orange-600">Vencen pronto: {certStats.expiringSoon}</span>
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
                    <div className="text-2xl font-bold text-foreground">{totalCertifications}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      Certificaciones
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
                  const percentage = totalCertifications > 0 ? ((item.value / totalCertifications) * 100).toFixed(1) : "0";
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
          <h4 className="font-medium text-sm text-foreground mb-4">Estado de Certificaciones</h4>
          
          {/* Validated Certifications Card */}
          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <ShieldCheck className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">Validadas</h5>
                <p className="text-xs text-muted-foreground">Certificaciones verificadas</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {certStats.validated}
              </div>
              <div className="text-xs text-muted-foreground">
                {totalCertifications > 0 ? ((certStats.validated / totalCertifications) * 100).toFixed(1) : "0"}% del total
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalCertifications > 0 ? (certStats.validated / totalCertifications) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Expiring Soon Card */}
          <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">Vencen Pronto</h5>
                <p className="text-xs text-muted-foreground">Próximas a vencer (&lt; 1 año)</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {certStats.expiringSoon}
              </div>
              <div className="text-xs text-muted-foreground">
                {totalCertifications > 0 ? ((certStats.expiringSoon / totalCertifications) * 100).toFixed(1) : "0"}% del total
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalCertifications > 0 ? (certStats.expiringSoon / totalCertifications) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Expired Card */}
          <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Award className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">Vencidas</h5>
                <p className="text-xs text-muted-foreground">Requieren renovación</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {certStats.expired}
              </div>
              <div className="text-xs text-muted-foreground">
                {totalCertifications > 0 ? ((certStats.expired / totalCertifications) * 100).toFixed(1) : "0"}% del total
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalCertifications > 0 ? (certStats.expired / totalCertifications) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Total Active Card */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Award className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-foreground">Total Activas</h5>
                <p className="text-xs text-muted-foreground">Certificaciones vigentes</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {totalCertifications - certStats.expired}
            </div>
            <div className="text-xs text-muted-foreground">
              Certificaciones válidas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeCertificationsGraph;