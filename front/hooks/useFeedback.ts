"use client";

import { useState } from "react";
import { apiUrl } from "@/constants";

interface Evaluacion {
  id_evaluacion: number;
  id_empleado: number;
  id_manager: number;
  fecha: string;
  areas_mejora: string;
  calificacion: number;
  id_proyecto: number;
  comentarios: string;
  fortalezas: string;
  proyecto_nombre?: string;
  proyecto?: string;
}

interface TeamMember {
  id_empleado: number;
  nombre: string;
}

interface ProjectTeam {
  proyecto: string;
  id_proyecto: number;
  integrantes: TeamMember | TeamMember[];
}

interface CreateEvaluacionData {
  id_empleado: number;
  fecha: string;
  areas_mejora: string;
  calificacion: number;
  id_proyecto: number;
  comentarios: string;
  fortalezas: string;
}

interface EvaluacionesResponse {
  hasEvaluaciones: boolean;
  evaluaciones: Evaluacion[];
}

interface TeamResponse {
  equipos: ProjectTeam[];
}

const useFeedback = () => {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [teamData, setTeamData] = useState<ProjectTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || "";
    }
    return "";
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();

    const baseURL = apiUrl;
    const fullURL = url.startsWith("http") ? url : `${baseURL}${url}`;

    const response = await fetch(fullURL, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const getEvaluacionesManager = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: EvaluacionesResponse = await fetchWithAuth(
        `/feedback/manager`
      );
      setEvaluaciones(data.evaluaciones);
      return data;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error fetching manager evaluaciones"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEvaluacionesEmpleado = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: EvaluacionesResponse = await fetchWithAuth(
        `/feedback/empleado`
      );
      setEvaluaciones(data.evaluaciones);
      return data;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error fetching empleado evaluaciones"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEvaluacionesAdministrador = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: EvaluacionesResponse = await fetchWithAuth(
        `/feedback/administrador`
      );
      setEvaluaciones(data.evaluaciones);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error fetching admin evaluaciones"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createEvaluacion = async (evaluacionData: CreateEvaluacionData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`/feedback/create`, {
        method: "POST",
        body: JSON.stringify(evaluacionData),
      });
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error creating evaluacion"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTeamAndMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: TeamResponse = await fetchWithAuth(
        `/feedback/team-and-members`
      );
      setTeamData(data.equipos);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching team data");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
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
    setEvaluaciones,
    setTeamData,
  };
};

export default useFeedback;
