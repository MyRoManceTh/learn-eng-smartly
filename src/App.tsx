import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import LearningPathPage from "./pages/LearningPathPage";
import LibraryPage from "./pages/LibraryPage";
import QuizPage from "./pages/QuizPage";
import AvatarPage from "./pages/AvatarPage";
import NotFound from "./pages/NotFound";
import SeasonPassPage from "@/components/events/SeasonPassPage";
import PremiumPage from "@/components/premium/PremiumPage";
import ParentReport from "@/components/premium/ParentReport";
import AdminPage from "@/pages/AdminPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/path" element={<LearningPathPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/avatar" element={<AvatarPage />} />
              <Route path="/season-pass" element={<SeasonPassPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/parent-report" element={<ParentReport />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
          <BottomNav />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

