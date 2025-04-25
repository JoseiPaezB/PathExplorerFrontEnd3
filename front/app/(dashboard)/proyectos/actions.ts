"use server";
import { UserInfoBanca } from "@/types/users";
import { revalidatePath } from "next/cache";
import { Project, ProjectsResponse } from "@/types/projects";

export interface BestCandidatesResponse {
  success: boolean;
  message?: string;
  candidates?: UserInfoBanca[];
}

export async function getBestCandidatesForRole(
  roleId: number,
  token?: string
): Promise<BestCandidatesResponse> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `http://localhost:4000/api/projects/best-candidates-for-role`;

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ id_rol: roleId }),
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.message || response.statusText;
      } catch (e) {}

      throw new Error(
        `Error al obtener los mejores candidatos para el rol: ${errorMessage}`
      );
    }

    const data = await response.json();

    let candidatos = [];

    if (Array.isArray(data)) {
      candidatos = data;
    } else if (data.candidates && Array.isArray(data.candidates)) {
      candidatos = data.candidates;
    } else if (data.data && Array.isArray(data.data)) {
      candidatos = data.data;
    } else if (typeof data === "object" && data !== null) {
      candidatos = [data];
    }

    revalidatePath("/proyectos");

    return {
      success: true,
      candidates: candidatos,
    };
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function getManagerProjects(
  token?: string
): Promise<ProjectsResponse> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `http://localhost:4000/api/projects/manager-projects-with-roles`;

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.message || response.statusText;
      } catch (e) {}

      throw new Error(
        `Error al obtener los proyectos del manager: ${errorMessage}`
      );
    }

    const data = await response.json();

    revalidatePath("/proyectos");

    return data;
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    return {
      success: false,
      hasProjects: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
