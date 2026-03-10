import { useState } from "react";
import { useAdminEvents } from "@/hooks/useAdminEvents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Calendar, Sparkles } from "lucide-react";

const EventManagement = () => {
  const { events, isLoading, createEvent, updateEvent, deleteEvent } = useAdminEvents();
  const [showCreate, setShowCreate] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground font-thai">กำลังโหลดอีเวนท์...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold font-thai">จัดการอีเวนท์ ({events.length})</h2>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-1" /> สร้างใหม่
        </Button>
      </div>

      {/* Events Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่ออีเวนท์</TableHead>
              <TableHead>ธีม</TableHead>
              <TableHead>เริ่ม</TableHead>
              <TableHead>สิ้นสุด</TableHead>
              <TableHead className="w-[80px]">สถานะ</TableHead>
              <TableHead className="w-[100px] text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-thai">
                  ยังไม่มีอีเวนท์
                </TableCell>
              </TableRow>
            ) : (
              events.map((event: any) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium font-thai">{event.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <Sparkles className="w-3 h-3" /> {event.theme}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{event.start_date?.split("T")[0]}</TableCell>
                  <TableCell className="text-sm">{event.end_date?.split("T")[0]}</TableCell>
                  <TableCell>
                    {event.is_active ? (
                      <Badge className="bg-green-500 font-thai">เปิด</Badge>
                    ) : (
                      <Badge variant="secondary" className="font-thai">ปิด</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => setEditingEvent(event)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-thai">ยืนยันการลบ</AlertDialogTitle>
                            <AlertDialogDescription className="font-thai">
                              ลบอีเวนท์ "{event.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="font-thai">ยกเลิก</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive font-thai"
                              onClick={() => deleteEvent.mutate(event.id)}
                            >
                              ลบ
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      {(showCreate || editingEvent) && (
        <EventFormDialog
          event={editingEvent}
          open={!!(showCreate || editingEvent)}
          onClose={() => {
            setShowCreate(false);
            setEditingEvent(null);
          }}
          onCreate={(data) => createEvent.mutate(data)}
          onUpdate={(id, updates) => updateEvent.mutate({ id, updates })}
          isPending={createEvent.isPending || updateEvent.isPending}
        />
      )}
    </div>
  );
};

interface EventFormDialogProps {
  event: any | null;
  open: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
  onUpdate: (id: string, updates: any) => void;
  isPending: boolean;
}

const EventFormDialog = ({ event, open, onClose, onCreate, onUpdate, isPending }: EventFormDialogProps) => {
  const isEditing = !!event;
  const [name, setName] = useState(event?.name || "");
  const [description, setDescription] = useState(event?.description || "");
  const [theme, setTheme] = useState(event?.theme || "");
  const [startDate, setStartDate] = useState(event?.start_date?.split("T")[0] || "");
  const [endDate, setEndDate] = useState(event?.end_date?.split("T")[0] || "");
  const [isActive, setIsActive] = useState(event?.is_active ?? true);
  const [exclusiveItemsJson, setExclusiveItemsJson] = useState(
    JSON.stringify(event?.exclusive_items || [], null, 2)
  );

  const handleSave = () => {
    let exclusive_items;
    try {
      exclusive_items = JSON.parse(exclusiveItemsJson);
    } catch {
      return;
    }

    const data = {
      name,
      description,
      theme,
      start_date: startDate,
      end_date: endDate,
      is_active: isActive,
      exclusive_items,
    };

    if (isEditing) {
      onUpdate(event.id, data);
    } else {
      onCreate(data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-thai">
            {isEditing ? "แก้ไขอีเวนท์" : "สร้างอีเวนท์ใหม่"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="font-thai">ชื่ออีเวนท์</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น Summer Festival" />
          </div>
          <div>
            <Label className="font-thai">คำอธิบาย</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div>
            <Label className="font-thai">ธีม</Label>
            <Input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="เช่น summer, halloween" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-thai">วันเริ่ม</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label className="font-thai">วันสิ้นสุด</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-thai">เปิดใช้งาน</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <div>
            <Label className="font-thai">ไอเทมพิเศษ (JSON)</Label>
            <Textarea
              value={exclusiveItemsJson}
              onChange={(e) => setExclusiveItemsJson(e.target.value)}
              rows={3}
              className="font-mono text-xs"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={isPending} className="flex-1 font-thai">
              {isPending ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
            <Button variant="outline" onClick={onClose} className="font-thai">ยกเลิก</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventManagement;
