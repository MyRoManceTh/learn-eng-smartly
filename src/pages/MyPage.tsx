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
import { pathNodes, levelLabels } from "@/data/pathNodes";
import { roomItems, getRoomItem, WALLPAPER_COLORS, FLOOR_COLORS } from "@/data/roomItems";

// Components
import PixelRoom from "@/components/room/PixelRoom";
import RobloxAvatar from "@/components/avatar/RobloxAvatar";
import CoinDisplay from "@/components/avatar/CoinDisplay";
import EvolutionProgressBar from "@/components/avatar/EvolutionProgressBar";
import ShopSection from "@/components/avatar/ShopSection";
import InventorySection from "@/components/avatar/InventorySection";
import GachaSpinner from "@/components/gacha/GachaSpinner";
import LeaderboardSection from "@/components/social/LeaderboardSection";
import FriendsList from "@/components/social/FriendsList";

// 8bit UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/8bit/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";
import { Button } from "@/components/ui/8bit/button";
import { Progress } from "@/components/ui/8bit/progress";

// Regular UI
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Settings, Flame, Trophy, Zap, Star, TrendingUp, History } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

import "@/components/ui/8bit/styles/retro.css";

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
      skin: "skin_default", hair: "hair_default", hairColor: "haircolor_black",
      hat: null, shirt: "shirt_default", pants: "pants_default",
      shoes: "shoes_default", accessory: null,
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
      name: `Lv.${lvl}`,
      label: levelLabels[lvl],
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
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🏠</div>
          <p className="retro text-sm text-white">LOADING...</p>
          <div className="flex gap-2 justify-center">
            <div className="w-3 h-3 bg-yellow-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-3 h-3 bg-green-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d1b69] via-[#1a1a2e] to-[#0f0f23] pb-28">
      {/* === HEADER === */}
      <header className="relative px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <div>
              <h1 className="retro text-sm text-white">
                {profileData?.display_name || "My Room"}
              </h1>
              <p className="retro text-[8px] text-white/50">
                {evolutionStage.nameThai} {evolutionStage.icon}
              </p>
            </div>
          </div>
          <CoinDisplay coins={coins} />
        </div>
      </header>

      {/* === ROOM VIEW === */}
      <div className="px-4 mb-3">
        <PixelRoom
          equipped={equipped}
          room={room}
          evolutionStage={evolutionStage.stage}
          size="lg"
        />
      </div>

      {/* === EVOLUTION PROGRESS === */}
      <div className="px-4 mb-4">
        <EvolutionProgressBar totalExp={profile?.total_exp || 0} />
      </div>

      {/* === MAIN TABS === */}
      <div className="px-4">
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="w-full mb-4 grid grid-cols-4">
            <TabsTrigger value="stats" className="retro text-[8px] md:text-[10px] py-2">
              📊 Stats
            </TabsTrigger>
            <TabsTrigger value="character" className="retro text-[8px] md:text-[10px] py-2">
              👤 ตัวเรา
            </TabsTrigger>
            <TabsTrigger value="room" className="retro text-[8px] md:text-[10px] py-2">
              🛋️ ห้อง
            </TabsTrigger>
            <TabsTrigger value="inventory" className="retro text-[8px] md:text-[10px] py-2">
              📦 คลัง
            </TabsTrigger>
          </TabsList>

          {/* ============ TAB 1: STATS ============ */}
          <TabsContent value="stats">
            <div className="space-y-4">
              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl mb-1">🔥</p>
                    <p className="retro text-lg text-orange-400">{profileData?.current_streak || 0}</p>
                    <p className="retro text-[7px] text-muted-foreground mt-1">STREAK</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl mb-1">🏆</p>
                    <p className="retro text-lg text-amber-400">{profileData?.longest_streak || 0}</p>
                    <p className="retro text-[7px] text-muted-foreground mt-1">BEST</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl mb-1">⚡</p>
                    <p className="retro text-lg text-purple-400">{profileData?.total_exp || 0}</p>
                    <p className="retro text-[7px] text-muted-foreground mt-1">TOTAL EXP</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl mb-1">⭐</p>
                    <p className="retro text-lg text-pink-400">{Math.round(avgScore)}%</p>
                    <p className="retro text-[7px] text-muted-foreground mt-1">AVG SCORE</p>
                  </CardContent>
                </Card>
              </div>

              {/* Progress chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="retro text-xs flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> LEVEL PROGRESS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={levelProgressData} barSize={24}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "'Press Start 2P'" }} />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const d = payload[0].payload;
                            return (
                              <div className="bg-background border-2 border-foreground p-2 text-xs retro">
                                <p>{d.name} {d.label}</p>
                                <p>{d.completed}/{d.total} ({d.percent}%)</p>
                              </div>
                            );
                          }}
                        />
                        <Bar dataKey="completed" radius={0}>
                          {levelProgressData.map((_, i) => (
                            <Cell key={i} fill={levelColorValues[i + 1]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Level bars */}
                  <div className="mt-4 space-y-2">
                    {levelProgressData.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="retro text-[7px] w-12" style={{ color: levelColorValues[i + 1] }}>
                          {d.name}
                        </span>
                        <div className="flex-1 h-3 bg-muted overflow-hidden border border-foreground/20">
                          <div
                            className="h-full transition-all duration-700"
                            style={{ width: `${d.percent}%`, backgroundColor: levelColorValues[i + 1] }}
                          />
                        </div>
                        <span className="retro text-[7px] text-muted-foreground w-14 text-right">
                          {d.completed}/{d.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Profile form */}
              <Card>
                <CardHeader>
                  <CardTitle className="retro text-xs flex items-center gap-2">
                    <Settings className="w-4 h-4" /> PROFILE SETTINGS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="font-thai text-xs">ชื่อที่แสดง</Label>
                      <Input value={profileData?.display_name || ""} onChange={(e) => setProfileData((p) => p && { ...p, display_name: e.target.value })} />
                    </div>
                    <div>
                      <Label className="font-thai text-xs">อายุ</Label>
                      <Input type="number" value={profileData?.age || ""} onChange={(e) => setProfileData((p) => p && { ...p, age: parseInt(e.target.value) || null })} />
                    </div>
                    <div>
                      <Label className="font-thai text-xs">เพศ</Label>
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
                      <Label className="font-thai text-xs">ระดับการศึกษา</Label>
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
                      <Label className="font-thai text-xs">โรงเรียน/สถานศึกษา</Label>
                      <Input value={profileData?.school_name || ""} onChange={(e) => setProfileData((p) => p && { ...p, school_name: e.target.value })} />
                    </div>
                  </div>
                  <Button onClick={saveProfile}>
                    <Save className="w-4 h-4 mr-2" /> SAVE
                  </Button>
                </CardContent>
              </Card>

              {/* Learning history */}
              <Card>
                <CardHeader>
                  <CardTitle className="retro text-xs flex items-center gap-2">
                    <History className="w-4 h-4" /> HISTORY
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <p className="retro text-[8px] text-muted-foreground">NO DATA YET...</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {history.map((h) => (
                        <div key={h.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                          <div>
                            <p className="text-xs font-semibold">{h.lesson_title}</p>
                            <p className="retro text-[7px] text-muted-foreground">
                              Lv.{h.lesson_level} • {new Date(h.completed_at).toLocaleDateString("th-TH")}
                            </p>
                          </div>
                          {h.quiz_score !== null && (
                            <Badge variant={h.quiz_score === h.quiz_total ? "default" : "secondary"}>
                              {h.quiz_score}/{h.quiz_total}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social */}
              <LeaderboardSection />
              <FriendsList />

              {/* Quick links */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => navigate("/season-pass")} className="retro text-[8px] h-12">
                  🏆 SEASON PASS
                </Button>
                <Button variant="outline" onClick={() => navigate("/parent-report")} className="retro text-[8px] h-12">
                  📊 PARENT RPT
                </Button>
                <Button variant="outline" onClick={() => navigate("/premium")} className="retro text-[8px] h-12 col-span-2">
                  ⭐ PREMIUM
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ============ TAB 2: CHARACTER ============ */}
          <TabsContent value="character">
            <div className="space-y-4">
              {/* Avatar preview */}
              <Card>
                <CardContent className="p-4 flex justify-center">
                  <RobloxAvatar
                    equipped={equipped}
                    size="lg"
                    animated
                    evolutionStage={evolutionStage.stage}
                  />
                </CardContent>
              </Card>

              {/* Shop / Inventory / Gacha sub-tabs */}
              <Tabs defaultValue="shop">
                <TabsList className="w-full grid grid-cols-3 mb-3">
                  <TabsTrigger value="shop" className="retro text-[7px]">🛒 ร้านค้า</TabsTrigger>
                  <TabsTrigger value="closet" className="retro text-[7px]">👔 ตู้เสื้อผ้า</TabsTrigger>
                  <TabsTrigger value="gacha" className="retro text-[7px]">🎰 กาชา</TabsTrigger>
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
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {ROOM_CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedRoomCategory(cat.key)}
                    className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${
                      selectedRoomCategory === cat.key
                        ? "border-purple-400 bg-purple-500/20 text-white"
                        : "border-white/10 bg-white/5 text-white/60"
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="retro text-[7px]">{cat.label}</span>
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
                    <Card key={item.id}>
                      <CardContent className="p-3">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-3xl">{item.pixel}</span>
                          <p className="retro text-[7px] text-center">{item.nameThai}</p>
                          <Badge
                            style={{ backgroundColor: RARITY_COLORS[item.rarity], color: "#fff" }}
                            className="retro text-[6px]"
                          >
                            {item.rarity.toUpperCase()}
                          </Badge>

                          {locked ? (
                            <p className="retro text-[6px] text-yellow-400">🔒 LOCKED</p>
                          ) : placed ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveRoomItem(item.id)}
                              className="retro text-[7px] w-full"
                            >
                              REMOVE
                            </Button>
                          ) : owned ? (
                            <Button
                              size="sm"
                              onClick={() => handlePlaceRoomItem(item)}
                              className="retro text-[7px] w-full"
                            >
                              PLACE
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleBuyRoomItem(item)}
                              className="retro text-[7px] w-full"
                            >
                              🪙 {item.price}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* ============ TAB 4: INVENTORY ============ */}
          <TabsContent value="inventory">
            <div className="space-y-4">
              {/* Clothing items */}
              <Card>
                <CardHeader>
                  <CardTitle className="retro text-xs">👕 CLOTHING</CardTitle>
                </CardHeader>
                <CardContent>
                  {inventory.length === 0 ? (
                    <p className="retro text-[8px] text-muted-foreground">NO ITEMS YET...</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {inventory.map((id, i) => (
                        <Badge key={`${id}-${i}`} variant="secondary" className="text-xs">
                          {id}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Room items */}
              <Card>
                <CardHeader>
                  <CardTitle className="retro text-xs">🏠 ROOM ITEMS</CardTitle>
                </CardHeader>
                <CardContent>
                  {roomInventory.length === 0 ? (
                    <p className="retro text-[8px] text-muted-foreground">NO ROOM ITEMS YET...</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {roomInventory.map((id, i) => {
                        const item = getRoomItem(id);
                        return (
                          <Badge key={`${id}-${i}`} variant="secondary" className="text-sm gap-1">
                            {item?.pixel} {item?.nameThai || id}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gacha section */}
              <Card>
                <CardHeader>
                  <CardTitle className="retro text-xs">🎰 GACHA</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyPage;
