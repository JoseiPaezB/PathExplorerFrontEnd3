"use client"
import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    const { user, isAuthenticated } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const router = useRouter()

    // Verificar autenticación con useEffect para evitar redirecciones del servidor
    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            console.log("Usuario no autenticado, redirigiendo a login desde useEffect")
            router.push("/login")
        } else {
            setIsCheckingAuth(false)
        }
    }, [isAuthenticated, isLoading, router])

    useEffect(() => {
        // Simulate loading state for smooth transitions
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 300)
        return () => clearTimeout(timer)
    }, [])

    // Mostrar una pantalla de carga mientras verificamos la autenticación
    if (isCheckingAuth || isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
                <div className="flex flex-col items-center">
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-Qymnx3GxRns8Bpvp2y0MtAqaHaQmEo.png"
                        alt="Accenture Logo"
                        className="h-16 w-16 mb-4"
                    />
                    <div className="h-1 w-48 bg-muted overflow-hidden rounded-full">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{
                                repeat: Number.POSITIVE_INFINITY,
                                duration: 1.5,
                                ease: "linear",
                            }}
                            className="h-full w-1/3 bg-primary rounded-full"
                        />
                    </div>
                </div>
            </div>
        )
    }

    // Si no hay usuario autenticado, no renderizamos nada (la redirección ya se maneja en useEffect)
    if (!isAuthenticated || !user) {
        return null
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Elegant loading state */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-center"
                        >
                            <img
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-Qymnx3GxRns8Bpvp2y0MtAqaHaQmEo.png"
                                alt="Accenture Logo"
                                className="h-16 w-16 mb-4"
                            />
                            <div className="h-1 w-48 bg-muted overflow-hidden rounded-full">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{
                                        repeat: Number.POSITIVE_INFINITY,
                                        duration: 1.5,
                                        ease: "linear",
                                    }}
                                    className="h-full w-1/3 bg-primary rounded-full"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Static sidebar with refined animation */}
            <Sidebar userRole={user?.role || "employee"} className="fixed left-0 top-0 z-30" />
            {/* Main content area with subtle animation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 pl-[280px]"
            >
                {/* Fixed header with glass effect */}
                <Header user={user} />
                {/* Scrollable content area with proper padding and animations */}
                <main className="h-[calc(100vh-4rem)] overflow-y-auto px-8 pt-24 pb-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={user?.id || "default"}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                                duration: 0.4,
                                ease: [0.22, 1, 0.36, 1],
                                staggerChildren: 0.1,
                            }}
                            className="max-w-7xl mx-auto"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </motion.div>
            <Toaster />
        </div>
    )
}