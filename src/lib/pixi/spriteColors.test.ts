/**
 * Regression tests for avatar equip resolvers.
 *
 * These guard the exact bug that shipped: resolveHatId() was stubbed to always
 * return null (and resolveAccessoryId read the wrong slot), so equipped hats and
 * necklaces never rendered on the active SpriteAvatar even though the draw code
 * existed. If someone stubs these again, these tests fail loudly.
 */

import { describe, it, expect } from "vitest";
import type { EquippedItems } from "@/types/avatar";
import {
  resolveHatId,
  resolveAccessoryId,
  resolveHatColor,
  resolveAccessoryColor,
} from "./spriteColors";

const base: EquippedItems = {
  skin: "skin_default",
  hair: "hair_default",
  hairColor: "haircolor_midnight",
  hat: null,
  shirt: "shirt_default",
  pants: "pants_default",
  shoes: "shoes_default",
  necklace: null,
  leftHand: null,
  rightHand: null,
  aura: null,
} as unknown as EquippedItems;

describe("resolveHatId", () => {
  it("returns the equipped hat id so the hat overlay is drawn", () => {
    expect(resolveHatId({ ...base, hat: "hat_beret" })).toBe("hat_beret");
  });

  it("returns null when no hat is equipped", () => {
    expect(resolveHatId(base)).toBeNull();
  });
});

describe("resolveAccessoryId", () => {
  it("reads the necklace slot (not rightHand) for the accessory overlay", () => {
    const eq = { ...base, necklace: "neck_heart", rightHand: "right_sword" };
    expect(resolveAccessoryId(eq)).toBe("neck_heart");
  });

  it("returns null when no necklace is equipped", () => {
    expect(resolveAccessoryId({ ...base, rightHand: "right_sword" })).toBeNull();
  });
});

describe("equip colors", () => {
  it("derives hat color from the equipped item, not a hardcoded value", () => {
    // hat_crown is defined with color #FFD700 in avatarItems.
    expect(resolveHatColor({ ...base, hat: "hat_crown" }).toLowerCase()).toBe("#ffd700");
  });

  it("derives necklace color from the equipped item", () => {
    // neck_star is defined with color #FFD700.
    expect(resolveAccessoryColor({ ...base, necklace: "neck_star" }).toLowerCase()).toBe("#ffd700");
  });
});
