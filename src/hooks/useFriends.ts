import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface FriendData {
  friendship_id: string;
  user_id: string;
  display_name: string;
  total_exp: number;
  current_streak: number;
  equipped: any;
  evolution_stage: number;
  lessons_completed: number;
  energy: number;
  status: string;
  is_requester: boolean;
}

export interface PendingGift {
  id: string;
  sender_id: string;
  sender_name: string;
  item_id?: string;
  coins: number;
  message?: string;
}

export function useFriends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendData[]>([]);
  const [pendingGifts, setPendingGifts] = useState<PendingGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [energySentToday, setEnergySentToday] = useState<Set<string>>(new Set());

  const loadFriends = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Load friendships
    const { data: friendships } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    if (!friendships) {
      setLoading(false);
      return;
    }

    const friendUserIds = (friendships as any[]).map((f) =>
      f.requester_id === user.id ? f.addressee_id : f.requester_id
    );

    if (friendUserIds.length === 0) {
      setFriends([]);
      setPendingRequests([]);
      setLoading(false);
      return;
    }

    // Load friend profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, total_exp, current_streak, equipped, evolution_stage, lessons_completed, energy")
      .in("user_id", friendUserIds);

    const profileMap = new Map<string, any>();
    ((profiles as any[]) || []).forEach((p) => profileMap.set(p.user_id, p));

    const allFriends: FriendData[] = [];
    const pending: FriendData[] = [];

    (friendships as any[]).forEach((f) => {
      const friendId = f.requester_id === user.id ? f.addressee_id : f.requester_id;
      const profile = profileMap.get(friendId);
      if (!profile) return;

      const data: FriendData = {
        friendship_id: f.id,
        user_id: friendId,
        display_name: profile.display_name || "ไม่ระบุชื่อ",
        total_exp: profile.total_exp || 0,
        current_streak: profile.current_streak || 0,
        equipped: profile.equipped,
        evolution_stage: profile.evolution_stage || 1,
        lessons_completed: profile.lessons_completed || 0,
        energy: profile.energy ?? 5,
        status: f.status,
        is_requester: f.requester_id === user.id,
      };

      if (f.status === "accepted") {
        allFriends.push(data);
      } else if (f.status === "pending" && f.addressee_id === user.id) {
        pending.push(data);
      }
    });

    setFriends(allFriends);
    setPendingRequests(pending);

    // Load energy sent today
    const now = new Date();
    const thaiOffset = 7 * 60 * 60 * 1000;
    const thaiNow = new Date(now.getTime() + thaiOffset);
    const today = thaiNow.toISOString().split("T")[0];

    const { data: energyGifts } = await supabase
      .from("gift_transactions")
      .select("receiver_id")
      .eq("sender_id", user.id)
      .eq("item_id", "energy")
      .gte("created_at", today + "T00:00:00+07:00");

    if (energyGifts && (energyGifts as any[]).length > 0) {
      const sentSet = new Set<string>((energyGifts as any[]).map((g: any) => g.receiver_id));
      setEnergySentToday(sentSet);
    } else {
      setEnergySentToday(new Set());
    }

    // Load pending gifts
    const { data: gifts } = await supabase
      .from("gift_transactions")
      .select("*")
      .eq("receiver_id", user.id)
      .eq("claimed", false);

    if (gifts && (gifts as any[]).length > 0) {
      const senderIds = [...new Set((gifts as any[]).map((g: any) => g.sender_id))];
      const { data: senderProfiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", senderIds);

      const senderMap = new Map<string, string>();
      ((senderProfiles as any[]) || []).forEach((p) =>
        senderMap.set(p.user_id, p.display_name || "ไม่ระบุชื่อ")
      );

      setPendingGifts(
        (gifts as any[]).map((g: any) => ({
          id: g.id,
          sender_id: g.sender_id,
          sender_name: senderMap.get(g.sender_id) || "ไม่ระบุชื่อ",
          item_id: g.item_id,
          coins: g.coins,
          message: g.message,
        }))
      );
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const addFriendByCode = useCallback(
    async (friendCode: string): Promise<boolean> => {
      if (!user) return false;

      const { data: friendProfile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("friend_code", friendCode.toUpperCase())
        .maybeSingle();

      if (!friendProfile) {
        toast.error("ไม่พบรหัสเพื่อนนี้");
        return false;
      }

      const fp = friendProfile as any;
      if (fp.user_id === user.id) {
        toast.error("ไม่สามารถเพิ่มตัวเองเป็นเพื่อนได้");
        return false;
      }

      const { error } = await supabase.from("friendships").insert({
        requester_id: user.id,
        addressee_id: fp.user_id,
        status: "pending",
      } as any);

      if (error) {
        if (error.code === "23505") {
          toast.error("ส่งคำขอไปแล้ว หรือเป็นเพื่อนกันอยู่แล้ว");
        } else {
          toast.error("เกิดข้อผิดพลาด");
        }
        return false;
      }

      toast.success("ส่งคำขอเป็นเพื่อนแล้ว!");
      loadFriends();
      return true;
    },
    [user, loadFriends]
  );

  const acceptRequest = useCallback(
    async (friendshipId: string) => {
      await supabase
        .from("friendships")
        .update({ status: "accepted", updated_at: new Date().toISOString() } as any)
        .eq("id", friendshipId);
      toast.success("ยอมรับคำขอเป็นเพื่อนแล้ว!");
      loadFriends();
    },
    [loadFriends]
  );

  const declineRequest = useCallback(
    async (friendshipId: string) => {
      await supabase.from("friendships").delete().eq("id", friendshipId);
      toast("ปฏิเสธคำขอแล้ว");
      loadFriends();
    },
    [loadFriends]
  );

  const removeFriend = useCallback(
    async (friendshipId: string) => {
      if (!user) return;
      await supabase.from("friendships").delete().eq("id", friendshipId);
      toast.success("ลบเพื่อนแล้ว");
      loadFriends();
    },
    [user, loadFriends]
  );

  const sendGift = useCallback(
    async (friendId: string, itemId?: string, coins?: number, message?: string) => {
      if (!user) return;

      // Deduct coins/items from sender BEFORE inserting transaction
      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("coins, inventory")
        .eq("user_id", user.id)
        .single();

      if (!senderProfile) {
        toast.error("เกิดข้อผิดพลาด");
        return;
      }

      const sp = senderProfile as any;
      const updates: any = {};

      if (coins && coins > 0) {
        if ((sp.coins || 0) < coins) {
          toast.error("เหรียญไม่พอ!");
          return;
        }
        updates.coins = (sp.coins || 0) - coins;
      }

      if (itemId && itemId !== "energy") {
        const inv = Array.isArray(sp.inventory) ? [...sp.inventory] : [];
        const idx = inv.indexOf(itemId);
        if (idx === -1) {
          toast.error("ไม่มีไอเทมนี้ในคลัง!");
          return;
        }
        inv.splice(idx, 1);
        updates.inventory = inv;
      }

      if (Object.keys(updates).length > 0) {
        await supabase.from("profiles").update(updates).eq("user_id", user.id);
      }

      await supabase.from("gift_transactions").insert({
        sender_id: user.id,
        receiver_id: friendId,
        item_id: itemId || null,
        coins: coins || 0,
        message: message || null,
      } as any);
      toast.success("ส่งของขวัญแล้ว! 🎁");
    },
    [user]
  );

  const sendEnergy = useCallback(
    async (friendId: string): Promise<boolean> => {
      if (!user) return false;

      // Check if friend completed at least 1 lesson
      const friend = friends.find((f) => f.user_id === friendId);
      if (!friend || friend.lessons_completed < 1) {
        toast.error("เพื่อนต้องเรียนจบอย่างน้อย 1 บทก่อน ถึงจะเติมไฟได้");
        return false;
      }

      // Check if already sent energy to this friend today
      if (energySentToday.has(friendId)) {
        toast.error("วันนี้เติมไฟให้เพื่อนคนนี้แล้ว พรุ่งนี้มาใหม่นะ~");
        return false;
      }

      // Send energy gift
      const { error } = await supabase.from("gift_transactions").insert({
        sender_id: user.id,
        receiver_id: friendId,
        item_id: "energy",
        coins: 0,
        message: "เติมไฟให้~ สู้ๆ นะ! 🔥",
      } as any);

      if (error) {
        toast.error("เกิดข้อผิดพลาด ลองอีกครั้ง");
        return false;
      }

      // Update local state
      setEnergySentToday(prev => new Set(prev).add(friendId));
      toast.success("เติมไฟให้เพื่อนแล้ว! 🔥⚡");
      return true;
    },
    [user, friends, energySentToday]
  );

  const claimGift = useCallback(
    async (giftId: string) => {
      if (!user) return;

      const gift = pendingGifts.find((g) => g.id === giftId);
      if (!gift) return;

      // Apply gift rewards
      const { data: profile } = await supabase
        .from("profiles")
        .select("coins, inventory, energy")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        const p = profile as any;
        const updates: any = {};
        if (gift.coins > 0) updates.coins = (p.coins || 0) + gift.coins;
        if (gift.item_id === "energy") {
          // Energy gift: add 1 energy, max 5
          updates.energy = Math.min(5, (p.energy ?? 5) + 1);
        } else if (gift.item_id) {
          const inv = Array.isArray(p.inventory) ? p.inventory : [];
          updates.inventory = [...inv, gift.item_id];
        }
        if (Object.keys(updates).length > 0) {
          await supabase.from("profiles").update(updates).eq("user_id", user.id);
        }
      }

      await supabase
        .from("gift_transactions")
        .update({ claimed: true } as any)
        .eq("id", giftId);

      toast.success("รับของขวัญแล้ว! 🎉");
      loadFriends();
    },
    [user, pendingGifts, loadFriends]
  );

  const notificationCount = pendingRequests.length + pendingGifts.length;

  return {
    friends,
    pendingRequests,
    pendingGifts,
    loading,
    notificationCount,
    energySentToday,
    addFriendByCode,
    acceptRequest,
    declineRequest,
    removeFriend,
    sendGift,
    sendEnergy,
    claimGift,
    refreshFriends: loadFriends,
  };
}
