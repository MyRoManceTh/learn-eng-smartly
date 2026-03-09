import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { conversationScenarios, ConversationScenario, ConversationMessage } from "@/data/conversationData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { playCorrect, playWrong, playComplete } from "@/utils/sounds";
import confetti from "canvas-confetti";
import { toast } from "sonner";

const ConversationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addExp, addCoins } = useProfile();
  const [selected, setSelected] = useState<ConversationScenario | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<{ msg: ConversationMessage; chosenOption?: number }[]>([]);
  const [score, setScore] = useState(0);
  const [totalChoices, setTotalChoices] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages]);

  const startScenario = (scenario: ConversationScenario) => {
    setSelected(scenario);
    setMessageIndex(0);
    setVisibleMessages([]);
    setScore(0);
    setTotalChoices(0);
    setFinished(false);
    setSelectedOption(null);
    // Show first NPC message
    if (scenario.messages[0].speaker === "npc") {
      setVisibleMessages([{ msg: scenario.messages[0] }]);
      setMessageIndex(1);
    }
  };

  const handleChoice = (optionIdx: number) => {
    if (!selected || selectedOption !== null) return;
    setSelectedOption(optionIdx);

    const currentMsg = selected.messages[messageIndex];
    const option = currentMsg.options![optionIdx];
    const isCorrect = option.isCorrect;

    if (isCorrect) {
      playCorrect();
      setScore(s => s + 1);
    } else {
      playWrong();
    }
    setTotalChoices(t => t + 1);

    // Add the player message
    setVisibleMessages(prev => [...prev, { msg: { ...currentMsg, text: option.text, textThai: option.textThai }, chosenOption: optionIdx }]);

    // After a short delay, show next NPC message or finish
    setTimeout(() => {
      const nextIdx = messageIndex + 1;
      if (nextIdx < selected.messages.length) {
        const nextMsg = selected.messages[nextIdx];
        if (nextMsg.speaker === "npc") {
          setVisibleMessages(prev => [...prev, { msg: nextMsg }]);
          setMessageIndex(nextIdx + 1);
        } else {
          setMessageIndex(nextIdx);
        }
      } else {
        // Conversation finished
        setFinished(true);
        playComplete();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
      setSelectedOption(null);
    }, 800);
  };

  const handleFinish = async () => {
    if (user) {
      const exp = score * 10 + 5;
      const coins = score * 5;
      await addExp(exp);
      await addCoins(coins);
      toast.success(`+${exp} EXP, +${coins} เหรียญ!`);
    }
    setSelected(null);
  };

  // Conversation view
  if (selected) {
    const currentMsg = !finished && messageIndex < selected.messages.length ? selected.messages[messageIndex] : null;
    const isPlayerTurn = currentMsg?.speaker === "player" && currentMsg.options;

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 flex flex-col">
        <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <div className="flex-1">
              <span className="text-base font-bold font-thai">{selected.icon} {selected.titleThai}</span>
              <span className="text-xs text-muted-foreground ml-2 font-thai">กับ {selected.npcName}</span>
            </div>
            <div className="flex items-center gap-1 bg-green-100 rounded-full px-2 py-0.5">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span className="text-xs font-bold text-green-700">{score}</span>
            </div>
          </div>
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-4">
          {visibleMessages.map((vm, i) => (
            <div key={i} className={cn("flex", vm.msg.speaker === "player" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300",
                vm.msg.speaker === "player"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md"
                  : "bg-white border border-gray-100 rounded-bl-md"
              )}>
                {vm.msg.speaker === "npc" && (
                  <p className="text-[10px] font-bold text-purple-500 mb-1">{selected.npcName}</p>
                )}
                <p className={cn("text-sm font-reading", vm.msg.speaker === "npc" && "text-foreground")}>{vm.msg.text}</p>
                <p className={cn("text-xs mt-1 font-thai", vm.msg.speaker === "player" ? "text-white/70" : "text-muted-foreground")}>
                  {vm.msg.textThai}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Options / Finished */}
        <div className="border-t border-white/50 bg-white/80 backdrop-blur-xl p-4 safe-area-bottom">
          {finished ? (
            <div className="text-center space-y-3">
              <p className="font-thai font-bold text-lg">สนทนาจบแล้ว! 🎉</p>
              <p className="text-sm text-muted-foreground font-thai">ตอบถูก {score}/{totalChoices} ข้อ</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => startScenario(selected)} variant="outline" className="font-thai">
                  <RotateCcw className="w-4 h-4 mr-1" /> ลองใหม่
                </Button>
                <Button onClick={handleFinish} className="font-thai bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                  รับรางวัล
                </Button>
              </div>
            </div>
          ) : isPlayerTurn ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-thai mb-2">เลือกคำตอบ:</p>
              {currentMsg!.options!.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(idx)}
                  disabled={selectedOption !== null}
                  className={cn(
                    "w-full text-left rounded-xl border-2 p-3 transition-all active:scale-[0.98]",
                    selectedOption === idx
                      ? opt.isCorrect
                        ? "border-green-400 bg-green-50"
                        : "border-red-400 bg-red-50"
                      : selectedOption !== null && opt.isCorrect
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50",
                    selectedOption !== null && selectedOption !== idx && !opt.isCorrect && "opacity-50"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {selectedOption !== null && (
                      opt.isCorrect
                        ? <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        : selectedOption === idx
                          ? <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          : null
                    )}
                    <div>
                      <p className="text-sm font-reading">{opt.text}</p>
                      <p className="text-xs text-muted-foreground font-thai">{opt.textThai}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Scenario list
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
      <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/practice")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <h1 className="text-lg font-bold font-thai">💬 ฝึกบทสนทนา</h1>
        </div>
      </header>
      <main className="px-4 py-5 max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground font-thai mb-4">ฝึกสนทนาภาษาอังกฤษในสถานการณ์จริง เลือกตอบแล้วดูผลทันที</p>
        <div className="space-y-3">
          {conversationScenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => startScenario(sc)}
              className="group w-full text-left rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur-sm p-4 shadow-md hover:shadow-lg transition-all active:scale-[0.98] overflow-hidden relative"
            >
              <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b", sc.color)} />
              <div className="flex items-center gap-4 pl-3">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md bg-gradient-to-br", sc.color)}>
                  {sc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold font-thai text-foreground">{sc.titleThai}</h3>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(s => (
                        <Star key={s} className={cn("w-3 h-3", s <= sc.level ? "text-amber-400 fill-amber-400" : "text-gray-200")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{sc.description}</p>
                  <p className="text-[10px] text-purple-500 font-thai mt-1">กับ {sc.npcName} ({sc.npcRole})</p>
                </div>
                <svg className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ConversationPage;
