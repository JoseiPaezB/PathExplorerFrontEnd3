export type UserRole = "employee" | "manager" | "administrator"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  position: string
  department: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

