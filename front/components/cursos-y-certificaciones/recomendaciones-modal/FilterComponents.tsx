import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { fetchGetFilterOptions } from "@/hooks/fetchGetFilterOptions";
import SkillsFilter from "@/components/cursos-y-certificaciones/recomendaciones-modal/SkillsFilter";
import InstitutionsFilter from "./InstitutionsFilter";

// Scrollable Dropdown Component
function ScrollableDropdown({
  items,
  selectedItem,
  onItemSelect,
  placeholder,
  label,
  maxVisibleItems = 5,
}: {
  items: string[];
  selectedItem: string | null;
  onItemSelect: (item: string | null) => void;
  placeholder: string;
  label: string;
  maxVisibleItems?: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const displayedItems = useMemo(() => {
    if (showAll || searchTerm) return filteredItems;
    return filteredItems.slice(0, maxVisibleItems);
  }, [filteredItems, showAll, maxVisibleItems, searchTerm]);

  const hasMoreItems = filteredItems.length > maxVisibleItems;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 justify-between min-w-[200px] bg-card border-border text-card-foreground hover:bg-accent/50"
        >
          <span className="truncate">
            {selectedItem || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-64 bg-popover border-border"
      >
        <DropdownMenuLabel className="text-popover-foreground">
          {label}
        </DropdownMenuLabel>
        
        {/* Search Input */}
        {items.length > 5 && (
          <>
            <div className="px-2 py-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 text-sm bg-input border border-border rounded focus:ring-1 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Clear Selection */}
        <DropdownMenuItem 
          onClick={() => onItemSelect(null)}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Todos
        </DropdownMenuItem>
        
        {/* Scrollable Items Container */}
        <div className={`${hasMoreItems && !showAll && !searchTerm ? 'max-h-48' : 'max-h-64'} overflow-y-auto`}>
          {displayedItems.map((item) => (
            <DropdownMenuItem
              key={item}
              onClick={() => onItemSelect(item)}
              className={`hover:bg-accent hover:text-accent-foreground ${
                selectedItem === item ? 'bg-primary/10 text-primary font-medium' : ''
              }`}
            >
              <span className="truncate">{item}</span>
            </DropdownMenuItem>
          ))}
        </div>

        {/* Show More/Less Button */}
        {hasMoreItems && !searchTerm && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowAll(!showAll)}
              className="text-primary hover:bg-primary/10 font-medium justify-center"
            >
              {showAll ? 'Ver menos' : `Ver más (${filteredItems.length - maxVisibleItems} más)`}
            </DropdownMenuItem>
          </>
        )}

        {/* No Results */}
        {searchTerm && filteredItems.length === 0 && (
          <div className="px-2 py-3 text-sm text-muted-foreground text-center">
            No se encontraron resultados
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FilterComponents({
  handleSubmit,
  closeModal,
  isLoading,
}: {
  handleSubmit: (
    selectedCourseCategory: string | null,
    selectedCourseInstitution: string | null,
    selectedCourseSkill: string | null,
    selectedCertificationInstitution: string | null,
    selectedCertificationSkill: string | null
  ) => void;
  closeModal: () => void;
  isLoading: boolean;
}) {
  const { filters } = fetchGetFilterOptions();
  const [selectedCourseCategory, setSelectedCourseCategory] = useState<string | null>(null);
  const [selectedCourseInstitution, setSelectedCourseInstitution] = useState<string | null>(null);
  const [selectedCertificationInstitution, setSelectedCertificationInstitution] = useState<string | null>(null);
  const [selectedCourseSkill, setSelectedCourseSkill] = useState<string | null>(null);
  const [selectedCertificationSkill, setSelectedCertificationSkill] = useState<string | null>(null);

  // Clear all filters function
  const clearAllFilters = () => {
    setSelectedCourseCategory(null);
    setSelectedCourseInstitution(null);
    setSelectedCertificationInstitution(null);
    setSelectedCourseSkill(null);
    setSelectedCertificationSkill(null);
  };

  const hasActiveFilters = selectedCourseCategory || selectedCourseInstitution || 
    selectedCertificationInstitution || selectedCourseSkill || selectedCertificationSkill;

  return (
    <div className="flex flex-col w-full h-full bg-background">
      {/* Header with Clear All */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">Filtros de Búsqueda</h2>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="flex gap-6 justify-center items-start">
        {/* Course Filters */}
        <div className="space-y-4 flex-1">
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              📚 Filtros de Cursos
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Categoría
                </label>
                <ScrollableDropdown
                  items={filters?.uniqueCategoriesCourses || []}
                  selectedItem={selectedCourseCategory}
                  onItemSelect={setSelectedCourseCategory}
                  placeholder="Seleccionar categoría"
                  label="Categorías de cursos"
                  maxVisibleItems={5}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Institución
                </label>
                <ScrollableDropdown
                  items={filters?.uniqueInstitutionsCourses || []}
                  selectedItem={selectedCourseInstitution}
                  onItemSelect={setSelectedCourseInstitution}
                  placeholder="Seleccionar institución"
                  label="Instituciones de cursos"
                  maxVisibleItems={5}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Habilidad
                </label>
                <ScrollableDropdown
                  items={filters?.allSkillsNames || []}
                  selectedItem={selectedCourseSkill}
                  onItemSelect={setSelectedCourseSkill}
                  placeholder="Seleccionar habilidad"
                  label="Habilidades"
                  maxVisibleItems={5}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Certification Filters */}
        <div className="space-y-4 flex-1">
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              🏆 Filtros de Certificaciones
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Institución
                </label>
                <ScrollableDropdown
                  items={filters?.uniqueInstitutionsCertifications || []}
                  selectedItem={selectedCertificationInstitution}
                  onItemSelect={setSelectedCertificationInstitution}
                  placeholder="Seleccionar institución"
                  label="Instituciones de certificaciones"
                  maxVisibleItems={5}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Habilidad
                </label>
                <ScrollableDropdown
                  items={filters?.allSkillsNames || []}
                  selectedItem={selectedCertificationSkill}
                  onItemSelect={setSelectedCertificationSkill}
                  placeholder="Seleccionar habilidad"
                  label="Habilidades"
                  maxVisibleItems={5}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          onClick={closeModal}
          className="bg-card border-border text-card-foreground hover:bg-accent/50"
        >
          Cerrar
        </Button>
        <Button
          disabled={isLoading}
          onClick={() =>
            handleSubmit(
              selectedCourseCategory,
              selectedCourseInstitution,
              selectedCourseSkill,
              selectedCertificationInstitution,
              selectedCertificationSkill
            )
          }
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
              Buscando...
            </div>
          ) : (
            'Buscar recomendaciones'
          )}
        </Button>
      </div>
    </div>
  );
}

export default FilterComponents;