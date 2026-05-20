/**
 * Integration tests for concurrency-safety of the friends system.
 *
 * We simulate the *server* atomicity guarantees we rely on:
 *   - `claim_gift` RPC: only the first concurrent call returns ok=true;
 *     subsequent calls get { ok: false, reason: 'already_claimed' }.
 *   - friendships insert: the normalized unique index returns Postgres
 *     error 23505 on the second insert for the same pair.
 *
 * Then we fire two simultaneous user actions and assert the client hook
 * never produces a double success / duplicate row.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

// ── Mocks ──────────────────────────────────────────────────────────────
const toastSuccess = vi.fn();
const toastError = vi.fn();

vi.mock("sonner", () => ({
  toast: Object.assign(toastError, {
    success: (...a: unknown[]) => toastSuccess(...a),
    error: (...a: unknown[]) => toastError(...a),
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}));

// Holds the mutable mock DB state and method handlers
type FakeRow = Record<string, unknown>;
const db: { gifts: FakeRow[]; friendships: FakeRow[]; profiles: FakeRow[] } = {
  gifts: [],
  friendships: [],
  profiles: [{ user_id: "user-1", coins: 0, inventory: [], energy: 5 }],
};

// Shared "lock" so concurrent claim_gift RPC calls serialize, mimicking
// PostgreSQL's row-level lock + the UPDATE ... WHERE claimed=false guard.
const claimGiftRpc = vi.fn(async ({ _gift_id }: { _gift_id: string }) => {
  const row = db.gifts.find((g) => g.id === _gift_id) as
    | (FakeRow & { claimed: boolean; coins: number; item_id?: string })
    | undefined;
  if (!row || row.claimed) {
    return { data: { ok: false, reason: "already_claimed" }, error: null };
  }
  row.claimed = true; // atomic flip
  // Apply rewards atomically (we ignore failure paths for this test)
  const profile = db.profiles[0] as FakeRow & { coins: number };
  profile.coins = (profile.coins ?? 0) + (row.coins ?? 0);
  return { data: { ok: true, coins: row.coins, item_id: row.item_id }, error: null };
});

// friendships insert simulation: second insert for the same normalized pair
// throws Postgres unique-violation (23505), matching our DB index.
const friendshipsInsert = vi.fn((row: FakeRow) => {
  const pair = [row.requester_id as string, row.addressee_id as string].sort().join("|");
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
});

vi.mock("@/integrations/supabase/client", () => {
  const select = () => ({
    eq: () => ({ maybeSingle: () => Promise.resolve({ data: { user_id: "user-2" } }) }),
    or: () => Promise.resolve({ data: [], error: null }),
    in: () => Promise.resolve({ data: [], error: null }),
    gte: () => Promise.resolve({ data: [], error: null }),
  });
  return {
    supabase: {
      rpc: (fn: string, args: Record<string, unknown>) => {
        if (fn === "claim_gift") return claimGiftRpc(args as any);
        return Promise.resolve({ data: null, error: null });
      },
      from: (table: string) => {
        if (table === "friendships") {
          return {
            select: () => ({
              or: () => Promise.resolve({ data: [], error: null }),
            }),
            insert: friendshipsInsert,
          };
        }
        if (table === "profiles") return { select };
        if (table === "gift_transactions") {
          return {
            select: () => ({
              eq: () => ({
                eq: () => Promise.resolve({ data: [], error: null }),
              }),
            }),
          };
        }
        return { select, insert: () => Promise.resolve({ data: null, error: null }) };
      },
    },
  };
});

vi.mock("@/utils/timezone", () => ({ getThaiMidnight: () => "2026-01-01T00:00:00Z" }));

import { useFriends } from "./useFriends";

beforeEach(() => {
  toastSuccess.mockClear();
  toastError.mockClear();
  claimGiftRpc.mockClear();
  friendshipsInsert.mockClear();
  db.gifts.length = 0;
  db.friendships.length = 0;
  db.profiles[0] = { user_id: "user-1", coins: 0, inventory: [], energy: 5 };
});

describe("claimGift concurrency", () => {
  it("two simultaneous claims of the same gift produce exactly one success", async () => {
    db.gifts.push({
      id: "gift-1",
      receiver_id: "user-1",
      sender_id: "user-2",
      coins: 50,
      item_id: null,
      claimed: false,
    });

    const { result } = renderHook(() => useFriends());

    await act(async () => {
      await Promise.all([result.current.claimGift("gift-1"), result.current.claimGift("gift-1")]);
    });

    // The atomic RPC must only "succeed" once even though it was called twice.
    const okResults = claimGiftRpc.mock.results.filter(
      (r) => (r.value as any).then === undefined && false
    );
    // Inspect resolved values instead (mock returns promises)
    const resolved = await Promise.all(claimGiftRpc.mock.results.map((r) => r.value));
    const successes = resolved.filter((v) => (v as any).data?.ok === true);
    expect(successes.length).toBe(1);

    // UI: exactly one success toast (and zero or one "already claimed" toast)
    expect(toastSuccess).toHaveBeenCalledTimes(1);

    // Coins credited exactly once
    expect((db.profiles[0] as any).coins).toBe(50);
  });

  it("a single claim then a retry shows already-claimed on second attempt", async () => {
    db.gifts.push({
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

    expect(toastSuccess).toHaveBeenCalledTimes(1);
    expect(toastError).toHaveBeenCalled();
    expect((db.profiles[0] as any).coins).toBe(10);
  });
});

describe("addFriendByCode concurrency", () => {
  it("two simultaneous requests to the same friend code create only one friendship", async () => {
    const { result } = renderHook(() => useFriends());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await Promise.all([
        result.current.addFriendByCode("ABCDEF"),
        result.current.addFriendByCode("ABCDEF"),
      ]);
    });

    // Only one row inserted, even though insert() was called twice.
    expect(db.friendships.length).toBe(1);

    // Exactly one success, the other gets the duplicate toast.
    expect(toastSuccess).toHaveBeenCalledTimes(1);
    expect(toastError).toHaveBeenCalled();
  });
});
