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
      .select("user_id, display_name, total_exp, current_streak, equipped, evolution_stage")
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
        .single();

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

  const sendGift = useCallback(
    async (friendId: string, itemId?: string, coins?: number, message?: string) => {
      if (!user) return;
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

  const claimGift = useCallback(
    async (giftId: string) => {
      if (!user) return;

      const gift = pendingGifts.find((g) => g.id === giftId);
      if (!gift) return;

      // Apply gift rewards
      const { data: profile } = await supabase
        .from("profiles")
        .select("coins, inventory")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        const p = profile as any;
        const updates: any = {};
        if (gift.coins > 0) updates.coins = (p.coins || 0) + gift.coins;
        if (gift.item_id) {
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
    addFriendByCode,
    acceptRequest,
    declineRequest,
    sendGift,
    claimGift,
    refreshFriends: loadFriends,
  };
}
