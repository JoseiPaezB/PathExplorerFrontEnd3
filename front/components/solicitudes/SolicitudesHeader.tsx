import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, Filter, Shield, X, FileCheck } from "lucide-react";

function SolicitudesHeader({
  setFiltro,
  setSearchTerm,
  filtro,
  searchTerm,
}: {
  setFiltro: React.Dispatch<React.SetStateAction<string>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filtro: string;
  searchTerm: string;
}) {
  const handleFilter = (selectedFilter: string) => {
    setFiltro(selectedFilter);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setFiltro("");
    setSearchTerm("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20";
      case "APROBADA":
        return "bg-success/10 text-success border-success/20 hover:bg-success/20";
      case "RECHAZADA":
        return "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20";
      default:
        return "bg-muted/30 text-muted-foreground border-muted hover:bg-muted/50";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "Pendientes";
      case "APROBADA":
        return "Aprobadas";
      case "RECHAZADA":
        return "Rechazadas";
      default:
        return "Todos los estados";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "⏳";
      case "APROBADA":
        return "✅";
      case "RECHAZADA":
        return "❌";
      default:
        return "📋";
    }
  };

  const hasActiveFilters = filtro !== "" || searchTerm !== "";

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-lg space-y-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Autorizaciones
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestiona las solicitudes de acceso y permisos del sistema
            </p>
          </div>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground hover:bg-accent/50 self-start"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Buscar por usuario, tipo de solicitud o descripción..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 h-11 rounded-xl border-border bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={`gap-2 min-w-[160px] justify-between bg-card border-border text-card-foreground hover:bg-accent/50 transition-all duration-200 ${
                  filtro ? 'border-primary/30 bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="truncate">
                    {filtro ? getStatusLabel(filtro) : "Estado"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-64 bg-popover border-border"
            >
              <DropdownMenuLabel className="text-popover-foreground">
                Filtrar por estado de solicitud
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onSelect={() => handleFilter("PENDIENTE")}
                className={`hover:bg-accent hover:text-accent-foreground ${
                  filtro === "PENDIENTE" ? 'bg-primary/10 text-primary font-medium' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span>⏳</span>
                    <span>Pendientes</span>
                  </div>
                  <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">
                    Revisión
                  </Badge>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onSelect={() => handleFilter("APROBADA")}
                className={`hover:bg-accent hover:text-accent-foreground ${
                  filtro === "APROBADA" ? 'bg-primary/10 text-primary font-medium' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>Aprobadas</span>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20 text-xs">
                    Autorizada
                  </Badge>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onSelect={() => handleFilter("RECHAZADA")}
                className={`hover:bg-accent hover:text-accent-foreground ${
                  filtro === "RECHAZADA" ? 'bg-primary/10 text-primary font-medium' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span>❌</span>
                    <span>Rechazadas</span>
                  </div>
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                    Denegada
                  </Badge>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onSelect={() => handleFilter("")}
                className={`hover:bg-accent hover:text-accent-foreground ${
                  filtro === "" ? 'bg-primary/10 text-primary font-medium' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  <span>Todos los estados</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Filtros activos:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {searchTerm && (
                <Badge 
                  variant="outline" 
                  className="bg-primary/10 text-primary border-primary/30 pl-2 pr-1"
                >
                  <div className="flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    <span>"{searchTerm}"</span>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-primary/80 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </Badge>
              )}
              {filtro && (
                <Badge 
                  className={`${getStatusColor(filtro)} pl-2 pr-1`}
                >
                  <div className="flex items-center gap-1">
                    <span>{getStatusIcon(filtro)}</span>
                    <span>{getStatusLabel(filtro)}</span>
                    <button
                      onClick={() => handleFilter("")}
                      className="ml-1 hover:opacity-80 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="bg-warning/10 rounded-lg p-3 border border-warning/20">
          <div className="flex items-center gap-2">
            <span className="text-lg">⏳</span>
            <div>
              <p className="text-xs text-warning font-medium">Pendientes</p>
              <p className="text-sm font-bold text-foreground">--</p>
            </div>
          </div>
        </div>
        
        <div className="bg-success/10 rounded-lg p-3 border border-success/20">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <div>
              <p className="text-xs text-success font-medium">Aprobadas</p>
              <p className="text-sm font-bold text-foreground">--</p>
            </div>
          </div>
        </div>
        
        <div className="bg-destructive/10 rounded-lg p-3 border border-destructive/20">
          <div className="flex items-center gap-2">
            <span className="text-lg">❌</span>
            <div>
              <p className="text-xs text-destructive font-medium">Rechazadas</p>
              <p className="text-sm font-bold text-foreground">--</p>
            </div>
          </div>
        </div>
        
        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-xs text-primary font-medium">Total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolicitudesHeader;