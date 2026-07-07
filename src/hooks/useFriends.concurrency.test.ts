/**
 * Integration tests for concurrency-safety of the friends system.
 *
 * Simulates the *server* atomicity guarantees we rely on:
 *   - `claim_gift` RPC: only the first concurrent call returns ok=true.
 *   - friendships insert: a second insert for the same normalized pair
 *     returns Postgres error 23505.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

// vi.mock factories are hoisted; share state via vi.hoisted()
const mocks = vi.hoisted(() => {
  type FakeRow = Record<string, unknown>;
  const db: { gifts: FakeRow[]; friendships: FakeRow[]; profiles: FakeRow[] } = {
    gifts: [],
    friendships: [],
    profiles: [{ user_id: "user-1", coins: 0, inventory: [], energy: 5 }],
  };

  const toastSuccess = (...args: unknown[]) => {
    toastSuccess.calls.push(args);
  };
  toastSuccess.calls = [] as unknown[][];
  const toastError = (...args: unknown[]) => {
    toastError.calls.push(args);
  };
  toastError.calls = [] as unknown[][];

  const claimGiftRpc = async ({ _gift_id }: { _gift_id: string }) => {
    claimGiftRpc.calls.push(_gift_id);
    const row = db.gifts.find((g) => g.id === _gift_id) as
      | (FakeRow & { claimed: boolean; coins: number; item_id?: string })
      | undefined;
    if (!row || row.claimed) {
      return { data: { ok: false, reason: "already_claimed" }, error: null };
    }
    row.claimed = true; // atomic flip
    const profile = db.profiles[0] as FakeRow & { coins: number };
    profile.coins = (profile.coins ?? 0) + (row.coins ?? 0);
    return { data: { ok: true, coins: row.coins, item_id: row.item_id }, error: null };
  };
  claimGiftRpc.calls = [] as string[];

  const friendshipsInsert = (row: any) => {
    const pair = [row.requester_id as string, row.addressee_id as string]
      .sort()
      .join("|");
    const exists = db.friendships.some(
      (f) =>
        [f.requester_id as string, f.addressee_id as string].sort().join("|") === pair
    );
    if (exists) {
      return Promise.resolve({
        data: null,
        error: { code: "23505", message: "duplicate key value violates unique constraint" },
      });
    }
    db.friendships.push({ ...row, id: `f-${db.friendships.length + 1}` });
    return Promise.resolve({ data: null, error: null });
  };

  return { db, toastSuccess, toastError, claimGiftRpc, friendshipsInsert };
});

vi.mock("sonner", () => ({
  toast: Object.assign(mocks.toastError, {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  }),
}));

const { STABLE_USER } = vi.hoisted(() => ({ STABLE_USER: { id: "user-1" } }));
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: STABLE_USER }),
}));

vi.mock("@/utils/timezone", () => ({
  getThaiMidnight: () => "2026-01-01T00:00:00Z",
}));

vi.mock("@/integrations/supabase/client", () => {
  const profileSelectChain = () => ({
    eq: () => ({
      maybeSingle: () => Promise.resolve({ data: { user_id: "user-2" } }),
    }),
  });

  return {
    supabase: {
      rpc: (fn: string, args: Record<string, unknown>) => {
        if (fn === "claim_gift") return mocks.claimGiftRpc(args as any);
        // addFriendByCode resolves the target via this SECURITY DEFINER RPC.
        if (fn === "get_user_id_by_friend_code") {
          return Promise.resolve({ data: [{ user_id: "user-2" }], error: null });
        }
        return Promise.resolve({ data: null, error: null });
      },
      from: (table: string) => {
        if (table === "friendships") {
          return {
            select: () => ({
              // loadFriends path
              or: (_filter: string) => {
                const chain: any = Promise.resolve({ data: [], error: null });
                // addFriendByCode existence check uses .or(...).maybeSingle()
                chain.maybeSingle = () => Promise.resolve({ data: null, error: null });
                return chain;
              },
            }),
            insert: mocks.friendshipsInsert,
          };
        }
        if (table === "profiles") {
          return { select: profileSelectChain };
        }
        if (table === "gift_transactions") {
          return {
            select: () => ({
              eq: () => ({
                eq: () => Promise.resolve({ data: [], error: null }),
              }),
            }),
          };
        }
        return {
          select: profileSelectChain,
          insert: () => Promise.resolve({ data: null, error: null }),
        };
      },
    },
  };
});

import { useFriends } from "./useFriends";

beforeEach(() => {
  mocks.toastSuccess.calls.length = 0;
  mocks.toastError.calls.length = 0;
  mocks.claimGiftRpc.calls.length = 0;
  mocks.db.gifts.length = 0;
  mocks.db.friendships.length = 0;
  mocks.db.profiles[0] = { user_id: "user-1", coins: 0, inventory: [], energy: 5 };
});

describe("claimGift concurrency", () => {
  it("two simultaneous claims credit rewards exactly once", async () => {
    mocks.db.gifts.push({
      id: "gift-1",
      receiver_id: "user-1",
      sender_id: "user-2",
      coins: 50,
      item_id: null,
      claimed: false,
    });

    const { result } = renderHook(() => useFriends());

    await act(async () => {
      await Promise.all([
        result.current.claimGift("gift-1"),
        result.current.claimGift("gift-1"),
      ]);
    });

    // Exactly one success toast even though two callers raced.
    expect(mocks.toastSuccess.calls.length).toBe(1);
    // Coins credited exactly once.
    expect((mocks.db.profiles[0] as any).coins).toBe(50);
  });

  it("a second sequential claim is rejected as already-claimed", async () => {
    mocks.db.gifts.push({
      id: "gift-2",
      receiver_id: "user-1",
      sender_id: "user-2",
      coins: 10,
      claimed: false,
    });

    const { result } = renderHook(() => useFriends());

    await act(async () => {
      await result.current.claimGift("gift-2");
    });
    await act(async () => {
      await result.current.claimGift("gift-2");
    });

    expect(mocks.toastSuccess.calls.length).toBe(1);
    expect(mocks.toastError.calls.length).toBeGreaterThan(0);
    expect((mocks.db.profiles[0] as any).coins).toBe(10);
  });
});

describe("addFriendByCode concurrency", () => {
  it("simultaneous requests create only one friendship row", async () => {
    const { result } = renderHook(() => useFriends());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await Promise.all([
        result.current.addFriendByCode("ABCDEF"),
        result.current.addFriendByCode("ABCDEF"),
      ]);
    });

    expect(mocks.db.friendships.length).toBe(1);
    expect(mocks.toastSuccess.calls.length).toBe(1);
    expect(mocks.toastError.calls.length).toBeGreaterThan(0);
  });
});
