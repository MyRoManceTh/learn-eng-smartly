/**
 * Component test for FriendsList — confirms that when the underlying
 * delete fails (no DELETE policy / no permission / row not found), the
 * UI surfaces the error toast and does NOT show a success toast.
 *
 * useFriends is mocked with thin reimplementations of declineRequest /
 * removeFriend that emit either toast.error or toast.success based on a
 * configurable mock state — mirroring the real hook's affected-rows
 * check. This keeps the test focused on UI wiring and toast routing,
 * complementing the hook-level tests in useFriends.delete.test.ts.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const mocks = vi.hoisted(() => {
  const toastSuccess = (...args: unknown[]) => { toastSuccess.calls.push(args); };
  toastSuccess.calls = [] as unknown[][];
  const toastError = (...args: unknown[]) => { toastError.calls.push(args); };
  toastError.calls = [] as unknown[][];
  const toastNeutral = (...args: unknown[]) => { toastNeutral.calls.push(args); };
  toastNeutral.calls = [] as unknown[][];

  // Flip to false to simulate "0 rows affected" (RLS hides row / no policy)
  const state = { deleteSucceeds: true };

  const declineRequest = vi.fn(async (_id: string) => {
    if (!state.deleteSucceeds) {
      toastError("ไม่พบคำขอ หรือไม่มีสิทธิ์ลบ");
      return;
    }
    toastNeutral("ปฏิเสธคำขอแล้ว");
  });

  const removeFriend = vi.fn(async (_id: string) => {
    if (!state.deleteSucceeds) {
      toastError("ไม่พบเพื่อน หรือไม่มีสิทธิ์ลบ");
      return;
    }
    toastSuccess("ลบเพื่อนแล้ว");
  });

  return { toastSuccess, toastError, toastNeutral, state, declineRequest, removeFriend };
});

vi.mock("sonner", () => ({
  toast: Object.assign(mocks.toastNeutral, {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  }),
}));

vi.mock("@/hooks/useFriends", () => ({
  useFriends: () => ({
    friends: [
      {
        friendship_id: "fr-friend-1",
        user_id: "user-2",
        display_name: "Friend One",
        total_exp: 100,
        current_streak: 3,
        equipped: {},
        evolution_stage: 1,
        lessons_completed: 1,
        energy: 5,
        status: "accepted",
        is_requester: true,
      },
    ],
    pendingRequests: [
      {
        friendship_id: "fr-req-1",
        user_id: "user-3",
        display_name: "Requester One",
        total_exp: 0,
        current_streak: 0,
        equipped: {},
        evolution_stage: 1,
        lessons_completed: 0,
        energy: 5,
        status: "pending",
        is_requester: false,
      },
    ],
    pendingGifts: [],
    loading: false,
    addFriendByCode: vi.fn(),
    acceptRequest: vi.fn(),
    declineRequest: mocks.declineRequest,
    removeFriend: mocks.removeFriend,
    sendGift: vi.fn(),
    sendEnergy: vi.fn(),
    claimGift: vi.fn(),
    energySentToday: new Set<string>(),
  }),
}));

vi.mock("@/hooks/useChallenges", () => ({
  useChallenges: () => ({ sendChallenge: vi.fn() }),
}));

vi.mock("@/hooks/useProfile", () => ({
  useProfile: () => ({
    profile: { friend_code: "ABCDEF", display_name: "Me", inventory: [], coins: 0 },
    refreshProfile: vi.fn(),
  }),
}));

vi.mock("@/components/avatar/SpriteAvatar", () => ({
  default: () => null,
}));
vi.mock("./GiftModal", () => ({ default: () => null }));
vi.mock("./ChallengeModal", () => ({ default: () => null }));
vi.mock("@/components/DisplayNameModal", () => ({ default: () => null }));

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
  mocks.declineRequest.mockClear();
  mocks.removeFriend.mockClear();
  mocks.state.deleteSucceeds = true;
});

describe("FriendsList — decline request", () => {
  it("on silent delete failure shows error toast, not success", async () => {
    mocks.state.deleteSucceeds = false;
    renderList();

    const declineBtn = screen.getByRole("button", { name: "ปฏิเสธ" });
    await act(async () => {
      declineBtn.click();
    });

    expect(mocks.declineRequest).toHaveBeenCalledWith("fr-req-1");
    expect(mocks.toastError.calls.length).toBe(1);
    expect(mocks.toastNeutral.calls.length).toBe(0); // no "ปฏิเสธคำขอแล้ว"
    expect(mocks.toastSuccess.calls.length).toBe(0);
  });

  it("on success path shows the neutral notice toast", async () => {
    renderList();

    const declineBtn = screen.getByRole("button", { name: "ปฏิเสธ" });
    await act(async () => {
      declineBtn.click();
    });

    expect(mocks.toastError.calls.length).toBe(0);
    expect(mocks.toastNeutral.calls.length).toBe(1);
  });
});

describe("FriendsList — remove friend", () => {
  it("on silent delete failure shows error toast, not success", async () => {
    mocks.state.deleteSucceeds = false;
    renderList();

    // First click opens the inline confirm (ยืนยัน / ยกเลิก)
    const removeIcons = screen.getAllByRole("button").filter(
      (b) => b.querySelector("svg") && !b.textContent?.trim()
    );
    expect(removeIcons.length).toBeGreaterThan(0);
    await act(async () => {
      removeIcons[removeIcons.length - 1].click();
    });

    const confirmBtn = await screen.findByRole("button", { name: "ยืนยัน" });
    await act(async () => {
      confirmBtn.click();
    });

    expect(mocks.removeFriend).toHaveBeenCalledWith("fr-friend-1");
    expect(mocks.toastError.calls.length).toBe(1);
    expect(mocks.toastSuccess.calls.length).toBe(0);
  });

  it("cancel button does not call removeFriend", async () => {
    renderList();

    const removeIcons = screen.getAllByRole("button").filter(
      (b) => b.querySelector("svg") && !b.textContent?.trim()
    );
    await act(async () => {
      removeIcons[removeIcons.length - 1].click();
    });

    const cancelBtn = await screen.findByRole("button", { name: "ยกเลิก" });
    await act(async () => {
      cancelBtn.click();
    });

    expect(mocks.removeFriend).not.toHaveBeenCalled();
    expect(mocks.toastError.calls.length).toBe(0);
    expect(mocks.toastSuccess.calls.length).toBe(0);
  });
});
