import { useState } from "react";
import { Bell, Users, Gift } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  pendingRequests: number;
  pendingGifts: number;
}

export default function NotificationCenter({
  pendingRequests,
  pendingGifts,
}: Props) {
  const [open, setOpen] = useState(false);
  const totalCount = pendingRequests + pendingGifts;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {totalCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {totalCount > 99 ? "99+" : totalCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0">
        {/* Header */}
        <div className="border-b px-4 py-3">
          <h4 className="text-sm font-semibold">📬 แจ้งเตือน</h4>
        </div>

        {/* Content */}
        <div className="p-2">
          {totalCount === 0 ? (
            <div className="py-4 text-center">
              <p className="text-sm text-muted-foreground">
                ไม่มีแจ้งเตือนใหม่
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Friend requests */}
              {pendingRequests > 0 && (
                <button
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-muted"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">คำขอเป็นเพื่อน</p>
                  </div>
                  <Badge
                    variant="default"
                    className="shrink-0 text-[10px] px-1.5"
                  >
                    {pendingRequests}
                  </Badge>
                </button>
              )}

              {/* Pending gifts */}
              {pendingGifts > 0 && (
                <button
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-muted"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <Gift className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">ของขวัญรอรับ</p>
                  </div>
                  <Badge
                    variant="default"
                    className="shrink-0 text-[10px] px-1.5"
                  >
                    {pendingGifts}
                  </Badge>
                </button>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
