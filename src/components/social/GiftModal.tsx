import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { getItemById } from "@/data/avatarItems";
import { toast } from "sonner";

interface Props {
  open: boolean;
  friendId: string;
  friendName: string;
  onClose: () => void;
  onSend: (
    friendId: string,
    itemId?: string,
    coins?: number,
    message?: string
  ) => Promise<void>;
  inventory: string[];
  coins: number;
}

type GiftType = "coins" | "item";

export default function GiftModal({
  open,
  friendId,
  friendName,
  onClose,
  onSend,
  inventory,
  coins,
}: Props) {
  const [giftType, setGiftType] = useState<GiftType>("coins");
  const [coinAmount, setCoinAmount] = useState(10);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Get unique inventory items with details, filter out undefined
  const inventoryItems = inventory
    .map((id) => getItemById(id))
    .filter((item): item is NonNullable<typeof item> => !!item);

  const maxCoins = Math.min(100, coins);

  const handleSend = async () => {
    if (giftType === "coins") {
      if (coinAmount < 10 || coinAmount > 100) {
        toast.error("จำนวนเหรียญต้องอยู่ระหว่าง 10-100");
        return;
      }
      if (coinAmount > coins) {
        toast.error("เหรียญไม่พอ! คุณมี " + coins + " เหรียญ");
        return;
      }
    }

    if (giftType === "item") {
      if (!selectedItem) {
        toast.error("กรุณาเลือกไอเทมที่ต้องการส่ง");
        return;
      }
    }

    setSending(true);
    try {
      await onSend(
        friendId,
        giftType === "item" ? selectedItem || undefined : undefined,
        giftType === "coins" ? coinAmount : undefined,
        message.trim() || undefined
      );
    } catch {
      toast.error("ส่งของขวัญไม่สำเร็จ ลองอีกครั้ง");
    } finally {
      setSending(false);
    }
  };

  const selectedItemData = selectedItem ? getItemById(selectedItem) : null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[340px] sm:max-w-sm p-4 gap-3">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base">🎁 ส่งของขวัญ</DialogTitle>
          <DialogDescription className="text-xs">
            ส่งของขวัญให้ <span className="font-semibold">{friendName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Gift type toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setGiftType("coins");
                setSelectedItem(null);
              }}
              className={`flex-1 rounded-lg border-2 p-2.5 text-center text-xs font-medium transition-colors ${
                giftType === "coins"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-muted bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              🪙 เหรียญ
            </button>
            <button
              onClick={() => {
                setGiftType("item");
                setCoinAmount(10);
              }}
              className={`flex-1 rounded-lg border-2 p-2.5 text-center text-xs font-medium transition-colors ${
                giftType === "item"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-muted bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              📦 ไอเทม
            </button>
          </div>

          {/* Coins section */}
          {giftType === "coins" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">จำนวนเหรียญ</span>
                <span className="text-muted-foreground">คุณมี: 🪙 {coins.toLocaleString()}</span>
              </div>
              {maxCoins >= 10 && (
                <Slider
                  value={[coinAmount]}
                  onValueChange={(v) => setCoinAmount(v[0])}
                  min={10}
                  max={maxCoins}
                  step={5}
                />
              )}
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={coinAmount}
                  onChange={(e) => {
                    const val = Math.max(10, Math.min(100, Number(e.target.value) || 10));
                    setCoinAmount(val);
                  }}
                  min={10}
                  max={maxCoins}
                  className="w-20 text-center font-bold text-sm h-8"
                />
                <span className="text-xs text-muted-foreground">เหรียญ</span>
              </div>
            </div>
          )}

          {/* Item section */}
          {giftType === "item" && (
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">เลือกไอเทมจากคลัง</span>
              {inventoryItems.length === 0 ? (
                <p className="py-3 text-center text-xs text-muted-foreground">
                  ไม่มีไอเทมในคลัง
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto">
                  {inventoryItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item.id)}
                      className={`flex flex-col items-center gap-0.5 rounded-lg border-2 p-1.5 text-center transition-colors ${
                        selectedItem === item.id
                          ? "border-primary bg-primary/10"
                          : "border-muted hover:bg-muted/30"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-[9px] leading-tight truncate w-full">
                        {item.nameThai}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Message field */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">ข้อความ (ไม่บังคับ)</span>
            <Textarea
              placeholder="เขียนข้อความถึงเพื่อน..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={100}
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          {/* Preview */}
          <div className="rounded-lg border bg-muted/20 p-2.5">
            <p className="text-[10px] text-muted-foreground mb-1">ตัวอย่าง:</p>
            <div className="flex items-center gap-2 text-sm">
              {giftType === "coins" ? (
                <span className="font-medium">🪙 {coinAmount} เหรียญ</span>
              ) : selectedItemData ? (
                <span className="font-medium">{selectedItemData.icon} {selectedItemData.nameThai}</span>
              ) : (
                <span className="text-muted-foreground text-xs">ยังไม่ได้เลือกไอเทม</span>
              )}
              <span className="text-xs text-muted-foreground">→</span>
              <span className="truncate">{friendName}</span>
            </div>
            {message.trim() && (
              <p className="mt-1 text-[10px] text-muted-foreground italic">"{message.trim()}"</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose} disabled={sending} size="sm" className="flex-1">
            ยกเลิก
          </Button>
          <Button
            onClick={handleSend}
            disabled={
              sending ||
              (giftType === "coins" && (coinAmount > coins || coins < 10)) ||
              (giftType === "item" && !selectedItem)
            }
            size="sm"
            className="flex-1"
          >
            {sending ? "กำลังส่ง..." : "ส่งของขวัญ 🎁"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
