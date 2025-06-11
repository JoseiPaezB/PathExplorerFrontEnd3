import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search, Filter, Users, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function UsuariosHeader({
  applyFilters,
}: {
  applyFilters: (searchTerm: string, stateFilter: string) => void;
}) {
  const [filtro, setFiltro] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleFilter = (filtro: string) => {
    setFiltro(filtro);
    applyFilters(searchTerm, filtro);
  };

  const userSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);
    applyFilters(newSearchTerm, filtro);
  };

  const clearFilters = () => {
    setFiltro("");
    setSearchTerm("");
    applyFilters("", "");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ASIGNADO":
        return "bg-success/10 text-success border-success/20 hover:bg-success/20";
      case "BANCA":
        return "bg-info/10 text-info border-info/20 hover:bg-info/20";
      default:
        return "bg-muted/30 text-muted-foreground border-muted hover:bg-muted/50";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ASIGNADO":
        return "Asignado";
      case "BANCA":
        return "Banca";
      default:
        return "Todos los estados";
    }
  };

  const hasActiveFilters = filtro !== "" || searchTerm !== "";

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">
              Gestión de Usuarios
            </h2>
            <p className="text-sm text-muted-foreground">
              Buscar y filtrar usuarios del sistema
            </p>
          </div>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground hover:bg-accent/50"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Buscar usuarios por nombre, email o rol..."
            value={searchTerm}
            className="w-full pl-10 pr-4 h-11 rounded-xl border-border bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            onChange={userSearch}
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                applyFilters("", filtro);
              }}
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
                className={`gap-2 min-w-[140px] justify-between bg-card border-border text-card-foreground hover:bg-accent/50 transition-all duration-200 ${
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
              className="w-56 bg-popover border-border"
            >
              <DropdownMenuLabel className="text-popover-foreground">
                Filtrar por estado
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onSelect={() => handleFilter("ASIGNADO")}
                className={`hover:bg-accent hover:text-accent-foreground ${
                  filtro === "ASIGNADO" ? 'bg-primary/10 text-primary font-medium' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span>Asignado</span>
                  <Badge className="bg-success/10 text-success border-success/20 text-xs">
                    Activo
                  </Badge>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onSelect={() => handleFilter("BANCA")}
                className={`hover:bg-accent hover:text-accent-foreground ${
                  filtro === "BANCA" ? 'bg-primary/10 text-primary font-medium' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span>Banca</span>
                  <Badge className="bg-info/10 text-info border-info/20 text-xs">
                    Disponible
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
                  <span>Todos los estados</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Filtros activos:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {searchTerm && (
                <Badge 
                  variant="outline" 
                  className="bg-primary/10 text-primary border-primary/30"
                >
                  Búsqueda: "{searchTerm}"
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      applyFilters("", filtro);
                    }}
                    className="ml-2 hover:text-primary/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filtro && (
                <Badge 
                  className={getStatusColor(filtro)}
                >
                  Estado: {getStatusLabel(filtro)}
                  <button
                    onClick={() => handleFilter("")}
                    className="ml-2 hover:opacity-80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsuariosHeader;