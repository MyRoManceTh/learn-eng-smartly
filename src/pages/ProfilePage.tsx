import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Save, ArrowLeft, History, Trophy, Star, TrendingUp, Flame, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pathNodes, levelLabels } from "@/data/pathNodes";
import LeaderboardSection from "@/components/social/LeaderboardSection";
import FriendsList from "@/components/social/FriendsList";
import { trackEvent } from "@/utils/analytics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { cn } from "@/lib/utils";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  age: number | null;
  gender: string | null;
  education_level: string | null;
  school_name: string | null;
  current_level: number;
  lessons_completed: number;
  total_exp: number;
  current_streak: number;
  longest_streak: number;
}

interface LearningRecord {
  id: string;
  lesson_title: string;
  lesson_level: number;
  quiz_score: number | null;
  quiz_total: number | null;
  completed_at: string;
}

interface PathProgress {
  node_index: number;
  quiz_score: number | null;
  quiz_total: number | null;
  completed_at: string;
}

const levelColorValues: Record<number, string> = {
  1: "hsl(25, 65%, 45%)",
  2: "hsl(160, 50%, 42%)",
  3: "hsl(220, 65%, 52%)",
  4: "hsl(275, 55%, 52%)",
  5: "hsl(340, 65%, 50%)",
};

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<LearningRecord[]>([]);
  const [pathProgress, setPathProgress] = useState<PathProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { trackEvent('page_view', { page: 'profile' }); }, []);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, historyRes, pathRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("learning_history").select("*").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(20),
        supabase.from("path_progress").select("*").eq("user_id", user.id).order("completed_at", { ascending: true }),
      ]);
      if (profileRes.data) setProfile(profileRes.data as Profile);
      if (historyRes.data) setHistory(historyRes.data as LearningRecord[]);
      if (pathRes.data) setPathProgress(pathRes.data as PathProgress[]);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const saveProfile = async () => {
    if (!user || !profile) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: profile.display_name,
        age: profile.age,
        gender: profile.gender,
        education_level: profile.education_level,
        school_name: profile.school_name,
      })
      .eq("user_id", user.id);
    if (error) toast.error("บันทึกไม่สำเร็จ");
    else toast.success("บันทึกโปรไฟล์แล้ว!");
  };

  // Compute chart data
  const levelProgressData = [1, 2, 3, 4, 5].map((lvl) => {
    const nodesInLevel = pathNodes.filter((n) => n.level === lvl);
    const completed = nodesInLevel.filter((n) =>
      pathProgress.some((p) => p.node_index === n.index)
    ).length;
    return {
      name: `Lv.${lvl}`,
      label: levelLabels[lvl],
      completed,
      total: nodesInLevel.length,
      percent: Math.round((completed / nodesInLevel.length) * 100),
    };
  });

  const totalCompleted = pathProgress.length;
  const totalNodes = pathNodes.length;
  const overallPercent = Math.round((totalCompleted / totalNodes) * 100);

  const avgScore = pathProgress.length > 0
    ? (pathProgress.reduce((sum, p) => sum + (p.quiz_score || 0), 0) /
       pathProgress.reduce((sum, p) => sum + (p.quiz_total || 4), 0) * 100)
    : 0;

  const pieData = [
    { name: "เสร็จแล้ว", value: totalCompleted },
    { name: "ยังไม่เสร็จ", value: totalNodes - totalCompleted },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground font-thai">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <h1 className="text-lg font-bold font-thai flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> โปรไฟล์ของฉัน
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Stats overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center animate-fade-in">
            <Flame className="w-6 h-6 text-destructive mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{(profile as any)?.current_streak || 0}</p>
            <p className="text-xs text-muted-foreground font-thai">วันติดต่อกัน</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center animate-fade-in" style={{ animationDelay: "50ms" }}>
            <Trophy className="w-6 h-6 text-star-gold mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{(profile as any)?.longest_streak || 0}</p>
            <p className="text-xs text-muted-foreground font-thai">สถิติสูงสุด</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Zap className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{(profile as any)?.total_exp || 0}</p>
            <p className="text-xs text-muted-foreground font-thai">EXP สะสม</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center animate-fade-in" style={{ animationDelay: "150ms" }}>
            <Star className="w-6 h-6 text-star-gold mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{Math.round(avgScore)}%</p>
            <p className="text-xs text-muted-foreground font-thai">คะแนนเฉลี่ย</p>
          </div>
        </div>

        {/* Progress charts */}
        <div className="rounded-lg border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <h2 className="font-semibold font-thai text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> ความก้าวหน้าตามระดับ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bar chart */}
            <div className="md:col-span-2 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelProgressData} barSize={32}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg bg-popover border border-border p-2 shadow-lg text-sm font-thai">
                          <p className="font-bold">{d.name} {d.label}</p>
                          <p>สำเร็จ: {d.completed}/{d.total} ({d.percent}%)</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                    {levelProgressData.map((_, i) => (
                      <Cell key={i} fill={levelColorValues[i + 1]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="flex flex-col items-center justify-center">
              <div className="h-36 w-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell fill="hsl(25, 65%, 45%)" />
                      <Cell fill="hsl(0, 0%, 88%)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm font-thai text-muted-foreground mt-1">
                {totalCompleted}/{totalNodes} บทเรียน
              </p>
            </div>
          </div>

          {/* Level progress bars */}
          <div className="mt-6 space-y-2">
            {levelProgressData.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold w-10 font-thai" style={{ color: levelColorValues[i + 1] }}>
                  {d.name}
                </span>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${d.percent}%`,
                      backgroundColor: levelColorValues[i + 1],
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-14 text-right font-thai">
                  {d.completed}/{d.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Profile form */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold font-thai text-lg">ข้อมูลส่วนตัว</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-thai">ชื่อที่แสดง</Label>
              <Input value={profile?.display_name || ""} onChange={(e) => setProfile((p) => p && { ...p, display_name: e.target.value })} />
            </div>
            <div>
              <Label className="font-thai">อายุ</Label>
              <Input type="number" value={profile?.age || ""} onChange={(e) => setProfile((p) => p && { ...p, age: parseInt(e.target.value) || null })} />
            </div>
            <div>
              <Label className="font-thai">เพศ</Label>
              <Select value={profile?.gender || ""} onValueChange={(v) => setProfile((p) => p && { ...p, gender: v })}>
                <SelectTrigger><SelectValue placeholder="เลือกเพศ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">ชาย</SelectItem>
                  <SelectItem value="female">หญิง</SelectItem>
                  <SelectItem value="other">อื่นๆ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-thai">ระดับการศึกษา</Label>
              <Select value={profile?.education_level || ""} onValueChange={(v) => setProfile((p) => p && { ...p, education_level: v })}>
                <SelectTrigger><SelectValue placeholder="เลือกระดับ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">ประถมศึกษา</SelectItem>
                  <SelectItem value="secondary">มัธยมศึกษา</SelectItem>
                  <SelectItem value="vocational">อาชีวศึกษา</SelectItem>
                  <SelectItem value="bachelor">ปริญญาตรี</SelectItem>
                  <SelectItem value="master">ปริญญาโท</SelectItem>
                  <SelectItem value="doctorate">ปริญญาเอก</SelectItem>
                  <SelectItem value="other">อื่นๆ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label className="font-thai">โรงเรียน/สถานศึกษา</Label>
              <Input value={profile?.school_name || ""} onChange={(e) => setProfile((p) => p && { ...p, school_name: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={saveProfile} className="font-thai">
              <Save className="w-4 h-4 mr-2" /> บันทึก
            </Button>
            <span className="text-sm text-muted-foreground font-thai">
              ระดับ: {profile?.current_level} | เรียนแล้ว: {profile?.lessons_completed} บท
            </span>
          </div>
        </div>

        {/* Learning history */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-semibold font-thai text-lg mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> ประวัติการเรียนรู้
          </h2>
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm font-thai">ยังไม่มีประวัติการเรียน</p>
          ) : (
            <div className="space-y-2">
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="font-reading text-sm font-semibold text-english">{h.lesson_title}</p>
                    <p className="text-xs text-muted-foreground font-thai">
                      Level {h.lesson_level} • {new Date(h.completed_at).toLocaleDateString("th-TH")}
                    </p>
                  </div>
                  {h.quiz_score !== null && (
                    <span className="text-sm font-semibold text-primary">
                      {h.quiz_score}/{h.quiz_total}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Social & Premium Features */}
        <div className="space-y-4 mt-6">
          {/* Leaderboard */}
          <LeaderboardSection />

          {/* Friends */}
          <FriendsList />

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="font-thai h-14 text-sm"
              onClick={() => navigate("/season-pass")}
            >
              🏆 Season Pass
            </Button>
            <Button
              variant="outline"
              className="font-thai h-14 text-sm"
              onClick={() => navigate("/parent-report")}
            >
              📊 รายงานผู้ปกครอง
            </Button>
            <Button
              variant="outline"
              className="font-thai h-14 text-sm col-span-2"
              onClick={() => navigate("/premium")}
            >
              ⭐ สมาชิกพรีเมียม
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
