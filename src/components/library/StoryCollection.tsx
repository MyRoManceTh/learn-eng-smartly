import { useMemo, useState } from "react";
import { Story, StoryTheme, storyCollection, themeMeta } from "@/data/storyCollection";
import { useStoryProgress } from "@/hooks/useStoryProgress";
import StoryCard from "./StoryCard";
import { Sparkles, BookMarked } from "lucide-react";

interface Props {
  onOpen: (story: Story) => void;
}

const themeOrder: StoryTheme[] = ["adventure", "mystery", "heart", "funny", "wisdom"];

export const StoryCollection = ({ onOpen }: Props) => {
  const [activeTheme, setActiveTheme] = useState<StoryTheme | "all">("all");
  const { getStoryProgress } = useStoryProgress();

  const filtered = useMemo(() => {
    if (activeTheme === "all") return storyCollection;
    return storyCollection.filter((s) => s.theme === activeTheme);
  }, [activeTheme]);

  const stats = useMemo(() => {
    let collected = 0;
    storyCollection.forEach((s) => {
      const p = getStoryProgress(s.id, s.chapters.length);
      if (p.completed) collected++;
    });
    return { collected, total: storyCollection.length };
  }, [getStoryProgress]);

  return (
    <div className="space-y-4">
      {/* Collection header */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-xl shadow-purple-500/30 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 text-9xl opacity-10 rotate-12">📖</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <BookMarked className="w-5 h-5" />
            <h2 className="font-thai font-bold text-lg">คอลเลกชั่นนิทาน</h2>
          </div>
          <p className="font-thai text-sm text-white/90">
            สะสมนิทานจากทั่วทุกธีม อ่านครบทุกบทเพื่อปลดล็อค
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-300 to-yellow-200 rounded-full transition-all duration-500"
                style={{ width: `${(stats.collected / stats.total) * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold tabular-nums whitespace-nowrap">
              <Sparkles className="inline w-4 h-4 mr-0.5" />
              {stats.collected}/{stats.total}
            </span>
          </div>
        </div>
      </div>

      {/* Theme filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button
          onClick={() => setActiveTheme("all")}
          className={`shrink-0 px-4 py-2 rounded-full font-thai text-sm font-bold transition-all border-2 ${
            activeTheme === "all"
              ? "bg-foreground text-background border-foreground shadow-md scale-105"
              : "bg-white text-foreground/70 border-white/80 hover:border-foreground/30"
          }`}
        >
          ✨ ทั้งหมด
        </button>
        {themeOrder.map((t) => {
          const meta = themeMeta[t];
          const active = activeTheme === t;
          return (
            <button
              key={t}
              onClick={() => setActiveTheme(t)}
              className={`shrink-0 px-4 py-2 rounded-full font-thai text-sm font-bold transition-all border-2 ${
                active
                  ? `text-white border-transparent shadow-md scale-105 bg-gradient-to-r ${meta.color}`
                  : "bg-white text-foreground/70 border-white/80 hover:border-foreground/30"
              }`}
            >
              {meta.emoji} {meta.th}
            </button>
          );
        })}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((story) => (
          <StoryCard key={story.id} story={story} onOpen={onOpen} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground font-thai py-8">
          ยังไม่มีนิทานในธีมนี้
        </p>
      )}
    </div>
  );
};

export default StoryCollection;
