import { Button } from "@/components/ui/button";
import { Swords, BookOpen, Headphones, MessageSquare } from "lucide-react";

interface PlacementWelcomeProps {
  onStart: () => void;
}

const stages = [
  { icon: <Swords className="w-5 h-5" />, name: "Grammar Arena", nameThai: "สนามไวยากรณ์", count: "5 ข้อ", color: "text-red-500" },
  { icon: <MessageSquare className="w-5 h-5" />, name: "Vocabulary Quest", nameThai: "ภารกิจคำศัพท์", count: "5 ข้อ", color: "text-blue-500" },
  { icon: <BookOpen className="w-5 h-5" />, name: "Reading Dungeon", nameThai: "ดันเจี้ยนการอ่าน", count: "3 ข้อ", color: "text-green-500" },
  { icon: <Headphones className="w-5 h-5" />, name: "Listening Tower", nameThai: "หอคอยการฟัง", count: "3 ข้อ", color: "text-purple-500" },
];

const PlacementWelcome = ({ onStart }: PlacementWelcomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-500">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="text-6xl animate-bounce">🏰</div>
          <h1 className="text-2xl font-bold text-white font-thai">
            ยินดีต้อนรับนักผจญภัย!
          </h1>
          <p className="text-purple-200 font-thai text-sm leading-relaxed">
            มาวัดระดับความสามารถของเจ้า<br />
            เพื่อเริ่มต้นการผจญภัยที่เหมาะสม
          </p>
        </div>

        {/* Stages preview */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-3">
          <p className="text-xs text-purple-300 font-thai font-semibold uppercase tracking-wider">
            4 ด่านทดสอบ
          </p>
          {stages.map((stage, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center ${stage.color}`}>
                {stage.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{stage.name}</p>
                <p className="text-xs text-purple-300 font-thai">{stage.nameThai}</p>
              </div>
              <span className="text-xs text-purple-400 font-thai">{stage.count}</span>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="text-center space-y-1">
          <p className="text-xs text-purple-400 font-thai">
            รวม 16 ข้อ | ความยากปรับตามคำตอบของคุณ
          </p>
          <p className="text-xs text-purple-500 font-thai">
            ไม่มีถูกผิด ทำให้เต็มที่เพื่อวัดระดับที่แม่นยำ
          </p>
        </div>

        {/* Start button */}
        <Button
          onClick={onStart}
          className="w-full h-14 text-lg font-thai bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-500/30 rounded-xl"
          size="lg"
        >
          เริ่มทดสอบ
        </Button>
      </div>
    </div>
  );
};

export default PlacementWelcome;
