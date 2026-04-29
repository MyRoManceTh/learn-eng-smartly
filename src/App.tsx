import { lazy, Suspense } from "react";
import { LevelUpProvider } from "@/contexts/LevelUpContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";
import DisplayNameModal, { useDisplayNameCheck } from "@/components/DisplayNameModal";
import { HighlightWordRouteScope } from "@/contexts/HighlightWordRouteScope";

// Eagerly loaded (landing + auth — first paint)
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";

// Lazy-loaded pages
const MyPage = lazy(() => import("./pages/MyPage"));
const LearnPage = lazy(() => import("./pages/LearnPage"));
const ReadingPage = lazy(() => import("./pages/ReadingPage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const ConversationPage = lazy(() => import("./pages/ConversationPage"));
const WordGamesPage = lazy(() => import("./pages/WordGamesPage"));
const DailyNewsPage = lazy(() => import("./pages/DailyNewsPage"));
const PronunciationPage = lazy(() => import("./pages/PronunciationPage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const AvatarPage = lazy(() => import("./pages/AvatarPage"));
const FlashcardPage = lazy(() => import("./pages/FlashcardPage"));
const SpeakingPracticePage = lazy(() => import("./pages/SpeakingPracticePage"));
const DailyChallengePage = lazy(() => import("./pages/DailyChallengePage"));
const AchievementsPage = lazy(() => import("./pages/AchievementsPage"));
const RewardsShopPage = lazy(() => import("./pages/RewardsShopPage"));
const SkipLevelTestPage = lazy(() => import("./pages/SkipLevelTestPage"));
const PlacementTestPage = lazy(() => import("./pages/PlacementTestPage"));
const FriendLeaderboardPage = lazy(() => import("./pages/FriendLeaderboardPage"));
const FriendsPage = lazy(() => import("./pages/FriendsPage"));
const SeasonPassPage = lazy(() => import("@/components/events/SeasonPassPage"));
const PremiumPage = lazy(() => import("@/components/premium/PremiumPage"));
const ParentReport = lazy(() => import("@/components/premium/ParentReport"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const LineCallbackPage = lazy(() => import("./pages/LineCallbackPage"));
const PracticePage = lazy(() => import("./pages/PracticePage"));
const LearningPathPage = lazy(() => import("./pages/LearningPathPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function AppContent() {
  const { showModal, setShowModal, currentName, setCurrentName } = useDisplayNameCheck();

  return (
    <>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
      <PageTransition>
        <HighlightWordRouteScope>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/line/callback" element={<LineCallbackPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/profile" element={<MyPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/path" element={<LearnPage />} />
          <Route path="/practice" element={<ReadingPage />} />
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
          <Route path="/friend-ranking" element={<FriendLeaderboardPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/flashcards" element={<FlashcardPage />} />
          <Route path="/speaking" element={<SpeakingPracticePage />} />
          <Route path="/daily-challenge" element={<DailyChallengePage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/rewards-shop" element={<RewardsShopPage />} />
          <Route path="/skip-level" element={<SkipLevelTestPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </HighlightWordRouteScope>
      </PageTransition>
      </Suspense>
      <BottomNav />
      <DisplayNameModal
        open={showModal}
        onOpenChange={setShowModal}
        currentName={currentName}
        onSaved={(n) => setCurrentName(n)}
        required
      />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LevelUpProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </LevelUpProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
