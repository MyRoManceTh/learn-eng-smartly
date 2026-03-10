import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Save, User, Crown, Flame, BookOpen, Coins, Star } from "lucide-react";

interface Props {
  user: any;
  open: boolean;
  onClose: () => void;
}

const UserDetailSheet = ({ user, open, onClose }: Props) => {
  const { updateUser } = useAdminUsers();
  const [displayName, setDisplayName] = useState(user.display_name || "");
  const [currentLevel, setCurrentLevel] = useState(user.current_level || 1);
  const [coins, setCoins] = useState(user.coins || 0);
  const [totalExp, setTotalExp] = useState(user.total_exp || 0);
  const [isPremium, setIsPremium] = useState(user.is_premium || false);

  const handleSave = () => {
    updateUser.mutate(
      {
        userId: user.user_id,
        updates: {
          display_name: displayName,
          current_level: currentLevel,
          coins,
          total_exp: totalExp,
          is_premium: isPremium,
        },
      },
      { onSuccess: onClose }
    );
  };

  const createdDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const lastActivity = user.last_activity_date || "-";

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-thai flex items-center gap-2">
            <User className="w-5 h-5" /> รายละเอียดผู้ใช้
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-6">
          {/* Status badges */}
          <div className="flex gap-2 flex-wrap">
            {user.is_banned && <Badge variant="destructive" className="font-thai">แบน</Badge>}
            {user.is_premium && <Badge className="bg-yellow-500 font-thai">Premium</Badge>}
            {user.is_admin && <Badge className="bg-blue-500 font-thai">Admin</Badge>}
          </div>

          {/* Read-only info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground font-thai">User ID</span>
              <p className="font-mono text-xs truncate">{user.user_id}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground font-thai">Friend Code</span>
              <p className="font-mono">{user.friend_code || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground font-thai">สมัครเมื่อ</span>
              <p className="font-thai">{createdDate}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground font-thai">ใช้งานล่าสุด</span>
              <p>{lastActivity}</p>
            </div>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-3 gap-2">
            <div className="border rounded-lg p-3 text-center">
              <Flame className="w-4 h-4 mx-auto text-orange-500 mb-1" />
              <p className="text-lg font-bold">{user.current_streak || 0}</p>
              <p className="text-xs text-muted-foreground font-thai">Streak</p>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <BookOpen className="w-4 h-4 mx-auto text-blue-500 mb-1" />
              <p className="text-lg font-bold">{user.lessons_completed || 0}</p>
              <p className="text-xs text-muted-foreground font-thai">บทเรียน</p>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <Star className="w-4 h-4 mx-auto text-purple-500 mb-1" />
              <p className="text-lg font-bold">{user.evolution_stage || 1}</p>
              <p className="text-xs text-muted-foreground font-thai">Evolution</p>
            </div>
          </div>

          <hr />

          {/* Editable fields */}
          <div>
            <Label className="font-thai">ชื่อแสดง</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-thai flex items-center gap-1">
                <Star className="w-3 h-3" /> Level
              </Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={currentLevel}
                onChange={(e) => setCurrentLevel(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="font-thai flex items-center gap-1">
                <Coins className="w-3 h-3" /> Coins
              </Label>
              <Input
                type="number"
                min={0}
                value={coins}
                onChange={(e) => setCoins(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label className="font-thai">Total EXP</Label>
            <Input
              type="number"
              min={0}
              value={totalExp}
              onChange={(e) => setTotalExp(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="font-thai flex items-center gap-1">
              <Crown className="w-4 h-4 text-yellow-500" /> Premium
            </Label>
            <Switch checked={isPremium} onCheckedChange={setIsPremium} />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={updateUser.isPending}
              className="flex-1 font-thai"
            >
              <Save className="w-4 h-4 mr-1" />
              {updateUser.isPending ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
            <Button variant="outline" onClick={onClose} className="font-thai">
              ปิด
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailSheet;
