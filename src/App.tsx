
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/studying" element={<div>Studying</div>} />
            <Route path="/typing-meter" element={<div>Typing Meter</div>} />
            <Route path="/custom-review" element={<div>Custom Review</div>} />
            <Route path="/typing-test" element={<div>Typing Test</div>} />
            <Route path="/games" element={<div>Games</div>} />
            <Route path="/statistics" element={<div>Statistics</div>} />
            <Route path="/settings" element={<div>Settings</div>} />
            <Route path="/about" element={<div>About</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
