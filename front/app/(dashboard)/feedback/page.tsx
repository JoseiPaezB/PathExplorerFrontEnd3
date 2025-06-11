"use client";

import React, { useState, useEffect } from "react";
import useFeedback from "../../../hooks/useFeedback";
import { useDeleteFeedback } from "@/hooks/useDeleteFeedback";
import DeleteFeedbackModal from "@/components/feedback/DeleteFeedbackModal";

interface CreateEvaluacionData {
  id_empleado: number;
  fecha: string;
  areas_mejora: string;
  calificacion: number;
  id_proyecto: number;
  comentarios: string;
  fortalezas: string;
}

export default function FeedbackPage() {
  const {
    evaluaciones,
    teamData,
    loading,
    error,
    getEvaluacionesManager,
    getEvaluacionesEmpleado,
    getEvaluacionesAdministrador,
    createEvaluacion,
    getTeamAndMembers,
    clearError,
  } = useFeedback();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateEvaluacionData>({
    id_empleado: 0,
    fecha: new Date().toISOString().split("T")[0],
    areas_mejora: "",
    calificacion: 1,
    id_proyecto: 0,
    comentarios: "",
    fortalezas: "",
  });
  const { deleteFeedback, isDeleting } = useDeleteFeedback();

  const getUserRole = () => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";");
      const userCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("user=")
      );

      if (userCookie) {
        try {
          const userData = JSON.parse(
            decodeURIComponent(userCookie.split("=")[1])
          );
          return userData.role || "";
        } catch (error) {
          console.error("Error parsing user cookie:", error);
        }
      }
    }
    return "";
  };

  const loadEvaluaciones = async () => {
    const role = getUserRole();
    setUserRole(role);

    try {
      switch (role) {
        case "manager":
          await getEvaluacionesManager();
          break;
        case "empleado":
          await getEvaluacionesEmpleado();
          break;
        case "administrador":
          await getEvaluacionesAdministrador();
          break;
        default:
          console.error("Unknown user role:", role);
      }
    } catch (err) {
      console.error("Error loading evaluaciones:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const role = getUserRole();
        setUserRole(role);

        await loadEvaluaciones();

        if (role === "manager") {
          await getTeamAndMembers();
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [name]:
          name === "id_empleado" ||
          name === "calificacion" ||
          name === "id_proyecto"
            ? Number(value)
            : value,
      };

      if (name === "id_proyecto") {
        newFormData.id_empleado = 0;
      }
      return newFormData;
    });
  };

  const handleSubmit = async () => {
    try {
      if (formData.id_proyecto === 0) {
        alert("Por favor, selecciona un proyecto.");
        return;
      }
      if (formData.id_empleado === 0) {
        alert("Por favor, selecciona un empleado.");
        return;
      }

      if (formData.calificacion < 1 || formData.calificacion > 10) {
        alert("La calificación debe estar entre 1 y 10.");
        return;
      }

      await createEvaluacion(formData);
      setShowCreateForm(false);
      setFormData({
        id_empleado: 0,
        fecha: new Date().toISOString().split("T")[0],
        areas_mejora: "",
        calificacion: 0,
        id_proyecto: 0,
        comentarios: "",
        fortalezas: "",
      });
      await loadEvaluaciones();
    } catch (err) {
      console.error("Error creating evaluation:", err);
    }
  };

  const handleDeleteEvaluation = async (evaluacionId: number) => {
    try {
      setDeletingId(evaluacionId);
      await deleteFeedback(evaluacionId);
      await loadEvaluaciones();
      window.location.reload();
    } catch (err) {
      console.error("Error deleting evaluation:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const getProjectOptions = () => {
    const projects: Array<{ id: number; name: string }> = [];
    const addedProjectIds = new Set<number>();

    teamData.forEach((team) => {
      if (
        team.id_proyecto !== undefined &&
        team.id_proyecto !== null &&
        !isNaN(Number(team.id_proyecto)) &&
        !addedProjectIds.has(Number(team.id_proyecto))
      ) {
        projects.push({
          id: Number(team.id_proyecto),
          name: team.proyecto,
        });
        addedProjectIds.add(Number(team.id_proyecto));
      }
    });
    return projects;
  };

  const getEmployeeOptions = () => {
    const selectedProjectId = formData.id_proyecto;
    const employees: Array<{ id: number; name: string }> = [];

    if (selectedProjectId === 0) {
      return [];
    }

    const relevantTeams = teamData.filter(
      (team) => team.id_proyecto === selectedProjectId
    );

    relevantTeams.forEach((team) => {
      const integrantes = Array.isArray(team.integrantes)
        ? team.integrantes
        : team.integrantes
        ? [team.integrantes]
        : [];

      integrantes.forEach((member) => {
        if (
          member.id_empleado &&
          member.nombre &&
          !employees.some((emp) => emp.id === member.id_empleado)
        ) {
          employees.push({ id: member.id_empleado, name: member.nombre });
        }
      });
    });
    return employees;
  };

  if (loading && evaluaciones.length === 0 && userRole !== "empleado") {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

 return (
  <div className="max-w-6xl mx-auto p-6">
    {userRole === "manager" && (
      <>
        <div className="mb-8">
          <DeleteFeedbackModal
            isOpen={!!deletingId}
            onClose={() => setDeletingId(null)}
            handleDelete={handleDeleteEvaluation}
            isDeleting={isDeleting}
            id_evaluacion={deletingId || undefined}
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {userRole === "manager"
              ? "Gestión de Evaluaciones"
              : "Administración de Evaluaciones"}
          </h1>
          <p className="text-muted-foreground">
            {userRole === "manager"
              ? "Administra las evaluaciones de desempeño de tu equipo"
              : "Gestiona todas las evaluaciones del sistema"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-destructive hover:text-destructive/80 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            {showCreateForm ? "Cancelar" : "Nueva Evaluación"}
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-8 p-6 rounded-xl border border-border bg-card shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-card-foreground">
              Crear Nueva Evaluación
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Proyecto
                  </label>
                  <select
                    name="id_proyecto"
                    value={formData.id_proyecto}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground transition-all duration-200"
                  >
                    <option value={0}>Seleccionar proyecto</option>
                    {getProjectOptions().map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Empleado
                  </label>
                  <select
                    name="id_empleado"
                    value={formData.id_empleado}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={formData.id_proyecto === 0}
                  >
                    <option value={0}>
                      {formData.id_proyecto === 0
                        ? "Selecciona un proyecto primero"
                        : "Seleccionar empleado"}
                    </option>
                    {getEmployeeOptions().map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Calificación (1-10)
                  </label>
                  <input
                    type="number"
                    name="calificacion"
                    value={formData.calificacion}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    step="1"
                    required
                    className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fortalezas
                </label>
                <textarea
                  name="fortalezas"
                  value={formData.fortalezas}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200"
                  placeholder="Describe las fortalezas del empleado..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Áreas de Mejora
                </label>
                <textarea
                  name="areas_mejora"
                  value={formData.areas_mejora}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200"
                  placeholder="Describe las áreas que necesitan mejora..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Comentarios Adicionales
                </label>
                <textarea
                  name="comentarios"
                  value={formData.comentarios}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200"
                  placeholder="Comentarios adicionales sobre el desempeño..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-success hover:bg-success/90 text-success-foreground px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl"
                >
                  {loading ? "Creando..." : "Crear Evaluación"}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="bg-muted hover:bg-muted/80 text-muted-foreground px-6 py-3 rounded-xl transition-all duration-200 font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )}

    <div>
      <h2 className="text-xl font-semibold mb-6 text-foreground">
        {userRole === "empleado"
          ? "Mis Evaluaciones de Desempeño"
          : "Evaluaciones Existentes"}
      </h2>
      {evaluaciones.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {userRole === "empleado" ? (
            <div className="max-w-md mx-auto">
              <svg
                className="w-20 h-20 text-muted-foreground/40 mx-auto mb-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <p className="text-lg font-medium text-foreground mb-3">
                No tienes evaluaciones disponibles
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tus evaluaciones de desempeño aparecerán aquí cuando tu
                manager las complete
              </p>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <svg
                className="w-20 h-20 text-muted-foreground/40 mx-auto mb-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <p className="text-lg font-medium text-foreground">
                No hay evaluaciones disponibles
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {evaluaciones.map((evaluacion) => (
            <div
              key={evaluacion.id_evaluacion}
              className={`border border-border rounded-xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl ${
                userRole === "empleado"
                  ? "bg-primary/5 border-primary/20"
                  : "bg-card"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Evaluación #{evaluacion.id_evaluacion}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Proyecto:</span>{" "}
                      {evaluacion.proyecto_nombre || evaluacion.proyecto}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Fecha:</span>{" "}
                      {new Date(evaluacion.fecha).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div
                      className={`text-3xl font-bold ${
                        evaluacion.calificacion >= 8
                          ? "text-success"
                          : evaluacion.calificacion >= 6
                          ? "text-warning"
                          : "text-destructive"
                      }`}
                    >
                      {evaluacion.calificacion}/10
                    </div>
                    {userRole === "empleado" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Tu calificación
                      </p>
                    )}
                  </div>
                  {(userRole === "manager" ||
                    userRole === "administrador") && (
                    <button
                      onClick={() => setDeletingId(evaluacion.id_evaluacion)}
                      disabled={deletingId === evaluacion.id_evaluacion}
                      className="p-3 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-xl transition-all duration-200 disabled:opacity-50"
                      title="Eliminar evaluación"
                    >
                      {deletingId === evaluacion.id_evaluacion ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-destructive border-t-transparent"></div>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                  <h4 className="font-semibold text-success mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    {userRole === "empleado"
                      ? "Tus Fortalezas:"
                      : "Fortalezas:"}
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    {evaluacion.fortalezas}
                  </p>
                </div>
                <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
                  <h4 className="font-semibold text-warning mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    {userRole === "empleado"
                      ? "Áreas de Oportunidad:"
                      : "Áreas de Mejora:"}
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    {evaluacion.areas_mejora}
                  </p>
                </div>
              </div>

              {evaluacion.comentarios && (
                <div className="mt-6 bg-accent/30 border border-accent rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                    {userRole === "empleado"
                      ? "Comentarios de tu Manager:"
                      : "Comentarios:"}
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    {evaluacion.comentarios}
                  </p>
                </div>
              )}

              {userRole === "empleado" && (
                <div className="mt-6 pt-4 border-t border-primary/20">
                  <p className="text-xs text-primary flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Esta evaluación es de solo lectura
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}