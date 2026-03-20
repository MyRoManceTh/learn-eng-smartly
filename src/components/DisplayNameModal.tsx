import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

function looksLikeBadName(name: string | null | undefined): boolean {
  if (!name) return true;
  if (name.includes("@")) return true;
  if (name.startsWith("line_u")) return true;
  if (name.length > 40) return true;
  return false;
}

export function useDisplayNameCheck() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [currentName, setCurrentName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        const name = (data as any)?.display_name;
        setCurrentName(name);
        if (looksLikeBadName(name)) {
          setShowModal(true);
        }
      });
  }, [user]);

  return { showModal, setShowModal, currentName, setCurrentName };
}

interface DisplayNameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string | null;
  onSaved?: (newName: string) => void;
  /** If true, user cannot dismiss without setting a name */
  required?: boolean;
}

export default function DisplayNameModal({
  open,
  onOpenChange,
  currentName,
  onSaved,
  required = false,
}: DisplayNameModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && currentName && !looksLikeBadName(currentName)) {
      setName(currentName);
    }
  }, [open, currentName]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      toast.error("ชื่อต้องมีอย่างน้อย 2 ตัวอักษร");
      return;
    }
    if (trimmed.length > 20) {
      toast.error("ชื่อต้องไม่เกิน 20 ตัวอักษร");
      return;
    }
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: trimmed })
      .eq("user_id", user.id);

    setSaving(false);
    if (error) {
      toast.error("บันทึกไม่สำเร็จ ลองอีกครั้ง");
      return;
    }
    toast.success("เปลี่ยนชื่อแล้ว! ✨");
    onSaved?.(trimmed);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (required && !v) return; // prevent dismiss
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-sm" onPointerDownOutside={required ? (e) => e.preventDefault() : undefined}>
        <DialogHeader>
          <DialogTitle className="font-thai flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            ตั้งชื่อที่แสดง
          </DialogTitle>
          <DialogDescription className="font-thai">
            {required
              ? "ตั้งชื่อของคุณก่อนเริ่มใช้งาน ชื่อนี้จะแสดงให้เพื่อนเห็น"
              : "เปลี่ยนชื่อที่แสดงให้เพื่อนเห็น"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น ส้มโอ, Nick, ไอซ์"
            maxLength={20}
            className="text-center text-lg font-semibold"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <p className="text-xs text-muted-foreground text-center font-thai">
            2-20 ตัวอักษร ({name.trim().length}/20)
          </p>
          <Button
            onClick={handleSave}
            disabled={saving || name.trim().length < 2}
            className="w-full font-thai"
          >
            {saving ? "กำลังบันทึก..." : "✅ บันทึกชื่อ"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
