
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Studying from "./pages/Studying";
import LessonContent from "./pages/LessonContent";
import TypingMeter from "./pages/TypingMeter";
import CustomReview from "./pages/CustomReview";
import TypingTest from "./pages/TypingTest";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import React from "react";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/studying" 
                  element={
                    <ProtectedRoute>
                      <Studying />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/studying/lesson/:lessonId" 
                  element={<LessonContent />} 
                />
                <Route 
                  path="/typing-meter" 
                  element={<TypingMeter />} 
                />
                <Route 
                  path="/custom-review" 
                  element={
                    <ProtectedRoute>
                      <CustomReview />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/typing-test" 
                  element={<TypingTest />} 
                />
                <Route 
                  path="/statistics" 
                  element={
                    <ProtectedRoute>
                      <Statistics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile/edit" 
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Public Routes */}
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
