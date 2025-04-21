"use client";
import { useState, useEffect, use } from "react";
import { params } from "@/types/parameters";
import { UserInfoBanca } from "@/types/users";

export default function UserStatePage({ params }: { params: params }) {
  const unwrappedParams: params = use(params);
  const userId = unwrappedParams.id;
  const [user, setUser] = useState<UserInfoBanca | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("selectedUser");

      if (storedUser) {
        const userData = JSON.parse(storedUser) as UserInfoBanca;
        if (userData.id_persona.toString() === userId) {
          setUser(userData);
          setLoading(false);
          return;
        }
      }

      setError("No se encontró información del usuario");
      setLoading(false);
    } catch (err) {
      console.error("Error retrieving user data:", err);
      setError("Error al cargar los datos del usuario");
      setLoading(false);
    }
  }, [userId]);
}
