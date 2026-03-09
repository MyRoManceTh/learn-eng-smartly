import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const activities = [
  { path: "/path", icon: "🗺️", title: "เส้นทางการเรียน", subtitle: "เรียนตามลำดับ ปลดล็อคทีละด่าน", color: "from-emerald-400 to-green-500", badge: "Lv.1-5" },
  { path: "/reading", icon: "📖", title: "ฝึกอ่าน", subtitle: "เรื่องสนุกๆ แยกหมวด พร้อมรูปภาพ", color: "from-blue-400 to-indigo-500", badge: "ใหม่" },
  { path: "/conversation", icon: "💬", title: "ฝึกบทสนทนา", subtitle: "จำลองสถานการณ์จริง สั่งกาแฟ เช็คอิน", color: "from-pink-400 to-rose-500", badge: "ใหม่" },
  { path: "/pronunciation", icon: "🗣️", title: "ฝึกออกเสียง", subtitle: "เน้นเสียงที่คนไทยออกยาก R/L, TH, V/W", color: "from-orange-400 to-amber-500", badge: null },
  { path: "/news", icon: "📰", title: "ข่าวง่ายรายวัน", subtitle: "อ่านข่าวจริง เขียนใหม่ให้เข้าใจง่าย", color: "from-purple-400 to-violet-500", badge: "Daily" },
  { path: "/library", icon: "📚", title: "คลังนิทาน", subtitle: "นิทานอีสปสนุกๆ พร้อม quiz", color: "from-teal-400 to-cyan-500", badge: null },
];

const PracticePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-indigo-50 to-purple-100 pb-24">
      <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold font-thai">
            📚 เรียน<span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">รู้</span>
          </h1>
          <p className="text-xs text-muted-foreground font-thai mt-0.5">เลือกกิจกรรมที่อยากฝึกได้เลย</p>
        </div>
      </header>

      <main className="px-4 py-5">
        <div className="grid grid-cols-1 gap-3">
          {activities.map((act) => (
            <button
              key={act.path}
              onClick={() => navigate(act.path)}
              className="group relative w-full text-left rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur-sm p-4 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] overflow-hidden"
            >
              {/* Gradient accent on the left */}
              <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b", act.color)} />

              <div className="flex items-center gap-4 pl-3">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md bg-gradient-to-br", act.color)}>
                  <span className="drop-shadow-sm">{act.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold font-thai text-foreground text-base">{act.title}</h3>
                    {act.badge && (
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full text-white",
                        act.badge === "ใหม่" ? "bg-gradient-to-r from-pink-500 to-rose-500" :
                        act.badge === "Daily" ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                        "bg-gradient-to-r from-purple-500 to-indigo-500"
                      )}>
                        {act.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-thai mt-0.5 truncate">{act.subtitle}</p>
                </div>
                <div className="text-muted-foreground group-hover:translate-x-1 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PracticePage;
