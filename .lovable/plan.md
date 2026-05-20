## ขอบเขต
- 91 ไฟล์ / 1,114 จุดที่มี emoji กระจายอยู่ใน components, pages, data files, edge functions
- emoji ที่ใช้บ่อย: 🔥(40) 🪙(38) ✨(30) 🎉(29) 📚(28) 📖(26) ⚡(24) 📝/🏆(20) ⚔(20) 🎁/✅(15) 🥚/🎯(14) ฯลฯ รวมประมาณ 120 emoji ไม่ซ้ำ
- ใช้ `lucide-react` ที่มีอยู่แล้วในโปรเจกต์

## แนวทาง (3 เฟส)

### เฟส 1 — สร้างโครงสร้างกลาง
1. สร้าง `src/components/ui/EmojiIcon.tsx` — component เดียวรับ prop `name` (key) → render lucide icon ที่ map ไว้ พร้อม size/className
2. สร้าง `src/lib/emojiIconMap.ts` — ตาราง map ครอบคลุม:
   - **Gamification**: 🔥→Flame, 🪙→Coins, ⚡→Zap, ✨→Sparkles, 🎉→PartyPopper, 🏆→Trophy, 🎯→Target, 🎁→Gift, 💎→Gem, ⭐→Star, ✅→CheckCircle, ❌→XCircle
   - **เนื้อหา**: 📚→BookOpen, 📖→Book, 📝→PencilLine, 📊→BarChart3, 🎓→GraduationCap, 🗺→Map, 🧠→Brain
   - **Social/Shop**: 🛒→ShoppingCart, 👥→Users, 💬→MessageCircle, 🤝→Handshake, 👑→Crown, 🥇/🥈/🥉→Medal (สี gold/silver/bronze)
   - **อื่นๆ**: 🐉→ใช้ lucide-lab หรือ inline SVG, 🎮→Gamepad2, 🎧→Headphones, 🔒→Lock, 🚀→Rocket, 🏠→Home, 📱→Smartphone, 🌟→Star, 💪→Dumbbell, 🌍→Globe, ❤→Heart, 💜→Heart(purple) ฯลฯ
   - emoji ที่ไม่มี icon ตรงๆ (เช่น 🥚 🐣 🐥 🦅 🐾 🐱 🌸 🌱 🌿 🌲) → ใช้ icon ใกล้เคียง (Egg, Bird, PawPrint, Cat, Flower2, Sprout, Leaf, Trees) ทั้งหมดมีใน lucide
2. หาก emoji ใดไม่มี mapping → fallback render เป็น emoji เดิม + log warning (ไม่พัง UI)

### เฟส 2 — Refactor JSX/TSX (ใช้โดยตรง)
- 80 ไฟล์ใน `src/` (components/pages/hooks) — แทน string literal emoji ใน JSX และ template ด้วย `<EmojiIcon name="flame" />` หรือ import lucide icon ตรงๆ ตามบริบท
- ทำเป็นกลุ่มตามโฟลเดอร์: `components/daily/*`, `components/avatar/*`, `components/social/*`, `components/events/*`, `components/skilltree/*`, `components/room/*`, `components/classroom/*`, `components/library/*`, `components/profile/*`, `components/premium/*`, `components/notifications/*`, `components/gacha/*`, `pages/*`, `hooks/*`, ไฟล์เดี่ยวระดับบน
- ปรับ size/สี ให้เข้ากับบริบทเดิม (เช่น 🔥 ใน StreakFireDisplay เป็น `Flame` สีส้ม ขนาด match ขนาด emoji เดิม)

### เฟส 3 — Data files & edge functions
- ไฟล์ `src/data/*.ts` (achievements, avatarItems, gachaItems, shopItems, roomItems, missionTemplates, classroomZones, evolutionStages, pathNodes, skillTreeData ฯลฯ): เปลี่ยน field `icon: "🔥"` → ใช้ key string เช่น `"flame"` แล้วให้ component ที่ render ใช้ `<EmojiIcon name={item.icon} />`
- Edge functions `line-webhook`, `daily-reminder`: emoji ใช้ใน LINE message — **เก็บไว้เป็น emoji** เพราะส่งออกทาง LINE chat ไม่ใช่ UI (LINE ไม่ render SVG ในข้อความ)
- ไฟล์ `src/utils/adaptiveReview.ts` ที่ใช้ emoji ใน string log — เก็บไว้เช่นกัน

## รายละเอียดทางเทคนิค
- `EmojiIcon.tsx`:
  ```tsx
  type Props = { name: string; className?: string; size?: number };
  export const EmojiIcon = ({ name, className, size = 20 }: Props) => {
    const Icon = ICON_MAP[name];
    if (!Icon) return <span className={className}>{name}</span>;
    return <Icon size={size} className={className} aria-hidden />;
  };
  ```
- map key ใช้ทั้ง emoji char (`"🔥"`) และ semantic key (`"flame"`) เพื่อรองรับทั้ง 2 รูปแบบใน data files
- ใช้ codemod script (ใน /tmp) สแกนทุก `.tsx`/`.ts` และแทน emoji literal ที่อยู่ในตำแหน่ง JSX text node หรือใน string prop ที่เป็น icon — แต่ต้อง review ทีละกลุ่ม ไม่ replace แบบเหวี่ยงแห เพื่อรักษา layout/สไตล์

## สิ่งที่ **ไม่** เปลี่ยน
- emoji ในข้อความ LINE notification (edge functions)
- emoji ในไฟล์ doc/markdown
- emoji ใน comment ของ source code

## เวอร์ชันส่ง
- งานชุดใหญ่จะส่งเป็น 3 รอบ commit (เฟส 1 → 2 → 3) เพื่อให้ตรวจง่าย
- หลังเฟส 1 จะให้คุณดู `EmojiIcon` + map ก่อนเริ่ม refactor วงกว้าง

ยืนยันให้เริ่มเฟส 1 ได้เลย หรืออยากปรับ scope/mapping ส่วนไหนก่อนครับ?
