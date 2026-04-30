import { Story, themeMeta, rarityMeta } from "@/data/storyCollection";
import { useStoryProgress } from "@/hooks/useStoryProgress";
import { Check, Sparkles } from "lucide-react";

interface Props {
  story: Story;
  onOpen: (story: Story) => void;
}

export const StoryCard = ({ story, onOpen }: Props) => {
  const { getStoryProgress } = useStoryProgress();
  const p = getStoryProgress(story.id, story.chapters.length);
  const theme = themeMeta[story.theme];
  const rarity = rarityMeta[story.rarity];

  return (
    <button
      onClick={() => onOpen(story)}
      className={`group relative text-left w-full rounded-2xl overflow-hidden border-2 ${rarity.bg} shadow-lg ${rarity.glow} hover:scale-[1.02] hover:-rotate-[0.4deg] transition-all duration-300`}
    >
      {/* Cover */}
      <div className={`relative aspect-[3/4] bg-gradient-to-br ${story.cover.gradient} overflow-hidden`}>
        {/* book spine effect */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />

        {/* Big emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
            {story.cover.emoji}
          </span>
        </div>

        {/* Rarity sparkle for legendary/epic */}
        {(story.rarity === "legendary" || story.rarity === "epic") && (
          <Sparkles className="absolute top-2 right-2 w-5 h-5 text-white/90 drop-shadow animate-pulse" />
        )}

        {/* Theme badge */}
        <div className={`absolute top-2 left-3 text-[10px] px-2 py-0.5 rounded-full bg-white/85 backdrop-blur font-thai font-bold text-foreground/80`}>
          {theme.emoji} {theme.th}
        </div>

        {/* Completed stamp */}
        {p.completed && (
          <div className="absolute bottom-2 right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-lg">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
        )}

        {/* Bottom title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <h3 className="text-white font-bold text-sm leading-tight drop-shadow">{story.title}</h3>
          <p className="text-white/85 font-thai text-[11px] leading-tight mt-0.5 drop-shadow">{story.titleThai}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-white/90 backdrop-blur">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className={`text-[10px] font-bold ${rarity.color} font-thai`}>
            ◆ {rarity.th}
          </span>
          <span className="text-[10px] text-muted-foreground font-thai">
            {p.done}/{p.total} บท
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${theme.color} transition-all duration-500`}
            style={{ width: `${p.percent}%` }}
          />
        </div>
      </div>
    </button>
  );
};

export default StoryCard;
