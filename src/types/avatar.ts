export type ItemCategory = 'skin' | 'hair' | 'hairColor' | 'shirt' | 'pants' | 'shoes' | 'accessory';
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
  shirt: string;
  pants: string;
  shoes: string;
  accessory: string | null;
}

export const DEFAULT_EQUIPPED: EquippedItems = {
  skin: "skin_default",
  hair: "hair_default",
  hairColor: "haircolor_midnight",
  shirt: "shirt_default",
  pants: "pants_default",
  shoes: "shoes_default",
  accessory: null,
};
