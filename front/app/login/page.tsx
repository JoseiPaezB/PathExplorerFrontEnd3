"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, CheckCircle, AlertCircle, UserPlus, Shield, Users, Award, Globe, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";

// Remove the custom component definitions since we're using the real UI components now

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login, isAuthenticated, user, isLoggingOut } = useAuth();

  // Helper function to get redirect path based on user role
  const getRedirectPath = (userRole: string) => {
    if (userRole === "administrador") {
      return "/usuarios";
    } else {
      return "/dashboard";
    }
  };

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user && !isLoggingOut && !isRedirecting) {
      setIsRedirecting(true);
      const redirectPath = getRedirectPath(user.role);
      setTimeout(() => {
        router.push(redirectPath);
      }, 100);
    }
  }, [isAuthenticated, user, router, isLoggingOut, isRedirecting]);

  // Resetear el estado de redirección cuando terminamos de hacer logout
  useEffect(() => {
    if (!isLoggingOut && !isAuthenticated) {
      setIsRedirecting(false);
    }
  }, [isLoggingOut, isAuthenticated]);

  // Mock navigation function
  const navigateTo = (path: string) => {
    // In a real app, you'd use next/router or similar
    console.log(`Navigating to: ${path}`);
    alert(`Demo: Would redirect to ${path}`);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading || isRedirecting) return;

    setIsLoading(true);
    setError("");

    try {
      const loggedInUser = await login(email, password);
      setSuccess(true);

      const redirectPath = loggedInUser
        ? getRedirectPath(loggedInUser.role)
        : "/dashboard";

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al Sistema de Gestión de Talentos",
      });

      setIsRedirecting(true);

      setTimeout(() => {
        router.push(redirectPath);
      }, 1200);
    } catch (error) {
      setError("Por favor, verifica tus credenciales e intenta nuevamente");
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const leftSlideVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  const rightSlideVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 1, ease: "easeOut", delay: 0.3 }
    }
  };
  
  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Left Half - Branding */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={leftSlideVariants}
        className="w-full md:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900"
      >
        {/* Background Image/Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: [
              '0% 0%',
              '100% 100%',
              '0% 0%'
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2],
              x: [0, -40, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 p-4 md:p-8 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className=" p-1.5 md:p-2 rounded-xl">
                <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-Qymnx3GxRns8Bpvp2y0MtAqaHaQmEo.png"
                alt="Accenture Logo"
                className="h-20 drop-shadow-lg"
              />              
            </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col justify-center p-6 md:p-16 text-white max-w-2xl min-h-full">
          <motion.div
            variants={containerVariants}
            className="space-y-6 md:space-y-8"
          >
            <motion.div variants={itemVariants}>
              <p className="text-white-300 font-medium mb-2 md:mb-4 tracking-wide uppercase text-xs md:text-sm">
                Portal de Empleados
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                Bienvenido a
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-300"
                  animate={{
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {" "}PATH EXPLORER
                </motion.span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg">
                Accede a todas las herramientas y recursos que necesitas para gestionar tu carrera profesional en Accenture.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Half - Form */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={rightSlideVariants}
        className="w-full md:w-1/2 bg-white flex items-center justify-center p-4 md:p-8"
      >
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="md:hidden mb-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <span className="text-gray-900 font-bold text-2xl">Accenture HR</span>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            className="space-y-6 md:space-y-8"
          >
            <motion.div variants={itemVariants} className="text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
                Accede a tu cuenta
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Ingresa tus credenciales corporativas para continuar
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-12 space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: 0.2,
                    }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full"
                  >
                    <CheckCircle className="h-10 w-10 text-green-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      ¡Bienvenido de vuelta!
                    </h3>
                    <p className="text-gray-600">Redirigiendo al portal...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleLogin}
                  className="space-y-4 md:space-y-6"
                  variants={containerVariants}
                >
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert variant="destructive">
                          <AlertDescription>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {error}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="email">Correo corporativo</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-purple-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="nombre@accenture.com"
                        className="pl-12 h-12 md:h-14 text-sm md:text-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Contraseña</Label>
                      <Link
                        href="/recuperar-password"
                        className="text-xs md:text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-purple-500" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pl-12 pr-12 h-12 md:h-14 text-sm md:text-base"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-4">
                    <Button
                      type="submit"
                      className="w-full h-12 md:h-14 text-sm md:text-base font-semibold"
                      disabled={isLoading || isRedirecting}
                    >
                      {isLoading ? (
                        <motion.div
                          className="flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Iniciando sesión...
                        </motion.div>
                      ) : (
                        <motion.div
                          className="flex items-center justify-center"
                          whileHover={{ x: 2 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          Iniciar sesión
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </motion.div>
                      )}
                    </Button>

                    <Link href="/signup">
                      <Button
                        variant="outline"
                        className="w-full h-10 md:h-12 mt-1"
                        type="button"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Crear cuenta nueva
                      </Button>
                    </Link>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>

            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center text-xs text-gray-500 pt-4 md:pt-6"
            >
              <Lock className="h-3 w-3 mr-1 text-primary" />
              Conexión segura SSL/TLS
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}