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
import MyPage from "./pages/MyPage";
import LearningPathPage from "./pages/LearningPathPage";
import LibraryPage from "./pages/LibraryPage";
import QuizPage from "./pages/QuizPage";
import AvatarPage from "./pages/AvatarPage";
import NotFound from "./pages/NotFound";
import PracticePage from "./pages/PracticePage";
import LearnPage from "./pages/LearnPage";
import ReadingPage from "./pages/ReadingPage";
import ConversationPage from "./pages/ConversationPage";
import WordGamesPage from "./pages/WordGamesPage";
import DailyNewsPage from "./pages/DailyNewsPage";
import PronunciationPage from "./pages/PronunciationPage";
import ShopPage from "./pages/ShopPage";
import SeasonPassPage from "@/components/events/SeasonPassPage";
import PremiumPage from "@/components/premium/PremiumPage";
import ParentReport from "@/components/premium/ParentReport";
import AdminPage from "@/pages/AdminPage";
import PlacementTestPage from "./pages/PlacementTestPage";

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
              <Route path="/my" element={<MyPage />} />
              <Route path="/profile" element={<MyPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/path" element={<LearningPathPage />} />
              <Route path="/practice" element={<LearnPage />} />
              <Route path="/reading" element={<ReadingPage />} />
              <Route path="/conversation" element={<ConversationPage />} />
              <Route path="/games" element={<WordGamesPage />} />
              <Route path="/news" element={<DailyNewsPage />} />
              <Route path="/pronunciation" element={<PronunciationPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/avatar" element={<MyPage />} />
              <Route path="/season-pass" element={<SeasonPassPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/parent-report" element={<ParentReport />} />
              <Route path="/placement" element={<PlacementTestPage />} />
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

