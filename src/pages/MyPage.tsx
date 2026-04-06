import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { EquippedItems, DEFAULT_EQUIPPED, AvatarItem } from "@/types/avatar";
import { RoomLayout, DEFAULT_ROOM } from "@/types/room";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useDailyMissions } from "@/hooks/useDailyMissions";
import { useProfile } from "@/hooks/useProfile";
import { getEvolutionStage, getEvolutionProgress } from "@/data/evolutionStages";
import { trackEvent } from "@/utils/analytics";
import { pathNodes } from "@/data/pathNodes";
import { getCefrLabel } from "@/data/evolutionStages";
import { roomItems, getRoomItem, WALLPAPER_COLORS, FLOOR_COLORS } from "@/data/roomItems";
import { getItemById } from "@/data/avatarItems";

// Components
import PixelRoom from "@/components/room/PixelRoom";
import PetShop from "@/components/room/PetShop";
import SpriteAvatar from "@/components/avatar/SpriteAvatar";
import CoinDisplay from "@/components/avatar/CoinDisplay";
import EvolutionProgressBar from "@/components/avatar/EvolutionProgressBar";
import ShopSection from "@/components/avatar/ShopSection";
import InventorySection from "@/components/avatar/InventorySection";
import GachaSpinner from "@/components/gacha/GachaSpinner";
import LeaderboardSection from "@/components/social/LeaderboardSection";
import FriendsList from "@/components/social/FriendsList";

// Regular shadcn UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Settings, Flame, Trophy, Zap, Star, TrendingUp, History } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { cn } from "@/lib/utils";

const levelColorValues: Record<number, string> = {
  1: "hsl(152, 76%, 44%)",
  2: "hsl(199, 89%, 48%)",
  3: "hsl(262, 83%, 58%)",
  4: "hsl(330, 85%, 60%)",
  5: "hsl(25, 95%, 53%)",
};

interface ProfileData {
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

const RARITY_COLORS: Record<string, string> = {
  common: "#9E9E9E",
  rare: "#2196F3",
  epic: "#9C27B0",
  legendary: "#FFD700",
};

const ROOM_CATEGORIES = [
  { key: "wallpaper", label: "ผนัง", icon: "🧱" },
  { key: "floor", label: "พื้น", icon: "🪵" },
  { key: "desk", label: "โต๊ะ", icon: "🪑" },
  { key: "bed", label: "เตียง", icon: "🛏️" },
  { key: "shelf", label: "ชั้น", icon: "📚" },
  { key: "poster", label: "โปสเตอร์", icon: "🖼️" },
  { key: "window", label: "หน้าต่าง", icon: "🪟" },
  { key: "plant", label: "ต้นไม้", icon: "🌵" },
  { key: "trophy", label: "ถ้วยรางวัล", icon: "🏆" },
  { key: "pet", label: "สัตว์เลี้ยง", icon: "🐱" },
  { key: "toy", label: "ของเล่น", icon: "🎮" },
];

const MyPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { incrementMission } = useDailyMissions();
  const { profile, refreshProfile } = useProfile();

  // Avatar state
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [equipped, setEquipped] = useState<EquippedItems>(DEFAULT_EQUIPPED);

  // Room state
  const [room, setRoom] = useState<RoomLayout>(DEFAULT_ROOM);
  const [roomInventory, setRoomInventory] = useState<string[]>([]);
  const [selectedRoomCategory, setSelectedRoomCategory] = useState("wallpaper");

  // Profile state
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [history, setHistory] = useState<LearningRecord[]>([]);
  const [pathProgress, setPathProgress] = useState<PathProgress[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }

    const fetchAll = async () => {
      const [profileRes, historyRes, pathRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("learning_history").select("*").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(20),
        supabase.from("path_progress").select("*").eq("user_id", user.id).order("completed_at", { ascending: true }),
      ]);

