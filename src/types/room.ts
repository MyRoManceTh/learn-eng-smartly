export type RoomItemCategory =
  | 'wallpaper'
  | 'floor'
  | 'desk'
  | 'bed'
  | 'shelf'
  | 'poster'
  | 'window'
  | 'plant'
  | 'trophy'
  | 'pet'
  | 'toy';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface RoomItem {
  id: string;
  name: string;
  nameThai: string;
  category: RoomItemCategory;
  price: number;
  rarity: ItemRarity;
  icon: string;
  pixel: string; // emoji or pixel representation
  position: { x: number; y: number }; // default position in room grid
  size: { w: number; h: number }; // grid size
  unlockedBy?: string; // achievement/mission that unlocks this
}

export interface RoomLayout {
  wallpaper: string | null;
  floor: string | null;
  items: string[]; // item ids placed in room
}

export const DEFAULT_ROOM: RoomLayout = {
  wallpaper: 'wall_basic',
  floor: 'floor_wood',
  items: [],
};
