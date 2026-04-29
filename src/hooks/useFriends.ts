import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getThaiMidnight } from "@/utils/timezone";

export interface FriendData {
  friendship_id: string;
  user_id: string;
  display_name: string;
  total_exp: number;
  current_streak: number;
  equipped: Record<string, unknown>;
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
  const [claimingIds, setClaimingIds] = useState<Set<string>>(new Set());

  const loadFriends = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: friendships, error: fErr } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    if (fErr || !friendships) {
      setLoading(false);
      return;
    }

    const friendUserIds = (friendships as Record<string, string>[]).map((f) =>
      f.requester_id === user.id ? f.addressee_id : f.requester_id
    );

    if (friendUserIds.length === 0) {
      setFriends([]);
      setPendingRequests([]);
      setPendingGifts([]);
      setLoading(false);
      return;
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, total_exp, current_streak, equipped, evolution_stage, lessons_completed, energy")
      .in("user_id", friendUserIds);

    const profileMap = new Map<string, Record<string, unknown>>();
    ((profiles as Record<string, unknown>[]) || []).forEach((p) =>
      profileMap.set(p.user_id as string, p)
    );

    const allFriends: FriendData[] = [];
    const pending: FriendData[] = [];

    (friendships as Record<string, string>[]).forEach((f) => {
      const friendId = f.requester_id === user.id ? f.addressee_id : f.requester_id;
      const profile = profileMap.get(friendId);
      if (!profile) return;

      const data: FriendData = {
        friendship_id: f.id,
        user_id: friendId,
        display_name: (profile.display_name as string) || "ไม่ระบุชื่อ",
        total_exp: (profile.total_exp as number) || 0,
        current_streak: (profile.current_streak as number) || 0,
        equipped: (profile.equipped as Record<string, unknown>) || {},
        evolution_stage: (profile.evolution_stage as number) || 1,
        lessons_completed: (profile.lessons_completed as number) || 0,
        energy: (profile.energy as number) ?? 5,
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
    const thaiMidnight = getThaiMidnight();
    const { data: energyGifts } = await supabase
      .from("gift_transactions")
      .select("receiver_id")
      .eq("sender_id", user.id)
      .eq("item_id", "energy")
      .gte("created_at", thaiMidnight);

    const sentSet = new Set<string>(
      ((energyGifts as Record<string, string>[]) || []).map((g) => g.receiver_id)
    );
    setEnergySentToday(sentSet);

    // Load pending gifts
    const { data: gifts } = await supabase
      .from("gift_transactions")
      .select("*")
      .eq("receiver_id", user.id)
      .eq("claimed", false);

    if (gifts && (gifts as Record<string, unknown>[]).length > 0) {
      const senderIds = [...new Set((gifts as any[]).map((g) => g.sender_id))];
      const { data: senderProfiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", senderIds);

      const senderMap = new Map<string, string>();
      ((senderProfiles as Record<string, string>[]) || []).forEach((p) =>
        senderMap.set(p.user_id, p.display_name || "ไม่ระบุชื่อ")
      );

      setPendingGifts(
        (gifts as Record<string, unknown>[]).map((g) => ({
          id: g.id as string,
          sender_id: g.sender_id as string,
          sender_name: senderMap.get(g.sender_id as string) || "ไม่ระบุชื่อ",
          item_id: g.item_id as string | undefined,
          coins: (g.coins as number) || 0,
          message: g.message as string | undefined,
        }))
      );
    } else {
      setPendingGifts([]);
    }

    setClaimingIds(new Set());
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  // ── Add friend by code ──────────────────────────
  const addFriendByCode = useCallback(
    async (friendCode: string): Promise<boolean> => {
      if (!user) return false;

      // Validate format
      const code = friendCode.trim().toUpperCase();
      if (!/^[A-Z2-9]{6}$/.test(code)) {
        toast.error("รหัสเพื่อนต้องเป็นตัวอักษร 6 ตัว");
        return false;
      }

      const { data: friendProfile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("friend_code", code)
        .maybeSingle();

      if (!friendProfile) {
        toast.error("ไม่พบรหัสเพื่อนนี้");
        return false;
      }

      const fp = friendProfile as Record<string, string>;
      if (fp.user_id === user.id) {
        toast.error("ไม่สามารถเพิ่มตัวเองเป็นเพื่อนได้");
        return false;
      }

      // Check existing friendship (any status)
      const { data: existing } = await supabase
        .from("friendships")
        .select("id, status")
        .or(
          `and(requester_id.eq.${user.id},addressee_id.eq.${fp.user_id}),and(requester_id.eq.${fp.user_id},addressee_id.eq.${user.id})`
        )
        .maybeSingle();

      if (existing) {
        const ex = existing as Record<string, string>;
        if (ex.status === "accepted") {
          toast.error("เป็นเพื่อนกันอยู่แล้ว");
        } else {
          toast.error("ส่งคำขอไปแล้ว รอเพื่อนตอบรับ");
        }
        return false;
      }

      const { error } = await supabase.from("friendships").insert({
        requester_id: user.id,
        addressee_id: fp.user_id,
        status: "pending",
      } as any);

      if (error) {
        toast.error("เกิดข้อผิดพลาด");
        return false;
      }

      toast.success("ส่งคำขอเป็นเพื่อนแล้ว!");
      loadFriends();
      return true;
    },
    [user, loadFriends]
  );

  // ── Accept / Decline / Remove ───────────────────
  const acceptRequest = useCallback(
    async (friendshipId: string) => {
      const { error } = await supabase
        .from("friendships")
        .update({ status: "accepted", updated_at: new Date().toISOString() } as Record<string, string>)
        .eq("id", friendshipId);

      if (error) {
        toast.error("เกิดข้อผิดพลาด ลองอีกครั้ง");
        return;
      }
      toast.success("ยอมรับคำขอเป็นเพื่อนแล้ว!");
      loadFriends();
    },
    [loadFriends]
  );

  const declineRequest = useCallback(
    async (friendshipId: string) => {
      const { error } = await supabase.from("friendships").delete().eq("id", friendshipId);
      if (error) {
        toast.error("เกิดข้อผิดพลาด ลองอีกครั้ง");
        return;
      }
      toast("ปฏิเสธคำขอแล้ว");
      loadFriends();
    },
    [loadFriends]
  );

  const removeFriend = useCallback(
    async (friendshipId: string) => {
      if (!user) return;
      const { error } = await supabase.from("friendships").delete().eq("id", friendshipId);
      if (error) {
        toast.error("เกิดข้อผิดพลาด");
        return;
      }
      toast.success("ลบเพื่อนแล้ว");
      loadFriends();
    },
    [user, loadFriends]
  );

  // ── Send Gift (insert first, deduct after) ──────
  const sendGift = useCallback(
    async (friendId: string, itemId?: string, coins?: number, message?: string) => {
      if (!user) return;

      // Validate friendship
      const isFriend = friends.some((f) => f.user_id === friendId && f.status === "accepted");
      if (!isFriend) {
        toast.error("ต้องเป็นเพื่อนกันก่อนถึงจะส่งของขวัญได้");
        return;
      }

      // Load sender profile
      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("coins, inventory")
        .eq("user_id", user.id)
        .single();

      if (!senderProfile) {
        toast.error("เกิดข้อผิดพลาด");
        return;
      }

      const sp = senderProfile as Record<string, unknown>;
      const currentCoins = (sp.coins as number) || 0;
      const currentInv = Array.isArray(sp.inventory) ? [...(sp.inventory as string[])] : [];

      // Validate resources
      if (coins && coins > 0 && currentCoins < coins) {
        toast.error("เหรียญไม่พอ!");
        return;
      }
      if (itemId && itemId !== "energy" && !currentInv.includes(itemId)) {
        toast.error("ไม่มีไอเทมนี้ในคลัง!");
        return;
      }

      // Step 1: Insert gift transaction FIRST
      const { error: insertErr } = await supabase.from("gift_transactions").insert({
        sender_id: user.id,
        receiver_id: friendId,
        item_id: itemId || null,
        coins: coins || 0,
        message: message || null,
      } as any);

      if (insertErr) {
        toast.error("ส่งของขวัญไม่สำเร็จ ลองอีกครั้ง");
        return;
      }

      // Step 2: Deduct from sender (gift already saved, safe to deduct)
      const updates: Record<string, unknown> = {};
      if (coins && coins > 0) {
        updates.coins = currentCoins - coins;
      }
      if (itemId && itemId !== "energy") {
        const inv = [...currentInv];
        inv.splice(inv.indexOf(itemId), 1);
        updates.inventory = inv;
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateErr } = await supabase
          .from("profiles")
          .update(updates)
          .eq("user_id", user.id);

        if (updateErr) {
          toast.error("หักเหรียญไม่สำเร็จ แต่ของขวัญส่งแล้ว");
        }
      }

      toast.success("ส่งของขวัญแล้ว! 🎁");
    },
    [user, friends]
  );

  // ── Send Energy ─────────────────────────────────
  const sendEnergy = useCallback(
    async (friendId: string): Promise<boolean> => {
      if (!user) return false;

      const friend = friends.find((f) => f.user_id === friendId);
      if (!friend || friend.lessons_completed < 1) {
        toast.error("เพื่อนต้องเรียนจบอย่างน้อย 1 บทก่อน ถึงจะเติมไฟได้");
        return false;
      }

      // Optimistic UI update first
      if (energySentToday.has(friendId)) {
        toast.error("วันนี้เติมไฟให้เพื่อนคนนี้แล้ว พรุ่งนี้มาใหม่นะ~");
        return false;
      }
      setEnergySentToday((prev) => new Set(prev).add(friendId));

      // Double-check DB to prevent duplicates
      const thaiMidnight = getThaiMidnight();
      const { data: existing } = await supabase
        .from("gift_transactions")
        .select("id")
        .eq("sender_id", user.id)
        .eq("receiver_id", friendId)
        .eq("item_id", "energy")
        .gte("created_at", thaiMidnight)
        .limit(1);

      if (existing && (existing as Record<string, string>[]).length > 0) {
        toast.error("วันนี้เติมไฟให้เพื่อนคนนี้แล้ว พรุ่งนี้มาใหม่นะ~");
        return false;
      }

      const { error } = await supabase.from("gift_transactions").insert({
        sender_id: user.id,
        receiver_id: friendId,
        item_id: "energy",
        coins: 0,
        message: "เติมไฟให้~ สู้ๆ นะ! 🔥",
      } as any);

      if (error) {
        // Rollback optimistic update
        setEnergySentToday((prev) => {
          const next = new Set(prev);
          next.delete(friendId);
          return next;
        });
        toast.error("เกิดข้อผิดพลาด ลองอีกครั้ง");
        return false;
      }

      toast.success("เติมไฟให้เพื่อนแล้ว! 🔥⚡");
      return true;
    },
    [user, friends, energySentToday]
  );

  // ── Claim Gift (DB-level guard against double claim) ──
  const claimGift = useCallback(
    async (giftId: string) => {
      if (!user) return;

      const gift = pendingGifts.find((g) => g.id === giftId);
      if (!gift) {
        toast.error("ไม่พบของขวัญนี้");
        return;
      }

      // Guard: prevent double-click
      if (claimingIds.has(giftId)) return;
      setClaimingIds((prev) => new Set(prev).add(giftId));

      // Step 1: Mark claimed at DB level first (with guard)
      const { data: claimResult, error: claimErr } = await supabase
        .from("gift_transactions")
        .update({ claimed: true } as Record<string, boolean>)
        .eq("id", giftId)
        .eq("claimed", false) // DB-level guard: only update if still unclaimed
        .select("id");

      if (claimErr || !claimResult || (claimResult as Record<string, string>[]).length === 0) {
        toast.error("ของขวัญนี้ถูกรับไปแล้ว");
        setClaimingIds((prev) => { const n = new Set(prev); n.delete(giftId); return n; });
        loadFriends();
        return;
      }

      // Step 2: Apply rewards
      const { data: profile } = await supabase
        .from("profiles")
        .select("coins, inventory, energy")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        const p = profile as Record<string, unknown>;
        const updates: Record<string, unknown> = {};
        if (gift.coins > 0) updates.coins = ((p.coins as number) || 0) + gift.coins;
        if (gift.item_id === "energy") {
          updates.energy = Math.min(5, ((p.energy as number) ?? 5) + 1);
        } else if (gift.item_id) {
          const inv = Array.isArray(p.inventory) ? (p.inventory as string[]) : [];
          updates.inventory = [...inv, gift.item_id];
        }
        if (Object.keys(updates).length > 0) {
          await supabase.from("profiles").update(updates).eq("user_id", user.id);
        }
      }

      toast.success("รับของขวัญแล้ว! 🎉");
      loadFriends();
    },
    [user, pendingGifts, claimingIds, loadFriends]
  );

  const notificationCount = pendingRequests.length + pendingGifts.length;

  return {
    friends,
    pendingRequests,
    pendingGifts,
    loading,
    notificationCount,
    energySentToday,
    claimingIds,
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