      if (profileRes.data) {
        const d = profileRes.data as any;
        setProfileData(d as ProfileData);
        setCoins(d.coins || 0);
        const inv = d.inventory;
        setInventory(Array.isArray(inv) ? inv : []);
        const eq = d.equipped;
        if (eq && typeof eq === "object" && !Array.isArray(eq)) {
          setEquipped({ ...DEFAULT_EQUIPPED, ...eq });
        }
        // Room data
        const rm = d.room;
        if (rm && typeof rm === "object" && !Array.isArray(rm)) {
          setRoom({ ...DEFAULT_ROOM, ...rm });
        }
        const rmInv = d.room_inventory;
        setRoomInventory(Array.isArray(rmInv) ? rmInv : []);
      }
      if (historyRes.data) setHistory(historyRes.data as LearningRecord[]);
      if (pathRes.data) setPathProgress(pathRes.data as PathProgress[]);
      setLoading(false);
    };

    fetchAll();
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      incrementMission("visit_avatar", 1);
      trackEvent("page_view", { page: "my" });
    }
  }, [user]);

  // === Avatar handlers ===
  const handleBuy = async (item: AvatarItem) => {
    if (!user) return;
    if (coins < item.price) {
      toast.error("เหรียญไม่พอ! 🪙 ไปทำแบบทดสอบเพิ่มนะ");
      return;
    }
    const newCoins = coins - item.price;
    const newInventory = [...inventory, item.id];
    const { error } = await supabase
      .from("profiles")
      .update({ coins: newCoins, inventory: newInventory as any } as any)
      .eq("user_id", user.id);
    if (error) { toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง"); return; }
    setCoins(newCoins);
    setInventory(newInventory);
    toast.success(`ซื้อ ${item.nameThai} สำเร็จ! 🎉`);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    handleEquip(item, newInventory);
  };

  const handleEquip = async (item: AvatarItem, _inv?: string[]) => {
    if (!user) return;
    const newEquipped = { ...equipped, [item.category]: item.id };
    const { error } = await supabase
      .from("profiles")
      .update({ equipped: newEquipped as any } as any)
      .eq("user_id", user.id);
    if (error) { toast.error("เกิดข้อผิดพลาด"); return; }
    setEquipped(newEquipped);
  };

  const handleUnequip = async (item: AvatarItem) => {
    if (!user) return;
    const defaults: Record<string, string | null> = {
      skin: "skin_default", hair: "hair_default", hairColor: "haircolor_midnight",
      hat: null, shirt: "shirt_default", pants: "pants_default",
      shoes: "shoes_default", necklace: null, leftHand: null, rightHand: null, aura: null,
    };
    const newEquipped = { ...equipped, [item.category]: defaults[item.category] };
    const { error } = await supabase
      .from("profiles")
      .update({ equipped: newEquipped as any } as any)
      .eq("user_id", user.id);
    if (error) { toast.error("เกิดข้อผิดพลาด"); return; }
    setEquipped(newEquipped);
  };

  // === Room handlers ===
  const handleBuyRoomItem = async (item: typeof roomItems[0]) => {
    if (!user) return;
    if (coins < item.price) {
      toast.error("เหรียญไม่พอ! 🪙");
      return;
    }
    const newCoins = coins - item.price;
    const newRoomInv = [...roomInventory, item.id];
    const { error } = await supabase
      .from("profiles")
      .update({ coins: newCoins, room_inventory: newRoomInv as any } as any)
      .eq("user_id", user.id);
    if (error) { toast.error("เกิดข้อผิดพลาด"); return; }
    setCoins(newCoins);
    setRoomInventory(newRoomInv);
    toast.success(`ซื้อ ${item.nameThai} สำเร็จ! 🏠`);
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    handlePlaceRoomItem(item);
  };

  const handlePlaceRoomItem = async (item: typeof roomItems[0]) => {
    if (!user) return;
    let newRoom: RoomLayout;
    if (item.category === "wallpaper") {
      newRoom = { ...room, wallpaper: item.id };
    } else if (item.category === "floor") {
      newRoom = { ...room, floor: item.id };
    } else {
      // Replace item of same category or add
      const filtered = room.items.filter((id) => {
        const existing = getRoomItem(id);
        return existing && existing.category !== item.category;
      });
      newRoom = { ...room, items: [...filtered, item.id] };
    }
    const { error } = await supabase
      .from("profiles")
      .update({ room: newRoom as any } as any)
      .eq("user_id", user.id);
    if (error) { toast.error("เกิดข้อผิดพลาด"); return; }
    setRoom(newRoom);
  };

  const handleRemoveRoomItem = async (itemId: string) => {
    if (!user) return;
    const item = getRoomItem(itemId);
    if (!item) return;
    let newRoom: RoomLayout;
    if (item.category === "wallpaper") {
      newRoom = { ...room, wallpaper: "wall_basic" };
    } else if (item.category === "floor") {
      newRoom = { ...room, floor: "floor_wood" };
    } else {
      newRoom = { ...room, items: room.items.filter((id) => id !== itemId) };
    }
    const { error } = await supabase
      .from("profiles")
      .update({ room: newRoom as any } as any)
      .eq("user_id", user.id);
    if (error) { toast.error("เกิดข้อผิดพลาด"); return; }
    setRoom(newRoom);
  };

  // === Profile save ===
  const saveProfile = async () => {
    if (!user || !profileData) return;
    const { error } = await supabase.from("profiles").update({
      display_name: profileData.display_name,
      age: profileData.age,
      gender: profileData.gender,
      education_level: profileData.education_level,
      school_name: profileData.school_name,
    }).eq("user_id", user.id);
    if (error) toast.error("บันทึกไม่สำเร็จ");
    else toast.success("บันทึกโปรไฟล์แล้ว! ✅");
  };

  // === Computed data ===
  const evolutionStage = getEvolutionStage(profile?.total_exp || 0);

  const levelProgressData = [1, 2, 3, 4, 5].map((lvl) => {
    const nodesInLevel = pathNodes.filter((n) => n.level === lvl);
    const completed = nodesInLevel.filter((n) =>
      pathProgress.some((p) => p.node_index === n.index)
    ).length;
    return {
      name: getCefrLabel(lvl),
      label: getCefrLabel(lvl),
      completed,
      total: nodesInLevel.length,
      percent: nodesInLevel.length > 0 ? Math.round((completed / nodesInLevel.length) * 100) : 0,
    };
  });

  const totalCompleted = pathProgress.length;
  const totalNodes = pathNodes.length;
  const avgScore = pathProgress.length > 0
    ? (pathProgress.reduce((sum, p) => sum + (p.quiz_score || 0), 0) /
       pathProgress.reduce((sum, p) => sum + (p.quiz_total || 4), 0) * 100)
    : 0;
  const pieData = [
    { name: "เสร็จแล้ว", value: totalCompleted },
    { name: "ยังไม่เสร็จ", value: totalNodes - totalCompleted },
  ];

  // Items available in room shop
  const roomShopItems = roomItems.filter(
    (item) => item.category === selectedRoomCategory
  );

  // Check what's currently placed
  const isRoomItemPlaced = (itemId: string) => {
    if (room.wallpaper === itemId || room.floor === itemId) return true;
    return room.items.includes(itemId);
  };

  const ownsRoomItem = (itemId: string) => {
    return roomInventory.includes(itemId) || roomItems.find((i) => i.id === itemId)?.price === 0;
  };

  // === Loading ===
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="text-6xl animate-bounce">🏠</div>
          <p className="text-lg font-bold font-thai text-foreground">กำลังโหลด...</p>
          <div className="flex gap-2 justify-center">
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-3 h-3 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-28">
      {/* === HEADER === */}
      <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-14 rounded-xl bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center overflow-hidden shadow-md border border-white/60 shrink-0">
              <div className="scale-[0.45] origin-center">
                <SpriteAvatar equipped={equipped} size="sm" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold font-thai text-foreground">
                {profileData?.display_name && !profileData.display_name.includes("@line.local")
                  ? profileData.display_name
                  : user?.user_metadata?.display_name || user?.user_metadata?.full_name || "ห้องของฉัน"}
              </h1>
              <p className="text-xs text-muted-foreground font-thai">
                {evolutionStage.nameThai} {evolutionStage.icon} · {getCefrLabel(profileData?.current_level || 1)}
              </p>
            </div>
          </div>
          <CoinDisplay coins={coins} />
        </div>
      </header>

      {/* === ROOM VIEW (8-bit area) === */}
      <div className="max-w-3xl mx-auto px-4 mt-4 mb-3">
        <PixelRoom
          equipped={equipped}
          room={room}
          evolutionStage={evolutionStage.stage}
          size="lg"
        />
      </div>

      {/* === EVOLUTION PROGRESS === */}
      <div className="max-w-3xl mx-auto px-4 mb-4">
        <EvolutionProgressBar totalExp={profile?.total_exp || 0} />
      </div>

      {/* === MAIN TABS === */}
      <div className="max-w-3xl mx-auto px-4">
        <Tabs defaultValue="character" className="w-full">
          <TabsList className="w-full mb-4 h-12 p-1 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 grid grid-cols-5">
            <TabsTrigger value="character" className="font-thai text-[10px] font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
              👤 ตัวเรา
            </TabsTrigger>
            <TabsTrigger value="room" className="font-thai text-[10px] font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
              🛋️ ห้อง
            </TabsTrigger>
            <TabsTrigger value="pets" className="font-thai text-[10px] font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
              🐾 สัตว์เลี้ยง
            </TabsTrigger>
            <TabsTrigger value="stats" className="font-thai text-[10px] font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
              📊 สถิติ
            </TabsTrigger>
            <TabsTrigger value="inventory" className="font-thai text-[10px] font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
              📦 คลัง
            </TabsTrigger>
          </TabsList>

          {/* ============ TAB 1: STATS ============ */}
          <TabsContent value="stats">
            <div className="space-y-4">
              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-orange-100 to-red-50 border border-orange-200/50 p-4 text-center shadow-sm animate-fade-in">
                  <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{profileData?.current_streak || 0}</p>
                  <p className="text-xs text-muted-foreground font-thai">วันติดต่อกัน</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-50 border border-amber-200/50 p-4 text-center shadow-sm animate-fade-in" style={{ animationDelay: "50ms" }}>
                  <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{profileData?.longest_streak || 0}</p>
                  <p className="text-xs text-muted-foreground font-thai">สถิติสูงสุด</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-50 border border-purple-200/50 p-4 text-center shadow-sm animate-fade-in" style={{ animationDelay: "100ms" }}>
                  <Zap className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{profileData?.total_exp || 0}</p>
                  <p className="text-xs text-muted-foreground font-thai">EXP สะสม</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-pink-100 to-rose-50 border border-pink-200/50 p-4 text-center shadow-sm animate-fade-in" style={{ animationDelay: "150ms" }}>
                  <Star className="w-6 h-6 text-pink-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{Math.round(avgScore)}%</p>
                  <p className="text-xs text-muted-foreground font-thai">คะแนนเฉลี่ย</p>
                </div>
              </div>

              {/* Progress chart */}
              <div className="rounded-2xl border border-white/50 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
                <h2 className="font-semibold font-thai text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> ความก้าวหน้าตามระดับ
                </h2>
                <div className="h-48">
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
                <div className="mt-4 space-y-2">
                  {levelProgressData.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-bold w-10 font-thai" style={{ color: levelColorValues[i + 1] }}>{d.name}</span>
                      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${d.percent}%`, backgroundColor: levelColorValues[i + 1] }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-14 text-right font-thai">{d.completed}/{d.total}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile form */}
              <div className="rounded-2xl border border-white/50 bg-white/80 backdrop-blur-sm p-6 shadow-lg space-y-4">
                <h2 className="font-semibold font-thai text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" /> ข้อมูลส่วนตัว
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-thai">ชื่อที่แสดง</Label>
                    <Input value={profileData?.display_name || ""} onChange={(e) => setProfileData((p) => p && { ...p, display_name: e.target.value })} />
                  </div>
                  <div>
                    <Label className="font-thai">อายุ</Label>
                    <Input type="number" value={profileData?.age || ""} onChange={(e) => setProfileData((p) => p && { ...p, age: parseInt(e.target.value) || null })} />
                  </div>
                  <div>
                    <Label className="font-thai">เพศ</Label>
                    <Select value={profileData?.gender || ""} onValueChange={(v) => setProfileData((p) => p && { ...p, gender: v })}>
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
                    <Select value={profileData?.education_level || ""} onValueChange={(v) => setProfileData((p) => p && { ...p, education_level: v })}>
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
                    <Input value={profileData?.school_name || ""} onChange={(e) => setProfileData((p) => p && { ...p, school_name: e.target.value })} />
                  </div>
                </div>
                <Button onClick={saveProfile} className="font-thai">
                  <Save className="w-4 h-4 mr-2" /> บันทึก
                </Button>
              </div>

              {/* Learning history */}
              <div className="rounded-2xl border border-white/50 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
                <h2 className="font-semibold font-thai text-lg mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-600" /> ประวัติการเรียนรู้
                </h2>
                {history.length === 0 ? (
                  <p className="text-muted-foreground text-sm font-thai">ยังไม่มีประวัติการเรียน</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {history.map((h) => (
                      <div key={h.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div>
                          <p className="font-reading text-sm font-semibold">{h.lesson_title}</p>
                          <p className="text-xs text-muted-foreground font-thai">
                            Level {h.lesson_level} • {new Date(h.completed_at).toLocaleDateString("th-TH")}
                          </p>
                        </div>
                        {h.quiz_score !== null && (
                          <span className="text-sm font-semibold text-primary">{h.quiz_score}/{h.quiz_total}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Social */}
              <LeaderboardSection />
              <FriendsList />

              {/* Quick links */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="font-thai h-14 text-sm" onClick={() => navigate("/season-pass")}>
                  🏆 Season Pass
                </Button>
                <Button variant="outline" className="font-thai h-14 text-sm" onClick={() => navigate("/parent-report")}>
                  📊 รายงานผู้ปกครอง
                </Button>
                <Button variant="outline" className="font-thai h-14 text-sm col-span-2" onClick={() => navigate("/premium")}>
                  ⭐ สมาชิกพรีเมียม
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ============ TAB 2: CHARACTER ============ */}
          <TabsContent value="character">
            <div className="space-y-4">
              {/* Avatar preview - 8-bit pixel character */}
              <div className="rounded-2xl border border-white/50 bg-gradient-to-b from-cyan-100 via-sky-50 to-white p-8 shadow-lg flex justify-center items-center">
                <SpriteAvatar
                  equipped={equipped}
                  size="lg"
                />
              </div>

              {/* Shop / Inventory / Gacha sub-tabs */}
              <Tabs defaultValue="shop">
                <TabsList className="w-full grid grid-cols-3 mb-3 h-11 bg-white/50 backdrop-blur rounded-xl">
                  <TabsTrigger value="shop" className="font-thai text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">🛒 ร้านค้า</TabsTrigger>
                  <TabsTrigger value="closet" className="font-thai text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">👔 ตู้เสื้อผ้า</TabsTrigger>
                  <TabsTrigger value="gacha" className="font-thai text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">🎰 กาชา</TabsTrigger>
                </TabsList>

                <TabsContent value="shop">
                  <ShopSection
                    coins={coins}
                    inventory={inventory}
                    equipped={equipped}
                    onBuy={handleBuy}
                    onEquip={handleEquip}
                    onUnequip={handleUnequip}
                  />
                </TabsContent>

                <TabsContent value="closet">
                  <InventorySection
                    inventory={inventory}
                    equipped={equipped}
                    coins={coins}
                    onEquip={handleEquip}
                    onUnequip={handleUnequip}
                  />
                </TabsContent>

                <TabsContent value="gacha">
                  <GachaSpinner
                    coins={coins}
                    gachaTickets={profile?.gacha_tickets || 0}
                    inventory={inventory}
                    lastFreeGacha={profile?.last_free_gacha || null}
                    onPullComplete={() => {
                      refreshProfile();
                      supabase.from("profiles").select("coins, inventory, equipped")
                        .eq("user_id", user!.id).single().then(({ data }) => {
                          if (data) {
                            setCoins((data as any).coins || 0);
                            const inv = (data as any).inventory;
                            setInventory(Array.isArray(inv) ? inv : []);
                          }
                        });
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* ============ TAB 3: ROOM ============ */}
          <TabsContent value="room">
            <div className="space-y-4">
              {/* Category selector */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
                {ROOM_CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedRoomCategory(cat.key)}
                    className={cn(
                      "flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all",
                      selectedRoomCategory === cat.key
                        ? "border-purple-400 bg-purple-100 text-purple-700 shadow-md"
                        : "border-border/50 bg-white/60 text-muted-foreground hover:bg-white/80"
                    )}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-[10px] font-thai font-semibold">{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-2 gap-3">
                {roomShopItems.map((item) => {
                  const owned = ownsRoomItem(item.id);
                  const placed = isRoomItemPlaced(item.id);
                  const locked = item.unlockedBy && !owned;

                  return (
                    <div key={item.id} className="rounded-2xl border border-white/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">{item.pixel}</span>
                        <p className="text-xs font-thai font-semibold text-center">{item.nameThai}</p>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: RARITY_COLORS[item.rarity] }}
                        >
                          {item.rarity === "common" ? "ธรรมดา" : item.rarity === "rare" ? "หายาก" : item.rarity === "epic" ? "พิเศษ" : "ตำนาน"}
                        </span>

                        {locked ? (
                          <p className="text-xs font-thai text-amber-600">🔒 ยังไม่ปลดล็อค</p>
                        ) : placed ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveRoomItem(item.id)}
                            className="font-thai text-xs w-full"
                          >
                            ถอดออก
                          </Button>
                        ) : owned ? (
                          <Button
                            size="sm"
                            onClick={() => handlePlaceRoomItem(item)}
                            className="font-thai text-xs w-full"
                          >
                            วางในห้อง
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBuyRoomItem(item)}
                            className="font-thai text-xs w-full"
                          >
                            🪙 {item.price} เหรียญ
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* ============ TAB: PETS ============ */}
          <TabsContent value="pets">
            <PetShop
              coins={coins}
              roomInventory={roomInventory}
              room={room}
              onBuyPet={handleBuyRoomItem}
              onPlacePet={handlePlaceRoomItem}
              onRemovePet={handleRemoveRoomItem}
            />
          </TabsContent>

          {/* ============ TAB 4: INVENTORY ============ */}
          <TabsContent value="inventory">
            <div className="space-y-4">
              {/* Clothing items */}
              <div className="rounded-2xl border border-white/50 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
                <h2 className="font-semibold font-thai text-lg mb-3">👕 เสื้อผ้า</h2>
                {inventory.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-thai">ยังไม่มีไอเทม</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {inventory.map((id, i) => {
                      const item = getItemById(id);
                      return (
                        <span key={`${id}-${i}`} className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-full text-xs font-thai">
                          {item?.icon} {item?.nameThai || id}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Room items */}
              <div className="rounded-2xl border border-white/50 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
                <h2 className="font-semibold font-thai text-lg mb-3">🏠 ของตกแต่งห้อง</h2>
                {roomInventory.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-thai">ยังไม่มีของตกแต่ง</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {roomInventory.map((id, i) => {
                      const item = getRoomItem(id);
                      return (
                        <span key={`${id}-${i}`} className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-full text-sm font-thai">
                          {item?.pixel} {item?.nameThai || id}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Gacha section */}
              <div className="rounded-2xl border border-white/50 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
                <h2 className="font-semibold font-thai text-lg mb-3">🎰 กาชา</h2>
                <GachaSpinner
                  coins={coins}
                  gachaTickets={profile?.gacha_tickets || 0}
                  inventory={inventory}
                  lastFreeGacha={profile?.last_free_gacha || null}
                  onPullComplete={() => {
                    refreshProfile();
                    supabase.from("profiles").select("coins, inventory, equipped, room_inventory")
                      .eq("user_id", user!.id).single().then(({ data }) => {
                        if (data) {
                          setCoins((data as any).coins || 0);
                          setInventory(Array.isArray((data as any).inventory) ? (data as any).inventory : []);
                          setRoomInventory(Array.isArray((data as any).room_inventory) ? (data as any).room_inventory : []);
                        }
                      });
                  }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyPage;
