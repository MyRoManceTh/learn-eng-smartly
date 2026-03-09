import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonRow {
  feature: string;
  freeValue: string;
  premiumValue: string;
  freeIcon?: string;
  premiumIcon?: string;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "พลังงาน",
    freeValue: "5/วัน",
    premiumValue: "ไม่จำกัด",
    premiumIcon: "♾️",
  },
  {
    feature: "Streak",
    freeValue: "รีเซ็ตถ้าพลาด",
    premiumValue: "ป้องกัน Streak",
    premiumIcon: "🛡️",
  },
  {
    feature: "กาชา",
    freeValue: "1 ครั้ง/สัปดาห์",
    premiumValue: "5 ครั้ง/สัปดาห์",
  },
  {
    feature: "Season Pass",
    freeValue: "รางวัลฟรีเท่านั้น",
    premiumValue: "รางวัล Premium ทั้งหมด",
  },
  {
    feature: "รายงานผู้ปกครอง",
    freeValue: "❌",
    premiumValue: "ส่งได้ทุกสัปดาห์",
    premiumIcon: "✅",
  },
  {
    feature: "ไอเทม",
    freeValue: "ร้านค้าปกติ",
    premiumValue: "ไอเทม Exclusive",
  },
];

const PremiumPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950/30 via-background to-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-amber-500/20">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">{"⭐ "}สมาชิกพรีเมียม</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mx-4 mt-6 p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-600/20 border border-amber-500/30 text-center relative overflow-hidden">
        {/* Sparkle decorations */}
        <div className="absolute top-3 left-6 text-amber-400/40 text-xl">{"✦"}</div>
        <div className="absolute top-8 right-8 text-amber-400/30 text-sm">{"✦"}</div>
        <div className="absolute bottom-4 left-10 text-amber-400/20 text-lg">{"✦"}</div>
        <div className="absolute bottom-6 right-6 text-amber-400/40 text-xs">{"✦"}</div>

        <div className="relative">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold mt-4 bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
            Premium Membership
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            ปลดล็อกศักยภาพการเรียนรู้เต็มรูปแบบ
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mx-4 mt-6">
        <div className="rounded-2xl border border-border/50 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-muted/50">
            <div className="px-3 py-2.5 text-xs font-semibold text-muted-foreground">
              ฟีเจอร์
            </div>
            <div className="px-3 py-2.5 text-xs font-semibold text-center text-muted-foreground">
              ฟรี
            </div>
            <div className="px-3 py-2.5 text-xs font-semibold text-center">
              <span className="text-amber-400">{"⭐ "}Premium</span>
            </div>
          </div>

          {/* Table Rows */}
          {comparisonData.map((row, index) => (
            <div
              key={row.feature}
              className={cn(
                "grid grid-cols-3 border-t border-border/30",
                index % 2 === 0 ? "bg-card" : "bg-card/50"
              )}
            >
              {/* Feature name */}
              <div className="px-3 py-3 flex items-center">
                <span className="text-sm font-medium">{row.feature}</span>
              </div>

              {/* Free value */}
              <div className="px-3 py-3 flex items-center justify-center">
                <span className="text-xs text-muted-foreground text-center">
                  {row.freeValue}
                </span>
              </div>

              {/* Premium value */}
              <div className="px-3 py-3 flex items-center justify-center">
                <span className="text-xs text-amber-300 text-center font-medium">
                  {row.premiumIcon && (
                    <span className="mr-1">{row.premiumIcon}</span>
                  )}
                  {row.premiumValue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits List */}
      <div className="mx-4 mt-6 p-4 rounded-2xl bg-card border border-border/50">
        <h3 className="text-sm font-semibold mb-3">สิ่งที่คุณจะได้รับ</h3>
        <div className="space-y-2.5">
          {[
            "เล่นได้ไม่จำกัด ไม่ต้องรอพลังงาน",
            "ปกป้อง Streak ไม่ให้หายเมื่อลืมเข้า",
            "หมุนกาชาได้ 5 ครั้งต่อสัปดาห์",
            "ปลดล็อกรางวัล Premium ใน Season Pass",
            "ส่งรายงานพัฒนาการให้ผู้ปกครองทุกสัปดาห์",
            "ไอเทมและอวาตาร์ Exclusive เฉพาะสมาชิก",
          ].map((benefit) => (
            <div key={benefit} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-amber-400" />
              </div>
              <span className="text-sm text-foreground/80">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="mx-4 mt-6">
        <Button
          disabled
          className={cn(
            "w-full h-14 rounded-2xl text-base font-bold relative overflow-hidden",
            "bg-gradient-to-r from-amber-500/40 to-yellow-500/40",
            "border-2 border-amber-500/30",
            "text-amber-300/60 cursor-not-allowed"
          )}
        >
          <span className="relative z-10 flex items-center gap-2">
            {"🔒 "}เร็วๆ นี้
          </span>
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-2">
          ระบบสมาชิกพรีเมียมกำลังพัฒนา รอติดตามเร็วๆ นี้!
        </p>
      </div>

      {/* Decorative bottom gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />
    </div>
  );
};

export default PremiumPage;
