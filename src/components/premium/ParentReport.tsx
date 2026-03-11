import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Share2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const levelNames = ["เริ่มต้น", "มือใหม่", "กลาง", "ก้าวหน้า", "เก่งมาก"];

const ParentReport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [daysLearning, setDaysLearning] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);

  // คำนวณจำนวนวันที่เรียน
  useEffect(() => {
    if (!user) return;
    const calcStats = async () => {
      // คำนวณจำนวนวันจาก created_at ถึงปัจจุบัน
      const { data: profileData } = await supabase
        .from("profiles")
        .select("created_at, lessons_completed")
        .eq("user_id", user.id)
        .single();

      if (profileData?.created_at) {
        const created = new Date(profileData.created_at);
        const now = new Date();
        const diffDays = Math.max(1, Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
        setDaysLearning(diffDays);
        setTotalLessons(profileData.lessons_completed || 0);
      }

      // คำนวณคะแนนเฉลี่ยจาก quiz_results
      const { data: quizData } = await supabase
        .from("learning_history" as any)
        .select("quiz_score")
        .eq("user_id", user.id);

      if (quizData && quizData.length > 0) {
        const total = quizData.reduce((sum: number, q: any) => sum + (q.score || 0), 0);
        setAvgScore(Math.round(total / quizData.length));
      } else {
        setAvgScore(0);
      }
    };
    calcStats();
  }, [user]);

  const handleShare = async () => {
    setSharing(true);

    const reportText = [
      `📊 รายงานพัฒนาการ - น้อง${profile?.display_name || "นักเรียน"}`,
      ``,
      `📅 เรียนมาแล้ว ${daysLearning} วัน`,
      `📖 บทเรียนที่เรียน: ${totalLessons} บท`,
      `📝 คะแนนเฉลี่ย: ${avgScore}%`,
      `🔥 Streak สูงสุด: ${profile?.longest_streak || 0} วัน`,
      `✨ EXP ทั้งหมด: ${profile?.total_exp || 0}`,
      `🎯 ภารกิจสำเร็จ: ${profile?.total_missions_completed || 0}`,
      `📈 ระดับ: ${profile?.current_level || 1}/5 (${levelNames[(profile?.current_level || 1) - 1]})`,
      ``,
      `ลูกของคุณกำลังพัฒนาทักษะภาษาอังกฤษอย่างต่อเนื่อง! 🌟`,
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "รายงานพัฒนาการการเรียนภาษาอังกฤษ",
          text: reportText,
        });
      } else {
        await navigator.clipboard.writeText(reportText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      // User cancelled share
      console.log("Share cancelled:", err);
    } finally {
      setSharing(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = profile?.display_name || "นักเรียน";
  const level = profile?.current_level || 1;
  const levelProgress = ((profile?.total_exp || 0) % 500) / 5; // สมมุติ 500 exp ต่อเลเวล

  const statsGrid = [
    {
      label: "บทเรียนที่เรียน",
      value: `${totalLessons}`,
      unit: "บท",
      icon: "📖",
      color: "text-blue-400",
    },
    {
      label: "คะแนนเฉลี่ย",
      value: `${avgScore}`,
      unit: "%",
      icon: "📝",
      color: "text-emerald-400",
    },
    {
      label: "Streak สูงสุด",
      value: `${profile?.longest_streak || 0}`,
      unit: "วัน",
      icon: "🔥",
      color: "text-orange-400",
    },
    {
      label: "EXP ทั้งหมด",
      value: `${(profile?.total_exp || 0).toLocaleString()}`,
      unit: "",
      icon: "✨",
      color: "text-purple-400",
    },
    {
      label: "ภารกิจสำเร็จ",
      value: `${profile?.total_missions_completed || 0}`,
      unit: "",
      icon: "🎯",
      color: "text-pink-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-950/20 via-background to-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">{"📊 "}รายงานพัฒนาการ</h1>
        </div>
      </div>

      {/* Report Card */}
      <div className="mx-4 mt-6 rounded-3xl bg-card border border-border/50 overflow-hidden shadow-xl">
        {/* Card Header */}
        <div className="bg-gradient-to-br from-sky-500/20 via-blue-500/10 to-indigo-500/20 p-6 text-center border-b border-border/30">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-3xl shadow-lg shadow-sky-500/20">
            {"🧒"}
          </div>
          <h2 className="text-xl font-bold mt-3">
            {"น้อง"}{displayName}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {"📅 เรียนมาแล้ว "}{daysLearning}{" วัน"}
          </p>

          {/* Level Badge */}
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-sm font-semibold">
              {"ระดับ "}{level}{"/5"}
            </span>
            <span className="text-xs text-muted-foreground">
              {"("}{levelNames[level - 1] || "เริ่มต้น"}{")"}
            </span>
          </div>
        </div>

        {/* Level Progress */}
        <div className="px-6 py-4 border-b border-border/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>ความก้าวหน้าเลเวล</span>
            <span>{Math.round(levelProgress)}%</span>
          </div>
          <Progress value={levelProgress} className="h-2.5 [&>div]:bg-sky-500" />
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
            <span>Lv.{level}</span>
            <span>Lv.{Math.min(level + 1, 5)}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 px-2">
            สถิติการเรียนรู้
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {statsGrid.map((stat) => (
              <div
                key={stat.label}
                className="p-3 rounded-xl bg-muted/30 border border-border/30 text-center"
              >
                <span className="text-xl">{stat.icon}</span>
                <p className={cn("text-xl font-bold mt-1", stat.color)}>
                  {stat.value}
                  {stat.unit && (
                    <span className="text-xs font-normal text-muted-foreground ml-0.5">
                      {stat.unit}
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Encouraging Message */}
        <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
          <p className="text-sm text-center leading-relaxed">
            {"🌟 "}ลูกของคุณกำลังพัฒนาทักษะภาษาอังกฤษอย่างต่อเนื่อง!
          </p>
          <p className="text-xs text-center text-muted-foreground mt-1">
            การเรียนรู้ทุกวันจะช่วยสร้างพื้นฐานที่แข็งแกร่ง
          </p>
        </div>
      </div>

      {/* Share Button */}
      <div className="mx-4 mt-6">
        <Button
          className="w-full h-12 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold"
          onClick={handleShare}
          disabled={sharing}
        >
          {sharing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Share2 className="w-4 h-4 mr-2" />
          )}
          {copied ? "คัดลอกแล้ว!" : "📤 แชร์ให้ผู้ปกครอง"}
        </Button>
      </div>

      {/* Premium Upsell */}
      {!profile?.is_premium && (
        <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 text-center">
          <p className="text-sm font-semibold">
            {"⭐ "}อัพเกรดเป็นพรีเมียม
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            เพื่อรับรายงานพัฒนาการส่งให้ผู้ปกครองทุกสัปดาห์
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            onClick={() => navigate("/premium")}
          >
            ดูรายละเอียด
          </Button>
        </div>
      )}
    </div>
  );
};

export default ParentReport;
