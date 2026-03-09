import { useState, useEffect } from "react";
import { aesopFables, FableEntry } from "@/data/aesopFables";
import { LearnerLevel } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface FableLibraryProps {
  currentLevel: LearnerLevel;
  onSelectFable: (entry: FableEntry) => void;
}

const levelLabels: Record<number, { en: string; th: string; color: string }> = {
  1: { en: "Beginner", th: "เริ่มต้น", color: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
  2: { en: "Elementary", th: "พื้นฐาน", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  3: { en: "Intermediate", th: "กลาง", color: "bg-amber-500/10 text-amber-700 border-amber-200" },
  4: { en: "Upper-Int", th: "กลาง-สูง", color: "bg-orange-500/10 text-orange-700 border-orange-200" },
  5: { en: "Advanced", th: "สูง", color: "bg-red-500/10 text-red-700 border-red-200" },
};

const FableLibrary = ({ currentLevel, onSelectFable }: FableLibraryProps) => {
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [fableImages, setFableImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const filtered = filterLevel
    ? aesopFables.filter((f) => f.lesson.level === filterLevel)
    : aesopFables;

  // Load existing images on mount
  useEffect(() => {
    const loadExistingImages = async () => {
      const images: Record<string, string> = {};
      for (const fable of aesopFables) {
        const fileName = `fable-${fable.lesson.id}.png`;
        const { data } = supabase.storage.from("lesson-images").getPublicUrl(fileName);
        // Check if file exists by trying to fetch head
        try {
          const resp = await fetch(data.publicUrl, { method: "HEAD" });
          if (resp.ok) {
            images[fable.lesson.id] = data.publicUrl;
          }
        } catch {
          // Image doesn't exist yet
        }
      }
      setFableImages(images);
    };
    loadExistingImages();
  }, []);

  const generateImage = async (fableId: string, imagePrompt: string) => {
    setLoadingImages((prev) => new Set(prev).add(fableId));
    try {
      const { data, error } = await supabase.functions.invoke("generate-fable-image", {
        body: { fableId, imagePrompt },
      });
      if (error) throw error;
      if (data?.imageUrl) {
        setFableImages((prev) => ({ ...prev, [fableId]: data.imageUrl }));
      }
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setLoadingImages((prev) => {
        const next = new Set(prev);
        next.delete(fableId);
        return next;
      });
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold font-thai">📚 คลังนิทานอีสป</h3>
      </div>

      {/* Level filter */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        <Button
          size="sm"
          variant={filterLevel === null ? "default" : "outline"}
          className="text-xs font-thai"
          onClick={() => setFilterLevel(null)}
        >
          ทั้งหมด
        </Button>
        {[1, 2, 3, 4, 5].map((lvl) => (
          <Button
            key={lvl}
            size="sm"
            variant={filterLevel === lvl ? "default" : "outline"}
            className="text-xs font-thai"
            onClick={() => setFilterLevel(lvl)}
          >
            Lv.{lvl} {levelLabels[lvl].th}
          </Button>
        ))}
      </div>

      {/* Fable cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((entry) => {
          const info = levelLabels[entry.lesson.level];
          const imageUrl = fableImages[entry.lesson.id];
          const isLoading = loadingImages.has(entry.lesson.id);

          return (
            <button
              key={entry.lesson.id}
              onClick={() => onSelectFable(entry)}
              className="text-left rounded-xl border border-border bg-background overflow-hidden hover:border-primary/50 hover:shadow-md transition-all group"
            >
              {/* Image area */}
              <div className="relative w-full aspect-[16/9] bg-muted/50 overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={entry.lesson.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Skeleton className="w-12 h-12 rounded-full mx-auto" />
                      <p className="text-xs text-muted-foreground font-thai">กำลังสร้างรูป...</p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      generateImage(entry.lesson.id, entry.lesson.imagePrompt);
                    }}
                  >
                    <div className="text-center space-y-1.5">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                      <p className="text-[11px] text-muted-foreground font-thai">กดเพื่อสร้างรูป 🎨</p>
                    </div>
                  </div>
                )}
                {/* Level badge overlay */}
                <span className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full border backdrop-blur-sm ${info.color}`}>
                  Lv.{entry.lesson.level}
                </span>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground leading-snug">
                      {entry.lesson.title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-thai mt-0.5">
                      {entry.lesson.titleThai}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 font-thai">
                      📝 {entry.lesson.vocabulary.length} คำ · {entry.quiz.length} ข้อ
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-6 font-thai">
          ยังไม่มีนิทานในระดับนี้
        </p>
      )}

      {/* Generate all button */}
      <div className="mt-4 text-center">
        <Button
          variant="outline"
          size="sm"
          className="font-thai text-xs"
          onClick={async () => {
            for (const fable of filtered) {
              if (!fableImages[fable.lesson.id] && !loadingImages.has(fable.lesson.id)) {
                await generateImage(fable.lesson.id, fable.lesson.imagePrompt);
              }
            }
          }}
        >
          🎨 สร้างรูปทั้งหมด
        </Button>
      </div>
    </div>
  );
};

export default FableLibrary;
