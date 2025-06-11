import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  FileDown,
  CheckCircle2,
  Circle
} from "lucide-react";
import { availableDataSets } from "@/constants/index";

const formatConfig = {
  excel: {
    label: "Excel",
    icon: FileSpreadsheet,
    description: "Archivo .xlsx con múltiples hojas",
    color: "text-green-600"
  },
  pdf: {
    label: "PDF",
    icon: FileText,
    description: "Documento PDF con tablas formateadas",
    color: "text-red-600"
  },
  csv: {
    label: "CSV",
    icon: FileDown,
    description: "Archivos CSV separados por dataset",
    color: "text-blue-600"
  }
};

function ExportDataModal({
  open,
  setOpen,
  handleExport,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleExport: (
    title: string,
    selectedFormat: string,
    selectedCharts: string[],
    selectedDataSets: string[]
  ) => void;
}) {
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [selectedDataSets, setSelectedDataSets] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>("excel");
  const [title, setTitle] = useState<string>("informes");

  // Handle toggling individual dataset selection
  const handleDatasetToggle = (datasetId: string) => {
    setSelectedDataSets((prev) =>
      prev.includes(datasetId)
        ? prev.filter((id) => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  // Handle "Select All" for datasets
  const handleSelectAllDatasets = () => {
    if (selectedDataSets.length === availableDataSets.length) {
      // If all are selected, deselect all
      setSelectedDataSets([]);
    } else {
      // Otherwise, select all
      setSelectedDataSets(availableDataSets.map((dataset) => dataset.id));
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setOpen(false);
    // Reset to defaults
    setSelectedDataSets([]);
    setSelectedFormat("excel");
    setTitle("informes");
  };

  const isExportDisabled = selectedDataSets.length === 0 || title.trim() === "";
  const selectedFormatConfig = formatConfig[selectedFormat as keyof typeof formatConfig];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Exportar Datos
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure los detalles de exportación para descargar sus informes
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* File Configuration */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filename" className="text-sm font-medium">
                Nombre del archivo
              </Label>
              <Input
                id="filename"
                type="text"
                placeholder="Ingrese el nombre del archivo"
                className="w-full"
                onChange={(event) => setTitle(event.target.value)}
                value={title}
              />
              <p className="text-xs text-muted-foreground">
                Se agregará automáticamente la extensión del formato seleccionado
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Formato de exportación
              </Label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un formato" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(formatConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${config.color}`} />
                          <div>
                            <div className="font-medium">{config.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {config.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {selectedFormatConfig && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                  <selectedFormatConfig.icon className={`h-4 w-4 ${selectedFormatConfig.color}`} />
                  <p className="text-xs text-muted-foreground">
                    {selectedFormatConfig.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dataset Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Conjuntos de datos a incluir
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Seleccione los datos que desea exportar
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllDatasets}
                className="text-xs"
              >
                {selectedDataSets.length === availableDataSets.length ? (
                  <>
                    <Circle className="h-3 w-3 mr-1" />
                    Deseleccionar todos
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Seleccionar todos
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto p-3 border rounded-lg bg-muted/20">
              {availableDataSets.map((dataSet) => (
                <div 
                  key={dataSet.id}
                  className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={dataSet.id}
                    checked={selectedDataSets.includes(dataSet.id)}
                    onCheckedChange={() => handleDatasetToggle(dataSet.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 space-y-1">
                    <Label 
                      htmlFor={dataSet.id} 
                      className="text-sm font-medium cursor-pointer leading-tight"
                    >
                      {dataSet.name}
                    </Label>
                    {dataSet.description && (
                      <p className="text-xs text-muted-foreground leading-tight">
                        {dataSet.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Selection Summary */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {selectedDataSets.length} de {availableDataSets.length} conjuntos seleccionados
                </span>
              </div>
              {selectedDataSets.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  Listo para exportar
                </span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-muted-foreground">
              {isExportDisabled ? (
                "Complete todos los campos para continuar"
              ) : (
                `Exportando ${selectedDataSets.length} conjunto${selectedDataSets.length !== 1 ? 's' : ''} como ${selectedFormatConfig?.label}`
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={() =>
                  handleExport(title, selectedFormat, [], selectedDataSets)
                }
                disabled={isExportDisabled}
                className="min-w-[100px]"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExportDataModal;