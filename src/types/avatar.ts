export type ItemCategory =
  | 'skin'
  | 'hair'
  | 'hairColor'
  | 'hat'
  | 'shirt'
  | 'pants'
  | 'shoes'
  | 'necklace'
  | 'leftHand'
  | 'rightHand'
  | 'aura';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AvatarItem {
  id: string;
  name: string;
  nameThai: string;
  category: ItemCategory;
  price: number;
  rarity: ItemRarity;
  icon: string;
  svgProps?: {
    color?: string;
    pattern?: string;
    path?: string;
  };
}

export interface EquippedItems {
  skin: string;
  hair: string;
  hairColor: string;
  hat: string | null;
  shirt: string;
  pants: string;
  shoes: string;
  necklace: string | null;
  leftHand: string | null;
  rightHand: string | null;
  aura: string | null;
}

export const DEFAULT_EQUIPPED: EquippedItems = {
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
};
