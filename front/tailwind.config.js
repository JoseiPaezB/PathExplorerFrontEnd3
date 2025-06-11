/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Accenture Purple Theme Colors
        border: "hsl(0 0% 85%)", // Light border for contrast on purple
        input: "hsl(270 40% 25%)", // Dark purple for inputs
        ring: "hsl(270 100% 70%)", // Bright purple for focus rings
        background: "hsl(270 80% 15%)", // Deep Accenture purple background
        foreground: "hsl(0 0% 95%)", // Light text for contrast
        
        primary: {
          DEFAULT: "#A100FF", // Accenture Purple
          light: "#B533FF",
          dark: "#8800D6",
          foreground: "#FFFFFF",
          50: "#F9F0FF",
          100: "#F3E1FF",
          200: "#E7C3FF",
          300: "#D699FF",
          400: "#C266FF",
          500: "#A100FF",
          600: "#8800D6",
          700: "#6F00AD",
          800: "#560085",
          900: "#3D005C",
        },
        
        secondary: {
          DEFAULT: "hsl(270 40% 25%)", // Purple-tinted secondary
          foreground: "hsl(0 0% 95%)", // Light text
          50: "#F9F0FF",
          100: "#F3E1FF",
          200: "#E7C3FF",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "hsl(270 40% 25%)",
        },
        
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)", // Keep red for errors
          foreground: "hsl(0 0% 98%)",
        },
        
        muted: {
          DEFAULT: "hsl(270 30% 25%)", // Muted purple
          foreground: "hsl(0 0% 70%)", // Muted light text
        },
        
        accent: {
          DEFAULT: "hsl(270 60% 30%)", // Accent purple
          foreground: "hsl(0 0% 95%)",
        },
        
        popover: {
          DEFAULT: "hsl(270 70% 18%)", // Dark purple for popovers
          foreground: "hsl(0 0% 95%)",
        },
        
        card: {
          DEFAULT: "hsl(270 60% 20%)", // Slightly lighter purple for cards
          foreground: "hsl(0 0% 95%)",
        },
        
        success: {
          DEFAULT: "hsl(142 71% 45%)", // Green for success
          foreground: "hsl(0 0% 100%)",
        },
        
        warning: {
          DEFAULT: "hsl(38 92% 50%)", // Orange for warnings
          foreground: "hsl(0 0% 100%)",
        },
        
        info: {
          DEFAULT: "hsl(199 89% 48%)", // Blue for info
          foreground: "hsl(0 0% 100%)",
        },
        
        // Additional utility colors for purple theme
        'purple-bg': {
          light: "hsl(270 60% 20%)",
          DEFAULT: "hsl(270 80% 15%)",
          dark: "hsl(270 85% 12%)",
        },
        
        'text-light': "hsl(0 0% 95%)",
        'text-muted-light': "hsl(0 0% 70%)",
        'border-light': "hsl(0 0% 85%)",
      },
      
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      
      boxShadow: {
        subtle: "0 1px 2px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02)",
        card: "0 4px 12px rgba(161, 0, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.04)", // Purple-tinted shadows
        elevated: "0 10px 30px -5px rgba(161, 0, 255, 0.15), 0 1px 3px rgba(0, 0, 0, 0.05)",
        dropdown: "0 4px 20px rgba(161, 0, 255, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)",
        button: "0 1px 2px rgba(0, 0, 0, 0.05)",
        "button-hover": "0 3px 6px rgba(161, 0, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.04)",
        "purple-glow": "0 0 20px rgba(161, 0, 255, 0.3)",
        "purple-glow-lg": "0 0 40px rgba(161, 0, 255, 0.4)",
      },
      
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { transform: "translateY(10px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        slideDown: {
          from: { transform: "translateY(-10px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        slideLeft: {
          from: { transform: "translateX(10px)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
        slideRight: {
          from: { transform: "translateX(-10px)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
        scaleIn: {
          from: { transform: "scale(0.98)", opacity: 0 },
          to: { transform: "scale(1)", opacity: 1 },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Purple-specific animations
        "purple-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(161, 0, 255, 0.3)",
            opacity: 1 
          },
          "50%": { 
            boxShadow: "0 0 40px rgba(161, 0, 255, 0.6)",
            opacity: 0.8 
          },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left": "slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right": "slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        "purple-pulse": "purple-pulse 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease-in-out infinite",
      },
      
      fontFamily: {
        sans: [
          '"SF Pro Display"',
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          "SFMono-Regular",
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
      
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "65ch",
            color: "hsl(0 0% 95%)", // Light text for purple theme
            lineHeight: "1.5",
            a: {
              color: "#A100FF", // Accenture purple for links
              textDecoration: "none",
              fontWeight: "500",
            },
            strong: {
              color: "hsl(0 0% 98%)", // Very light for headings
              fontWeight: "600",
            },
            p: {
              marginTop: "1.25em",
              marginBottom: "1.25em",
            },
            h2: {
              marginTop: "1.5em",
              marginBottom: "0.75em",
              lineHeight: "1.3",
              color: "hsl(0 0% 98%)",
            },
            h3: {
              marginTop: "1.5em",
              marginBottom: "0.75em",
              lineHeight: "1.3",
              color: "hsl(0 0% 98%)",
            },
            code: {
              color: "#D699FF", // Light purple for code
              fontWeight: "500",
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}