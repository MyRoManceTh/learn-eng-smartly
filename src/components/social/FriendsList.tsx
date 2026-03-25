import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFriends } from "@/hooks/useFriends";
import { useChallenges } from "@/hooks/useChallenges";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { evolutionStages } from "@/data/evolutionStages";
import { getItemById } from "@/data/avatarItems";
import { toast } from "sonner";
import { Check, Pencil, UserMinus, ArrowUpDown } from "lucide-react";
import SpriteAvatar from "@/components/avatar/SpriteAvatar";
import { DEFAULT_EQUIPPED, EquippedItems } from "@/types/avatar";
import GiftModal from "./GiftModal";
import ChallengeModal from "./ChallengeModal";
import DisplayNameModal from "@/components/DisplayNameModal";

function parseEquipped(raw: any): EquippedItems {
  if (!raw || typeof raw !== "object") return DEFAULT_EQUIPPED;
  return {
    skin: (raw.skin && getItemById(raw.skin)) ? raw.skin : DEFAULT_EQUIPPED.skin,
    hair: (raw.hair && getItemById(raw.hair)) ? raw.hair : DEFAULT_EQUIPPED.hair,
    hairColor: (raw.hairColor && getItemById(raw.hairColor)) ? raw.hairColor : DEFAULT_EQUIPPED.hairColor,
    hat: null,
    shirt: (raw.shirt && getItemById(raw.shirt)) ? raw.shirt : DEFAULT_EQUIPPED.shirt,
    pants: (raw.pants && getItemById(raw.pants)) ? raw.pants : DEFAULT_EQUIPPED.pants,
    shoes: (raw.shoes && getItemById(raw.shoes)) ? raw.shoes : DEFAULT_EQUIPPED.shoes,
    necklace: (raw.necklace && getItemById(raw.necklace)) ? raw.necklace : null,
    leftHand: (raw.leftHand && getItemById(raw.leftHand)) ? raw.leftHand : null,
    rightHand: (raw.rightHand && getItemById(raw.rightHand)) ? raw.rightHand : null,
    aura: (raw.aura && getItemById(raw.aura)) ? raw.aura : null,
  };
}

type SortMode = "exp" | "streak" | "name";

