/**
 * Integration test (vitest + jsdom) for FriendsList: exercises the real
 * useFriends hook with a fake Supabase client. Verifies the UI does NOT
 * show a success toast when DELETE returns 0 rows (no DELETE policy / RLS
 * hides the row) or returns an RLS error for both:
 *   - ปฏิเสธคำขอ (declineRequest)
 *   - ลบเพื่อน (removeFriend)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const mocks = vi.hoisted(() => {
  const toastSuccess = (...a: unknown[]) => { toastSuccess.calls.push(a); };
  toastSuccess.calls = [] as unknown[][];
  const toastError = (...a: unknown[]) => { toastError.calls.push(a); };
  toastError.calls = [] as unknown[][];
  const toastNeutral = (...a: unknown[]) => { toastNeutral.calls.push(a); };
  toastNeutral.calls = [] as unknown[][];

  // "ok" | "rls_error" | "silent"
  let deleteMode: "ok" | "rls_error" | "silent" = "ok";
  const setDeleteMode = (m: typeof deleteMode) => { deleteMode = m; };
  const deleteCalls: Array<{ id: string; mode: string }> = [];

  const USER_ID = "user-self";
  const friendships = [
    { id: "fr-accepted", requester_id: USER_ID, addressee_id: "user-friend", status: "accepted" },
    { id: "fr-pending", requester_id: "user-requester", addressee_id: USER_ID, status: "pending" },
  ];
  const profiles = [
    { user_id: "user-friend", display_name: "Friend One", total_exp: 100, current_streak: 3, equipped: {}, evolution_stage: 1, lessons_completed: 2, energy: 5 },
    { user_id: "user-requester", display_name: "Requester One", total_exp: 0, current_streak: 0, equipped: {}, evolution_stage: 1, lessons_completed: 0, energy: 5 },
  ];

  return { toastSuccess, toastError, toastNeutral, deleteMode: () => deleteMode, setDeleteMode, deleteCalls, USER_ID, friendships, profiles };
});

vi.mock("sonner", () => ({
  toast: Object.assign(mocks.toastNeutral, {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: mocks.USER_ID } }),
}));

vi.mock("@/utils/timezone", () => ({
  getThaiMidnight: () => "2026-01-01T00:00:00Z",
}));

// Stub heavy/irrelevant subtrees
vi.mock("@/components/avatar/SpriteAvatar", () => ({ default: () => null }));
vi.mock("./GiftModal", () => ({ default: () => null }));
vi.mock("./ChallengeModal", () => ({ default: () => null }));
vi.mock("@/components/DisplayNameModal", () => ({ default: () => null }));
vi.mock("@/hooks/useChallenges", () => ({
  useChallenges: () => ({ sendChallenge: vi.fn() }),
}));
vi.mock("@/hooks/useProfile", () => ({
  useProfile: () => ({
    profile: { friend_code: "ABCDEF", display_name: "Me", inventory: [], coins: 0 },
    refreshProfile: vi.fn(),
  }),
}));

vi.mock("@/integrations/supabase/client", () => {
  const friendshipsApi = () => ({
    select: () => ({
      or: () => Promise.resolve({ data: mocks.friendships, error: null }),
    }),
    delete: () => ({
      eq: (_col: string, id: string) => {
        const mode = mocks.deleteMode();
        mocks.deleteCalls.push({ id, mode });
        let result: { data: unknown; error: unknown };
        if (mode === "rls_error") {
          result = { data: null, error: { code: "42501", message: "rls denied" } };
        } else if (mode === "silent") {
          result = { data: [], error: null };
        } else {
          result = { data: [{ id }], error: null };
        }
        const p: any = Promise.resolve(result);
        p.select = () => Promise.resolve(result);
        return p;
      },
    }),
  });

  const profilesApi = () => ({
    select: () => ({
      in: () => Promise.resolve({ data: mocks.profiles, error: null }),
      eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }),
    }),
  });

  const giftsApi = () => ({
    select: () => ({
      eq: () => ({
        eq: () => ({
          gte: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
  });
  // pendingGifts query: .select("*").eq("receiver_id",..).eq("claimed",false)
  const giftsApiPending = () => ({
    select: () => ({
      eq: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  });

  // Combine gifts into one factory based on call order — simpler: always
  // return a chain that supports both shapes.
  const giftsApiBoth = () => ({
    select: () => ({
      eq: () => ({
        eq: () => {
          const r: any = Promise.resolve({ data: [], error: null });
          r.gte = () => Promise.resolve({ data: [], error: null });
          return r;
        },
      }),
    }),
  });

  return {
    supabase: {
      rpc: () => Promise.resolve({ data: null, error: null }),
      from: (table: string) => {
        if (table === "friendships") return friendshipsApi();
        if (table === "profiles") return profilesApi();
        if (table === "gift_transactions") return giftsApiBoth();
        return { select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }) }) };
      },
    },
  };
});

import FriendsList from "./FriendsList";

function renderList() {
  return render(
    <MemoryRouter>
      <FriendsList />
    </MemoryRouter>
  );
}

beforeEach(() => {
  mocks.toastSuccess.calls.length = 0;
  mocks.toastError.calls.length = 0;
  mocks.toastNeutral.calls.length = 0;
  mocks.deleteCalls.length = 0;
  mocks.setDeleteMode("ok");
});

describe("FriendsList integration — declineRequest", () => {
  it("RLS error → error toast, no success/neutral", async () => {
    mocks.setDeleteMode("rls_error");
    renderList();
    const btn = await screen.findByRole("button", { name: "ปฏิเสธ" });
    await act(async () => { btn.click(); });
    await waitFor(() => expect(mocks.deleteCalls.length).toBe(1));
    expect(mocks.toastError.calls.length).toBe(1);
    expect(mocks.toastSuccess.calls.length).toBe(0);
    expect(mocks.toastNeutral.calls.length).toBe(0);
  });

  it("0 rows affected (silent) → error toast, no success/neutral", async () => {
    mocks.setDeleteMode("silent");
    renderList();
    const btn = await screen.findByRole("button", { name: "ปฏิเสธ" });
    await act(async () => { btn.click(); });
    await waitFor(() => expect(mocks.deleteCalls.length).toBe(1));
    expect(mocks.toastError.calls.length).toBe(1);
    expect(mocks.toastSuccess.calls.length).toBe(0);
    expect(mocks.toastNeutral.calls.length).toBe(0);
  });

  it("happy path → neutral notice toast", async () => {
    renderList();
    const btn = await screen.findByRole("button", { name: "ปฏิเสธ" });
    await act(async () => { btn.click(); });
    await waitFor(() => expect(mocks.deleteCalls.length).toBe(1));
    expect(mocks.toastError.calls.length).toBe(0);
    expect(mocks.toastNeutral.calls.length).toBeGreaterThanOrEqual(1);
  });
});

describe("FriendsList integration — removeFriend", () => {
  async function openConfirmAndClick() {
    const friendNameEl = await screen.findByText("Friend One");
    // The remove (UserMinus) button is the icon-only ghost button in the
    // friend's row. Find it relative to the friend card.
    const row = friendNameEl.closest("div.rounded-xl");
    expect(row).toBeTruthy();
    const iconButtons = row!.querySelectorAll("button");
    // Last button in the row is the remove icon (before confirm appears)
    const removeBtn = iconButtons[iconButtons.length - 1] as HTMLButtonElement;
    await act(async () => { removeBtn.click(); });
    const confirm = await screen.findByRole("button", { name: "ยืนยัน" });
    await act(async () => { confirm.click(); });
  }

  it("RLS error → error toast, no success", async () => {
    mocks.setDeleteMode("rls_error");
    renderList();
    await openConfirmAndClick();
    await waitFor(() => expect(mocks.deleteCalls.length).toBe(1));
    expect(mocks.toastError.calls.length).toBe(1);
    expect(mocks.toastSuccess.calls.length).toBe(0);
  });

  it("0 rows affected (silent) → error toast, no success", async () => {
    mocks.setDeleteMode("silent");
    renderList();
    await openConfirmAndClick();
    await waitFor(() => expect(mocks.deleteCalls.length).toBe(1));
    expect(mocks.toastError.calls.length).toBe(1);
    expect(mocks.toastSuccess.calls.length).toBe(0);
  });

  it("happy path → success toast", async () => {
    renderList();
    await openConfirmAndClick();
    await waitFor(() => expect(mocks.deleteCalls.length).toBe(1));
    expect(mocks.toastError.calls.length).toBe(0);
    expect(mocks.toastSuccess.calls.length).toBe(1);
  });
});
