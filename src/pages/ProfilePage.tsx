import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Save, ArrowLeft, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  age: number | null;
  gender: string | null;
  education_level: string | null;
  school_name: string | null;
  current_level: number;
  lessons_completed: number;
}

interface LearningRecord {
  id: string;
  lesson_title: string;
  lesson_level: number;
  quiz_score: number | null;
  quiz_total: number | null;
  completed_at: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, historyRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("learning_history").select("*").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(20),
      ]);
      if (profileRes.data) setProfile(profileRes.data as Profile);
      if (historyRes.data) setHistory(historyRes.data as LearningRecord[]);
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground font-thai">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen bg-background">
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
      </main>
    </div>
  );
};

export default ProfilePage;
