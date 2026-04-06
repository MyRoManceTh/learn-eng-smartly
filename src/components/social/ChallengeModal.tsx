import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  title_thai: string;
  level: number;
}

interface Props {
  open: boolean;
  friendId: string;
  friendName: string;
  onClose: () => void;
  onSend: (opponentId: string, lessonId?: string) => Promise<boolean | undefined>;
}

export default function ChallengeModal({ open, friendId, friendName, onClose, onSend }: Props) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string | undefined>(undefined);
  const [isRandom, setIsRandom] = useState(true);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    supabase
      .from("lessons")
      .select("id, title, title_thai, level")
      .eq("is_published", true)
      .order("level", { ascending: true })
      .limit(10)
      .then(({ data }) => {
        if (data) setLessons(data as Lesson[]);
        setLoading(false);
      });
  }, [open]);

  if (!open) return null;

  const handleSend = async () => {
    setSending(true);
    const result = await onSend(friendId, isRandom ? undefined : selectedLesson);
    setSending(false);
    if (result !== false) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-base font-bold font-thai">
            ⚔️ ท้าทาย {friendName}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-muted-foreground font-thai">
            เลือกหัวข้อ Quiz ที่ต้องการแข่ง ทั้งคู่จะทำ Quiz เดียวกัน!
          </p>

          {/* Random option */}
          <button
            onClick={() => { setIsRandom(true); setSelectedLesson(undefined); }}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
              isRandom
                ? "border-purple-400 bg-purple-50"
                : "border-gray-200 hover:border-purple-200"
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Shuffle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold font-thai">สุ่มบทเรียน</p>
              <p className="text-[10px] text-muted-foreground font-thai">ลุ้นบทไหนก็ได้!</p>
            </div>
            {isRandom && <span className="ml-auto text-purple-600 text-xs font-bold">เลือก ✓</span>}
          </button>

          {/* Lesson list */}
          <div className="max-h-40 overflow-y-auto space-y-1.5 no-scrollbar">
            {loading ? (
              <div className="text-center py-4">
                <span className="text-sm text-muted-foreground font-thai">กำลังโหลด...</span>
              </div>
            ) : lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => { setIsRandom(false); setSelectedLesson(lesson.id); }}
                className={cn(
                  "w-full flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-left",
                  !isRandom && selectedLesson === lesson.id
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-100 hover:border-purple-200"
                )}
              >
                <span className="text-xs font-bold text-purple-600 bg-purple-100 rounded-full px-2 py-0.5 shrink-0">
                  {["","Pre-A1","A1","A2","B1","B2"][lesson.level] || lesson.level}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{lesson.title}</p>
                  <p className="text-[10px] text-muted-foreground font-thai truncate">{lesson.title_thai}</p>
                </div>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-muted-foreground font-thai text-center">
            ⏰ เพื่อนมีเวลา 24 ชม. ในการตอบรับ
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1 font-thai">
            ยกเลิก
          </Button>
          <Button
            onClick={handleSend}
            disabled={sending || (!isRandom && !selectedLesson)}
            className="flex-1 font-thai bg-gradient-to-r from-purple-600 to-pink-500 text-white"
          >
            {sending ? "กำลังส่ง..." : "ส่งคำท้า ⚔️"}
          </Button>
        </div>
      </div>
    </div>
  );
}
