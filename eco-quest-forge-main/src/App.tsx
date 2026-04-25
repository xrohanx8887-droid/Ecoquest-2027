import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import EcoBot from "./components/EcoBot";
import ProtectedRoute from "./components/ProtectedRoute";
import { GreenCoinsProvider } from "./hooks/useGreenCoins";
import { AuthProvider } from "./contexts/AuthContext";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherDashboard from "./pages/TeacherDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GreenCoinsProvider>
        <TooltipProvider>
          {/* Ultra-colorful and attractive background with multiple effects */}
          <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            {/* Main colorful atmospheric base */}
            <div className="w-full h-full bg-gradient-to-br from-fun-blue/12 via-primary-light/15 to-fun-purple/12 absolute inset-0" />
            {/* Additional colorful overlay */}
            <div className="w-full h-full bg-gradient-to-tr from-fun-pink/8 via-fun-orange/10 to-accent/8 absolute inset-0" />

            {/* Large floating orbs */}
            <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-fun-blue/25 via-primary/20 to-transparent opacity-70 blur-3xl animate-drift" />
            <div className="absolute bottom-[-120px] right-[-120px] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-fun-purple/25 via-accent/20 to-transparent opacity-60 blur-3xl animate-swirl" />
            <div className="absolute top-[30%] left-[-100px] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-fun-orange/20 via-warning/15 to-transparent opacity-50 blur-3xl animate-breathe" />
            <div className="absolute bottom-[15%] left-[5%] w-[180px] h-[180px] rounded-full bg-gradient-to-br from-fun-pink/20 via-fun-purple/15 to-transparent opacity-40 blur-3xl animate-morph" />

            {/* Medium floating elements */}
            <div className="absolute top-[15%] right-[2%] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-fun-blue/15 via-primary/12 to-transparent opacity-45 blur-2xl animate-ripple" />
            <div className="absolute bottom-[55%] right-[15%] w-[150px] h-[150px] rounded-full bg-gradient-to-br from-fun-pink/18 via-accent/12 to-transparent opacity-50 blur-2xl animate-drift" />
            <div className="absolute top-[65%] left-[20%] w-[120px] h-[120px] rounded-full bg-gradient-to-br from-fun-orange/16 via-warning/10 to-transparent opacity-45 blur-2xl animate-breathe" />

            {/* Small accent orbs */}
            <div className="absolute top-[45%] right-[25%] w-[80px] h-[80px] rounded-full bg-gradient-to-br from-fun-purple/20 via-fun-blue/15 to-transparent opacity-60 blur-xl animate-sparkle" />
            <div className="absolute bottom-[35%] left-[40%] w-[100px] h-[100px] rounded-full bg-gradient-to-br from-fun-pink/18 via-fun-orange/12 to-transparent opacity-55 blur-xl animate-float" />
            <div className="absolute top-[75%] right-[45%] w-[90px] h-[90px] rounded-full bg-gradient-to-br from-accent/20 via-primary/15 to-transparent opacity-50 blur-xl animate-pulse-slow" />

            {/* Subtle wave patterns */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-[20%] left-[10%] w-[300px] h-[100px] bg-gradient-to-r from-transparent via-fun-blue/5 to-transparent rounded-full blur-2xl animate-float" />
              <div className="absolute bottom-[30%] right-[20%] w-[250px] h-[80px] bg-gradient-to-r from-transparent via-fun-purple/6 to-transparent rounded-full blur-2xl animate-pulse-slower" />
              <div className="absolute top-[60%] left-[60%] w-[200px] h-[60px] bg-gradient-to-r from-transparent via-fun-orange/5 to-transparent rounded-full blur-2xl animate-wiggle" />
            </div>
          </div>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/teacher/login" element={<TeacherLogin />} />
              <Route
                path="/teacher"
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]} redirectTo="/teacher/login">
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <Index />
                    <EcoBot />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GreenCoinsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
