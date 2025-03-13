"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  User,
  Users,
  FileCheck,
  Building,
  Settings,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { UserRole } from "@/types/auth"
import { useAuth } from "@/contexts/auth-context"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  description?: string
}

interface SidebarProps {
  className?: string
  userRole: UserRole
}

export function Sidebar({ className, userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const pathname = usePathname()
  const { logout } = useAuth()
  const shouldReduceMotion = useReducedMotion()
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Restore sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setCollapsed(savedState === "true")
    }
  }, [])

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(collapsed))
  }, [collapsed])

  // Handle click outside to collapse sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && window.innerWidth < 1024) {
        setCollapsed(true)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const baseItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      description: "Vista general y métricas",
    },
    {
      title: "Mi Perfil",
      href: "/perfil",
      icon: User,
      description: "Información personal",
    },
  ]

  const roleItems: Record<UserRole, NavItem[]> = {
    employee: [
      {
        title: "Mi Proyecto",
        href: "/proyecto-actual",
        icon: Briefcase,
        description: "Proyecto asignado",
      },
      {
        title: "Mis Cursos",
        href: "/cursos",
        icon: BookOpen,
        description: "Formación y certificaciones",
      },
      {
        title: "Mi Desempeño",
        href: "/analitica",
        icon: BarChart3,
        description: "Métricas y evaluaciones",
      },
    ],
    manager: [
      {
        title: "Gestión de Proyectos",
        href: "/proyectos",
        icon: Briefcase,
        description: "Administrar proyectos",
      },
      {
        title: "Equipo",
        href: "/equipo",
        icon: Users,
        description: "Gestión de personal",
      },
      {
        title: "Analítica",
        href: "/analitica",
        icon: BarChart3,
        description: "Reportes y métricas",
      },
    ],
    administrator: [
      {
        title: "Gestión de Usuarios",
        href: "/usuarios",
        icon: Users,
        description: "Administrar usuarios",
      },
      {
        title: "Autorizaciones",
        href: "/autorizaciones",
        icon: FileCheck,
        description: "Permisos y accesos",
      },
      {
        title: "Departamentos",
        href: "/departamentos",
        icon: Building,
        description: "Estructura organizacional",
      },
    ],
  }

  const navItems = [...baseItems, ...(roleItems[userRole] || [])]

  // Add settings to all roles
  navItems.push({
    title: "Configuración",
    href: "/configuracion",
    icon: Settings,
    description: "Preferencias del sistema",
  })

  const handleLogout = () => {
    logout()
  }

  // Animation variants
  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  }

  const itemVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    collapsed: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const iconVariants = {
    expanded: {
      marginRight: 12,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    collapsed: {
      marginRight: 0,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        ref={sidebarRef}
        initial={false}
        animate={collapsed ? "collapsed" : "expanded"}
        variants={shouldReduceMotion ? {} : sidebarVariants}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed left-0 top-0 flex h-screen flex-col border-r bg-white/90 backdrop-blur-xl backdrop-saturate-150 z-30 shadow-subtle",
          className,
        )}
      >
        <div className="flex h-16 items-center border-b px-4 py-4">
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 font-semibold"
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-Qymnx3GxRns8Bpvp2y0MtAqaHaQmEo.png"
                  alt="Accenture Logo"
                  className="h-8 w-8"
                />
                <span className="text-base">Accenture HR</span>
              </motion.div>
            ) : (
              <motion.div
                key="icon-logo"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto"
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-Qymnx3GxRns8Bpvp2y0MtAqaHaQmEo.png"
                  alt="Accenture Logo"
                  className="h-8 w-8"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            className={cn("ml-auto h-8 w-8 rounded-full transition-all hover:bg-muted", collapsed && "mx-auto")}
            onClick={() => setCollapsed(!collapsed)}
          >
            <motion.div
              animate={{ rotate: collapsed ? 0 : 180 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </motion.div>
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3">
          <nav className="grid gap-2">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              const isHovered = hoveredItem === item.href

              return collapsed ? (
                <Tooltip key={index} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <motion.div
                        animate={{
                          scale: isHovered && !isActive ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <item.icon className="h-5 w-5" />
                      </motion.div>
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="border-primary">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "group flex h-12 items-center rounded-xl px-4 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.div
                    variants={iconVariants}
                    className="mr-3"
                    animate={{
                      scale: isHovered && !isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className="h-5 w-5" />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <p>{item.title}</p>
                    {item.description && <p className="text-xs font-normal opacity-70">{item.description}</p>}
                  </motion.div>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto border-t p-4">
          <AnimatePresence mode="wait">
            {collapsed ? (
              <Tooltip key="collapsed-profile">
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole === "employee" ? "Ana" : userRole === "manager" ? "Juan" : "Carlos"}`}
                        alt="Avatar"
                      />
                      <AvatarFallback>
                        {userRole === "employee" ? "AG" : userRole === "manager" ? "JD" : "CR"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div>
                    <p className="font-medium">
                      {userRole === "employee"
                        ? "Ana García"
                        : userRole === "manager"
                          ? "Juan Díaz"
                          : "Carlos Rodriguez"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userRole === "employee"
                        ? "Desarrollador Frontend"
                        : userRole === "manager"
                          ? "Project Manager"
                          : "System Administrator"}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <motion.div
                key="expanded-profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3"
              >
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole === "employee" ? "Ana" : userRole === "manager" ? "Juan" : "Carlos"}`}
                    alt="Avatar"
                  />
                  <AvatarFallback>
                    {userRole === "employee" ? "AG" : userRole === "manager" ? "JD" : "CR"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium leading-none">
                    {userRole === "employee" ? "Ana García" : userRole === "manager" ? "Juan Díaz" : "Carlos Rodriguez"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userRole === "employee"
                      ? "Desarrollador Frontend"
                      : userRole === "manager"
                        ? "Project Manager"
                        : "System Administrator"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Cerrar sesión</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