export default function FriendsList() {
  const navigate = useNavigate();
  const {
    friends,
    pendingRequests,
    pendingGifts,
    loading,
    addFriendByCode,
    acceptRequest,
    declineRequest,
    removeFriend,
    sendGift,
    sendEnergy,
    claimGift,
    energySentToday,
  } = useFriends();
  const { sendChallenge } = useChallenges();
  const { profile, refreshProfile } = useProfile();

  const [friendCode, setFriendCode] = useState("");
  const [adding, setAdding] = useState(false);
  const [giftTarget, setGiftTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [challengeTarget, setChallengeTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [sendingEnergyTo, setSendingEnergyTo] = useState<string | null>(null);
  const [sentEnergyLocal, setSentEnergyLocal] = useState<Set<string>>(new Set());
  const [showNameModal, setShowNameModal] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("exp");
  const [removingFriend, setRemovingFriend] = useState<string | null>(null);

  const getEvolutionIcon = (stage: number) => {
    const evo = evolutionStages.find((s) => s.stage === stage);
    return evo?.icon || "🥚";
  };

  const handleAddFriend = async () => {
    if (!friendCode.trim() || friendCode.trim().length !== 6) {
      toast.error("กรุณากรอกรหัสเพื่อน 6 ตัวอักษร");
      return;
    }
    setAdding(true);
    await addFriendByCode(friendCode.trim());
    setFriendCode("");
    setAdding(false);
  };

  const handleCopyCode = () => {
    if (profile?.friend_code) {
      navigator.clipboard.writeText(profile.friend_code);
      toast.success("คัดลอกรหัสเพื่อนแล้ว!");
    }
  };

  const cycleSortMode = () => {
    setSortMode((prev) => {
      if (prev === "exp") return "streak";
      if (prev === "streak") return "name";
      return "exp";
    });
  };

  const sortedFriends = [...friends].sort((a, b) => {
    if (sortMode === "exp") return b.total_exp - a.total_exp;
    if (sortMode === "streak") return b.current_streak - a.current_streak;
    return a.display_name.localeCompare(b.display_name);
  });

  const sortLabel = sortMode === "exp" ? "EXP" : sortMode === "streak" ? "🔥 Streak" : "ชื่อ";

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">👥 เพื่อน</CardTitle>
            {friends.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                onClick={() => navigate("/friend-ranking")}
              >
                🏆 อันดับวันนี้
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* My info & friend code */}
          {profile?.friend_code && (
            <div className="rounded-xl bg-muted/50 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold font-thai truncate flex-1">
                  {profile.display_name || "ไม่ระบุชื่อ"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNameModal(true)}
                  className="h-7 px-2 text-xs gap-1"
                >
                  <Pencil className="w-3 h-3" /> แก้ไขชื่อ
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  รหัสเพื่อน:
                </span>
                <code className="rounded bg-background px-2 py-0.5 text-sm font-bold tracking-wider">
                  {profile.friend_code}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  className="ml-auto h-7 px-2 text-xs"
                >
                  📋 คัดลอก
                </Button>
              </div>
            </div>
          )}

          {/* Add friend */}
          <div className="flex gap-2">
            <Input
              placeholder="กรอกรหัสเพื่อน 6 ตัว"
              value={friendCode}
              onChange={(e) =>
                setFriendCode(e.target.value.toUpperCase().slice(0, 6))
              }
              maxLength={6}
              className="font-mono tracking-wider uppercase"
            />
            <Button
              onClick={handleAddFriend}
              disabled={adding || friendCode.length !== 6}
              size="sm"
              className="shrink-0"
            >
              {adding ? "กำลังส่ง..." : "เพิ่มเพื่อน"}
            </Button>
          </div>

          {/* Pending gifts (received) */}
          {pendingGifts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-pink-500">
                🎁 ของขวัญรอรับ ({pendingGifts.length})
              </h4>
              {pendingGifts.map((gift) => {
                const item = gift.item_id ? getItemById(gift.item_id) : null;
                return (
                  <div
                    key={gift.id}
                    className="flex items-center gap-2 rounded-lg border border-pink-200 bg-pink-50/50 p-2 dark:border-pink-900 dark:bg-pink-950/20"
                  >
                    <span className="text-lg">
                      {gift.item_id === "energy" ? "⚡" : item?.icon || "🪙"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        จาก {gift.sender_name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {gift.item_id === "energy"
                          ? "เติมไฟให้~ 🔥"
                          : gift.coins > 0
                          ? `🪙 ${gift.coins} เหรียญ`
                          : item?.nameThai || "ไอเทม"}
                        {gift.message && ` — "${gift.message}"`}
                      </p>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-7 px-3 text-xs"
                      onClick={() => claimGift(gift.id)}
                    >
                      รับ
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pending requests */}
          {pendingRequests.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-orange-500">
                📨 คำขอเป็นเพื่อน ({pendingRequests.length})
              </h4>
              {pendingRequests.map((req) => (
                <div
                  key={req.friendship_id}
                  className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50/50 p-2 dark:border-orange-900 dark:bg-orange-950/20"
                >
                  <div className="shrink-0 w-12 h-14 flex items-center justify-center overflow-hidden">
                    <div className="scale-[0.45] origin-center">
                      <SpriteAvatar equipped={parseEquipped(req.equipped)} size="sm" />
                    </div>
                  </div>
                  <span className="flex-1 text-sm font-medium truncate">
                    {req.display_name}
                  </span>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => acceptRequest(req.friendship_id)}
                  >
                    ยอมรับ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => declineRequest(req.friendship_id)}
                  >
                    ปฏิเสธ
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Friends list */}
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : friends.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-3xl mb-2">🤝</p>
              <p className="text-sm text-muted-foreground">
                ยังไม่มีเพื่อน ลองเพิ่มเพื่อนด้วยรหัสด้านบน
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">
                  เพื่อนของคุณ ({friends.length})
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs gap-1"
                  onClick={cycleSortMode}
                >
                  <ArrowUpDown className="w-3 h-3" />
                  {sortLabel}
                </Button>
              </div>
              {sortedFriends.map((friend) => {
                const canSendEnergy = friend.lessons_completed >= 1;
                const isSendingEnergy = sendingEnergyTo === friend.user_id;
                const alreadySent = energySentToday.has(friend.user_id) || sentEnergyLocal.has(friend.user_id);
                const isConfirmingRemove = removingFriend === friend.friendship_id;

                return (
                  <div
                    key={friend.friendship_id}
                    className="rounded-xl border p-3 transition-colors hover:bg-muted/30 space-y-2"
                  >
                    {/* Top row: avatar + info */}
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-14 h-16 rounded-lg overflow-hidden bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center">
                        <div className="scale-50 origin-center">
                          <SpriteAvatar
                            equipped={parseEquipped(friend.equipped)}
                            size="sm"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {friend.display_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>⚡ {friend.total_exp.toLocaleString()} EXP</span>
                          <span>🔥 {friend.current_streak} วัน</span>
                          <span>📚 {friend.lessons_completed} บท</span>
                        </div>
                      </div>
                      {/* Energy display */}
                      <div className="flex items-center gap-0.5 shrink-0" title={`ไฟ ${friend.energy}/5`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-xs ${i < friend.energy ? "opacity-100" : "opacity-20"}`}>
                            ⚡
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1.5">
                      {alreadySent ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs flex-1 bg-green-50 border-green-200 text-green-600 cursor-default"
                          disabled
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          เติมไฟแล้ว
                        </Button>
                      ) : (
                        <Button
                          variant={canSendEnergy ? "default" : "outline"}
                          size="sm"
                          className={`h-8 px-3 text-xs flex-1 ${
                            canSendEnergy
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                              : "opacity-50"
                          }`}
                          disabled={!canSendEnergy || isSendingEnergy}
                          onClick={async () => {
                            setSendingEnergyTo(friend.user_id);
                            const success = await sendEnergy(friend.user_id);
                            if (success) {
                              setSentEnergyLocal(prev => new Set(prev).add(friend.user_id));
                            }
                            setSendingEnergyTo(null);
                          }}
                        >
                          {isSendingEnergy ? "กำลังเติม..." : "🔥 เติมไฟ"}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() =>
                          setGiftTarget({
                            id: friend.user_id,
                            name: friend.display_name,
                          })
                        }
                      >
                        🎁 ของขวัญ
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() =>
                          setChallengeTarget({
                            id: friend.user_id,
                            name: friend.display_name,
                          })
                        }
                      >
                        ⚔️ ท้าดวล
                      </Button>
                      {/* Remove friend */}
                      {isConfirmingRemove ? (
                        <div className="flex gap-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={async () => {
                              await removeFriend(friend.friendship_id);
                              setRemovingFriend(null);
                            }}
                          >
                            ยืนยัน
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => setRemovingFriend(null)}
                          >
                            ยกเลิก
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => setRemovingFriend(friend.friendship_id)}
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>

                    {/* Hint if friend hasn't completed any lesson */}
                    {!canSendEnergy && !alreadySent && (
                      <p className="text-[10px] text-muted-foreground text-center font-thai">
                        เพื่อนต้องเรียนจบอย่างน้อย 1 บท ถึงจะเติมไฟได้
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gift Modal */}
      {giftTarget && (
        <GiftModal
          open={!!giftTarget}
          friendId={giftTarget.id}
          friendName={giftTarget.name}
          onClose={() => setGiftTarget(null)}
          onSend={async (friendId, itemId, coins, message) => {
            await sendGift(friendId, itemId, coins, message);
            setGiftTarget(null);
          }}
          inventory={Array.isArray(profile?.inventory) ? (profile.inventory as string[]) : []}
          coins={profile?.coins || 0}
        />
      )}

      {/* Challenge Modal */}
      {challengeTarget && (
        <ChallengeModal
          open={!!challengeTarget}
          friendId={challengeTarget.id}
          friendName={challengeTarget.name}
          onClose={() => setChallengeTarget(null)}
          onSend={async (opponentId, lessonId) => {
            const result = await sendChallenge(opponentId, lessonId);
            setChallengeTarget(null);
            return result;
          }}
        />
      )}
      <DisplayNameModal
        open={showNameModal}
        onOpenChange={setShowNameModal}
        currentName={profile?.display_name || null}
        onSaved={() => refreshProfile()}
      />
    </>
  );
}
