"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { AuthState, User, UserRole } from "@/types/auth"
import { useRouter } from "next/navigation"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User | void>
  logout: () => void
  isLoggingOut: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Función para establecer una cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = "; expires=" + date.toUTCString()
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/"
}

// Función para eliminar una cookie
const deleteCookie = (name: string) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}

// Demo users for testing
const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: "1",
    email: "juan.diaz@accenture.com",
    password: "manager123",
    name: "Juan Díaz",
    role: "manager" as UserRole,
    position: "Project Manager",
    department: "Tecnología",
  },
  {
    id: "2",
    email: "ana.garcia@accenture.com",
    password: "employee123",
    name: "Ana García",
    role: "employee" as UserRole,
    position: "Desarrollador Frontend",
    department: "Tecnología",
  },
  {
    id: "3",
    email: "admin@accenture.com",
    password: "admin123",
    name: "Carlos Rodriguez",
    role: "administrator" as UserRole,
    position: "System Administrator",
    department: "IT",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  })
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  // Inicializar estado de autenticación desde localStorage y cookies
  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User
          setState({
            user: parsedUser,
            isAuthenticated: true
          })

          setCookie("user", storedUser)
        } catch (error) {
          console.error("Error al analizar el usuario almacenado:", error)
          localStorage.removeItem("user")
          deleteCookie("user")
        }
      }
    }

    init()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<User | void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const user = DEMO_USERS.find((u) => u.email === email && u.password === password)
      if (!user) {
        throw new Error("Credenciales inválidas")
      }

      const { password: _, ...safeUser } = user

      const userString = JSON.stringify(safeUser)

      // Guardar en localStorage y cookie
      localStorage.setItem("user", userString)
      setCookie("user", userString)

      // Actualizar estado
      setState({
        user: safeUser,
        isAuthenticated: true,
      })

      console.log("Login exitoso, estado actualizado:", safeUser)

      return safeUser
    } catch (error) {
      console.error("Error en login:", error)
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    setIsLoggingOut(true)

    // Limpiar almacenamiento
    localStorage.removeItem("user")
    deleteCookie("user")

    // Actualizar estado
    setState({ user: null, isAuthenticated: false })

    // Navegar a login inmediatamente
    router.push("/login")

    // Resetear estado de logout después de la navegación
    setTimeout(() => {
      setIsLoggingOut(false)
    }, 500)
  }, [router])

  // Añadir logs para depuración
  useEffect(() => {
    console.log("Estado de autenticación actualizado:", state)
  }, [state])

  return (
      <AuthContext.Provider
          value={{
            ...state,
            login,
            logout,
            isLoggingOut
          }}
      >
        {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}