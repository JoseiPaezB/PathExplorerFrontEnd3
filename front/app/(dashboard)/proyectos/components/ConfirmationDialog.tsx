import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserInfoBanca } from "../types/projects";

function ConfirmationDialog({
  showConfirmDialog,
  selectedEmployee,
  currentRole,
  currentProject,
  currentRoleId,
  closeAssignDialog,
  setShowConfirmDialog,
  setSelectedEmployee,
}: {
  showConfirmDialog: boolean;
  selectedEmployee: UserInfoBanca | null;
  currentRole: string;
  currentProject: string;
  currentRoleId: number | undefined;
  closeAssignDialog: () => void;
  setShowConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEmployee: React.Dispatch<
    React.SetStateAction<UserInfoBanca | null>
  >;
}) {
  const confirmAssignment = async () => {
    if (!selectedEmployee || !currentRoleId) {
      console.error("Missing data for assignment");
      closeConfirmDialog();
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      closeConfirmDialog();
      closeAssignDialog();
    } catch (error) {
      console.error("Error assigning employee:", error);
    }
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setSelectedEmployee(null);
  };
  return (
    <Dialog open={showConfirmDialog} onOpenChange={closeConfirmDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar asignación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas asignar a{" "}
            {selectedEmployee
              ? selectedEmployee.nombre && selectedEmployee.apellido
                ? `${selectedEmployee.nombre} ${selectedEmployee.apellido}`
                : selectedEmployee.nombre_completo || "Sin nombre"
              : ""}{" "}
            al rol {currentRole} en el proyecto {currentProject}?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={closeConfirmDialog}>
            Cancelar
          </Button>
          <Button onClick={confirmAssignment}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationDialog;
