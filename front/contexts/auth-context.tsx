// contexts/auth-context.tsx
"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { AuthState, User, LoginResponse } from "@/types/auth";
import { useRouter } from "next/navigation";
import axios from "axios";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User | void>;
  logout: () => void;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const setCookie = (name: string, value: string, days: number = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie =
    name + "=" + encodeURIComponent(value) + expires + "; path=/";
};

const deleteCookie = (name: string) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setState({
            user: parsedUser,
            isAuthenticated: true,
          });

          setCookie("user", storedUser);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          deleteCookie("user");
        }
      }
    };

    init();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<User | void> => {
      try {
        console.log(`Attempting login with email: ${email}`);

        const response = await axios.post<LoginResponse>(
          `${API_URL}/auth/login`,
          {
            email,
            password,
          }
        );

        console.log("Login response status:", response.status);

        if (
          response.data.success &&
          response.data.token &&
          response.data.user
        ) {
          const { token, user } = response.data;

          const userString = JSON.stringify(user);

          localStorage.setItem("token", token);
          localStorage.setItem("user", userString);
          setCookie("user", userString);

          setState({
            user,
            isAuthenticated: true,
          });

          console.log("Login successful, user info:", user);

          return user;
        } else {
          console.error("Invalid response format:", response.data);
          throw new Error(response.data.message || "Invalid credentials");
        }
      } catch (error) {
        console.error("Login error:", error);

        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error(
              "Server error:",
              error.response.status,
              error.response.data
            );
          } else if (error.request) {
            console.error("No response received:", error.request);
          } else {
            console.error("Request setup error:", error.message);
          }
        }

        throw error;
      }
    },
    []
  );

  const logout = useCallback(() => {
    setIsLoggingOut(true);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    deleteCookie("user");

    setState({ user: null, isAuthenticated: false });

    router.push("/login");

    setTimeout(() => {
      setIsLoggingOut(false);
    }, 500);
  }, [router]);

  useEffect(() => {
    console.log("Auth state updated:", state.isAuthenticated);
  }, [state]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
