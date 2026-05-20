/**
 * Edge-case tests for the friends system.
 *
 * Covers:
 *  - claimGift on a gift owned by a different receiver
 *  - claimGift on a non-existent gift
 *  - addFriendByCode with invalid format (multiple shapes)
 *  - addFriendByCode for a non-existent friend code
 *  - addFriendByCode against own friend code (self-add)
 *  - addFriendByCode when a friendship already exists (accepted / pending)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

const mocks = vi.hoisted(() => {
  type FakeRow = Record<string, unknown>;
  const db: {
    gifts: FakeRow[];
    friendships: FakeRow[];
    profiles: FakeRow[];
    // friend-code → profile row used by addFriendByCode lookup
    friendCodeIndex: Record<string, FakeRow | null>;
    // existing friendship row returned by the .or().maybeSingle() existence check
    existingFriendship: FakeRow | null;
  } = {
    gifts: [],
    friendships: [],
    profiles: [{ user_id: "user-1", coins: 0, inventory: [], energy: 5 }],
    friendCodeIndex: {},
    existingFriendship: null,
  };

  const toastSuccess = (...args: unknown[]) => {
    toastSuccess.calls.push(args);
  };
  toastSuccess.calls = [] as unknown[][];
  const toastError = (...args: unknown[]) => {
    toastError.calls.push(args);
  };
  toastError.calls = [] as unknown[][];

  // Simulates the RPC. The real Postgres function uses RLS
  // (auth.uid() = receiver_id) so an UPDATE with a wrong receiver matches 0
  // rows; we mirror that by returning ok:false.
  const claimGiftRpc = async ({ _gift_id }: { _gift_id: string }) => {
    claimGiftRpc.calls.push(_gift_id);
    const row = db.gifts.find((g) => g.id === _gift_id) as
      | (FakeRow & { claimed: boolean; coins: number; receiver_id: string; item_id?: string })
      | undefined;
    if (!row) {
      return { data: { ok: false, reason: "not_found" }, error: null };
    }
    if (row.receiver_id !== "user-1") {
      return { data: { ok: false, reason: "not_receiver" }, error: null };
    }
    if (row.claimed) {
      return { data: { ok: false, reason: "already_claimed" }, error: null };
    }
    row.claimed = true;
    const profile = db.profiles[0] as FakeRow & { coins: number };
    profile.coins = (profile.coins ?? 0) + (row.coins ?? 0);
    return { data: { ok: true, coins: row.coins, item_id: row.item_id }, error: null };
  };
  claimGiftRpc.calls = [] as string[];

  const friendshipsInsert = vi.fn((row: any) => {
    db.friendships.push({ ...row, id: `f-${db.friendships.length + 1}` });
    return Promise.resolve({ data: null, error: null });
  });

  return {
    db,
    toastSuccess,
    toastError,
    claimGiftRpc,
    friendshipsInsert,
  };
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
  // profile lookup by friend_code
  const profileSelectChain = () => ({
    eq: (_col: string, value: string) => ({
      maybeSingle: () =>
        Promise.resolve({
          data: mocks.db.friendCodeIndex[value] ?? null,
          error: null,
        }),
    }),
  });

  return {
    supabase: {
      rpc: (fn: string, args: Record<string, unknown>) => {
        if (fn === "claim_gift") return mocks.claimGiftRpc(args as any);
        return Promise.resolve({ data: null, error: null });
      },
      from: (table: string) => {
        if (table === "friendships") {
          return {
            select: () => ({
              or: (_filter: string) => {
                // loadFriends path → list; existence check → maybeSingle
                const chain: any = Promise.resolve({ data: [], error: null });
                chain.maybeSingle = () =>
                  Promise.resolve({ data: mocks.db.existingFriendship, error: null });
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
  mocks.db.friendCodeIndex = {};
  mocks.db.existingFriendship = null;
  mocks.friendshipsInsert.mockClear();
});

describe("claimGift edge cases", () => {
  it("rejects a gift whose receiver_id is someone else and does not credit coins", async () => {
    mocks.db.gifts.push({
      id: "gift-other",
      receiver_id: "user-999", // not us
      sender_id: "user-2",
      coins: 100,
      claimed: false,
    });

    const { result } = renderHook(() => useFriends());

    await act(async () => {
      await result.current.claimGift("gift-other");
    });

    expect(mocks.toastSuccess.calls.length).toBe(0);
    expect(mocks.toastError.calls.length).toBeGreaterThan(0);
    // The gift remains unclaimed and no coins were credited.
    expect((mocks.db.gifts[0] as any).claimed).toBe(false);
    expect((mocks.db.profiles[0] as any).coins).toBe(0);
  });

  it("rejects a non-existent gift id", async () => {
    const { result } = renderHook(() => useFriends());

    await act(async () => {
      await result.current.claimGift("does-not-exist");
    });

    expect(mocks.toastSuccess.calls.length).toBe(0);
    expect(mocks.toastError.calls.length).toBeGreaterThan(0);
    expect((mocks.db.profiles[0] as any).coins).toBe(0);
  });
});

describe("addFriendByCode invalid input", () => {
  it.each([
    ["", "empty"],
    ["abc", "too short"],
    ["ABCDE", "5 chars"],
    ["ABCDEFG", "7 chars"],
    ["ABCD1!", "illegal symbol"],
    ["ABCD01", "contains 0 and 1 (ambiguous)"],
  ])("rejects %p (%s) without hitting friendships.insert", async (input) => {
    const { result } = renderHook(() => useFriends());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.addFriendByCode(input);
    });

    expect(ok).toBe(false);
    expect(mocks.toastSuccess.calls.length).toBe(0);
    expect(mocks.toastError.calls.length).toBeGreaterThan(0);
    expect(mocks.friendshipsInsert).not.toHaveBeenCalled();
    expect(mocks.db.friendships.length).toBe(0);
  });

  it("trims and uppercases input before validating", async () => {
    mocks.db.friendCodeIndex["ABCDEF"] = { user_id: "user-2" };

    const { result } = renderHook(() => useFriends());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.addFriendByCode("  abcdef  ");
    });

    expect(ok).toBe(true);
    expect(mocks.db.friendships.length).toBe(1);
    expect(mocks.toastSuccess.calls.length).toBe(1);
  });
});

describe("addFriendByCode lookup errors", () => {
  it("returns false with error toast when friend code is not found", async () => {
    // friendCodeIndex empty → maybeSingle returns null
    const { result } = renderHook(() => useFriends());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.addFriendByCode("ZZZZZZ");
    });

    expect(ok).toBe(false);
    expect(mocks.toastError.calls.length).toBeGreaterThan(0);
    expect(mocks.friendshipsInsert).not.toHaveBeenCalled();
  });

  it("rejects adding yourself", async () => {
    mocks.db.friendCodeIndex["SELF22"] = { user_id: "user-1" };

    const { result } = renderHook(() => useFriends());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.addFriendByCode("SELF22");
    });

    expect(ok).toBe(false);
    expect(mocks.toastError.calls.length).toBeGreaterThan(0);
    expect(mocks.friendshipsInsert).not.toHaveBeenCalled();
  });

  it("rejects when an accepted friendship already exists", async () => {
    mocks.db.friendCodeIndex["FRIEND"] = { user_id: "user-2" };
    mocks.db.existingFriendship = { id: "f-existing", status: "accepted" };

    const { result } = renderHook(() => useFriends());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.addFriendByCode("FRIEND");
    });

    expect(ok).toBe(false);
    expect(mocks.toastError.calls.length).toBeGreaterThan(0);
    expect(mocks.friendshipsInsert).not.toHaveBeenCalled();
  });

  it("rejects when a pending friendship already exists", async () => {
    mocks.db.friendCodeIndex["PENDIG"] = { user_id: "user-2" };
    mocks.db.existingFriendship = { id: "f-existing", status: "pending" };

    const { result } = renderHook(() => useFriends());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.addFriendByCode("PENDIG");
    });

    expect(ok).toBe(false);
    expect(mocks.toastError.calls.length).toBeGreaterThan(0);
    expect(mocks.friendshipsInsert).not.toHaveBeenCalled();
  });
});
