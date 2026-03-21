import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Mic, MicOff, Volume2, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { playCorrect, playWrong } from "@/utils/sounds";
import { allLessons } from "@/data/lessons";

interface PracticeWord {
  english: string;
  phonetic: string;
  thai: string;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z\s]/g, "").trim();
}

function scoreAccuracy(expected: string, actual: string): { score: number; matched: string[]; missed: string[] } {
  const expWords = normalize(expected).split(/\s+/);
  const actWords = normalize(actual).split(/\s+/);
  const actSet = new Set(actWords);
  const matched: string[] = [];
  const missed: string[] = [];

  for (const w of expWords) {
    if (actSet.has(w)) matched.push(w);
    else missed.push(w);
  }

  return {
    score: expWords.length > 0 ? Math.round((matched.length / expWords.length) * 100) : 0,
    matched,
    missed,
  };
}

export default function SpeakingPracticePage() {
  const navigate = useNavigate();
  const { isSupported, isListening, transcript, error, startListening, stopListening, reset } = useSpeechRecognition();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Build word pool from lessons
  const words: PracticeWord[] = useMemo(() => {
    const pool: PracticeWord[] = [];
    const seen = new Set<string>();
    for (const lesson of allLessons) {
      const vocab = lesson.vocabulary as Array<{ word: string; phonetic: string; meaning: string }>;
      if (!vocab) continue;
      for (const v of vocab) {
        if (!seen.has(v.word)) {
          pool.push({ english: v.word, phonetic: v.phonetic, thai: v.meaning });
          seen.add(v.word);
        }
      }
    }
    // Shuffle deterministically
    return pool.sort(() => 0.5 - Math.random()).slice(0, 50);
  }, []);

  const currentWord = words[currentIdx % words.length];
  const result = showResult && transcript ? scoreAccuracy(currentWord.english, transcript) : null;

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      reset();
      setShowResult(false);
      startListening();
    }
  };

  // Auto-show result when transcript arrives
  if (transcript && !showResult && !isListening) {
    setShowResult(true);
    const r = scoreAccuracy(currentWord.english, transcript);
    setTotalScore((s) => s + r.score);
    setTotalAttempts((a) => a + 1);
    if (r.score >= 70) {
      playCorrect();
      // Count speaking sessions: every 5 words = 1 session
      const newAttempts = totalAttempts + 1;
      if (newAttempts % 5 === 0) {
        const sessions = parseInt(localStorage.getItem("speaking_sessions") || "0", 10);
        localStorage.setItem("speaking_sessions", String(sessions + 1));
      }
    } else {
      playWrong();
    }
  }

  const handleNext = () => {
    setCurrentIdx((i) => i + 1);
    setShowResult(false);
    reset();
  };

  // Unsupported browser
  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <span className="text-5xl">🎙️</span>
          <h2 className="text-lg font-bold font-thai">เบราว์เซอร์ไม่รองรับ</h2>
          <p className="text-sm text-muted-foreground font-thai">
            ฟีเจอร์ฝึกพูดต้องใช้ Chrome หรือ Edge
          </p>
          <Button onClick={() => navigate("/pronunciation")} variant="outline">
            ไปหน้าฝึกออกเสียงแทน
          </Button>
        </div>
      </div>
    );
  }

  const avgScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold font-thai">🎙️ ฝึกพูด</h1>
          <span className="text-xs text-muted-foreground font-thai">
            เฉลี่ย {avgScore}%
          </span>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        {/* Word display */}
        <div className="rounded-3xl bg-white border-2 border-pink-200 p-8 text-center shadow-lg">
          <p className="text-3xl font-bold font-reading text-foreground mb-2">{currentWord.english}</p>
          <p className="text-sm text-muted-foreground">{currentWord.phonetic}</p>
          <p className="text-sm font-thai text-pink-600 mt-2">{currentWord.thai}</p>

          {/* Listen button */}
          <button
            onClick={() => speak(currentWord.english)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-xs font-bold hover:bg-pink-200 transition-colors"
          >
            <Volume2 className="w-4 h-4" /> ฟังก่อน
          </button>
        </div>

        {/* Mic button */}
        <div className="flex justify-center">
          <button
            onClick={handleMicClick}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl",
              isListening
                ? "bg-red-500 animate-pulse scale-110 shadow-red-500/30"
                : "bg-gradient-to-br from-rose-500 to-pink-500 hover:scale-105 shadow-pink-500/30"
            )}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground font-thai">
          {isListening ? "กำลังฟัง... พูดได้เลย" : "กดปุ่มแล้วพูดคำด้านบน"}
        </p>

        {error && (
          <p className="text-center text-sm text-red-500 font-thai">{error}</p>
        )}

        {/* Result */}
        {showResult && result && (
          <div className={cn(
            "rounded-2xl p-5 space-y-3",
            result.score >= 70 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          )}>
            {/* Score circle */}
            <div className="flex items-center justify-center gap-3">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl",
                result.score >= 90 ? "bg-green-500" :
                result.score >= 70 ? "bg-emerald-500" :
                result.score >= 50 ? "bg-amber-500" : "bg-red-500"
              )}>
                {result.score}%
              </div>
              <div>
                <p className={cn("font-bold font-thai", result.score >= 70 ? "text-green-700" : "text-red-700")}>
                  {result.score >= 90 ? "ยอดเยี่ยม! 🌟" :
                   result.score >= 70 ? "ดีมาก! 👏" :
                   result.score >= 50 ? "พอใช้ได้ 💪" : "ลองอีกครั้ง 😊"}
                </p>
                <p className="text-xs text-muted-foreground font-thai">
                  คุณพูด: "{transcript}"
                </p>
              </div>
            </div>

            {/* Word comparison */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {normalize(currentWord.english).split(/\s+/).map((w, i) => (
                <span
                  key={i}
                  className={cn(
                    "px-2 py-1 rounded-lg text-sm font-reading font-medium",
                    result.matched.includes(w)
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  )}
                >
                  {result.matched.includes(w) ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <XCircle className="w-3 h-3 inline mr-1" />}
                  {w}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => { reset(); setShowResult(false); }}
                className="flex-1 font-thai"
              >
                <RotateCcw className="w-4 h-4 mr-1" /> ลองอีก
              </Button>
              <Button onClick={handleNext} className="flex-1 font-thai">
                คำถัดไป →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
