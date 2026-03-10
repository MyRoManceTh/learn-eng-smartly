import { useState } from "react";
import { useAdminLessons } from "@/hooks/useAdminLessons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Sparkles, BookOpen } from "lucide-react";
import LessonEditor from "./LessonEditor";

const LessonManagement = () => {
  const [filterLevel, setFilterLevel] = useState<number>(0);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [genLevel, setGenLevel] = useState(1);
  const [genOrder, setGenOrder] = useState(1);
  const [genTopic, setGenTopic] = useState("");

  const { lessons, isLoading, deleteLesson, generateLesson } = useAdminLessons(filterLevel);

  const handleGenerate = () => {
    generateLesson.mutate({
      level: genLevel,
      lessonOrder: genOrder,
      topic: genTopic || undefined,
    });
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground font-thai">กำลังโหลดบทเรียน...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold font-thai">จัดการบทเรียน ({lessons.length})</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={String(filterLevel)} onValueChange={(v) => setFilterLevel(Number(v))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="ทุก Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">ทุก Level</SelectItem>
              <SelectItem value="1">Level 1</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
              <SelectItem value="4">Level 4</SelectItem>
              <SelectItem value="5">Level 5</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-1" /> สร้างใหม่
          </Button>
        </div>
      </div>

      {/* AI Generate Section */}
      <div className="border rounded-lg p-4 bg-card space-y-3">
        <h3 className="font-semibold font-thai flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" /> สร้างบทเรียนด้วย AI
        </h3>
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="text-xs text-muted-foreground font-thai">Level</label>
            <Select value={String(genLevel)} onValueChange={(v) => setGenLevel(Number(v))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((l) => (
                  <SelectItem key={l} value={String(l)}>Lv.{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-thai">ลำดับ</label>
            <Input
              type="number"
              min={1}
              value={genOrder}
              onChange={(e) => setGenOrder(Number(e.target.value))}
              className="w-[80px]"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-muted-foreground font-thai">หัวข้อ (ไม่บังคับ)</label>
            <Input
              placeholder="เช่น animals, food..."
              value={genTopic}
              onChange={(e) => setGenTopic(e.target.value)}
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={generateLesson.isPending}
            variant="secondary"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            {generateLesson.isPending ? "กำลังสร้าง..." : "สร้าง AI"}
          </Button>
        </div>
      </div>

      {/* Lessons Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Level</TableHead>
              <TableHead className="w-[60px]">Order</TableHead>
              <TableHead>ชื่อ (EN)</TableHead>
              <TableHead>ชื่อ (TH)</TableHead>
              <TableHead className="w-[80px]">คำศัพท์</TableHead>
              <TableHead className="w-[80px]">Quiz</TableHead>
              <TableHead className="w-[100px] text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground font-thai">
                  ยังไม่มีบทเรียน
                </TableCell>
              </TableRow>
            ) : (
              lessons.map((lesson: any) => (
                <TableRow key={lesson.id}>
                  <TableCell>
                    <Badge variant="outline">Lv.{lesson.level}</Badge>
                  </TableCell>
                  <TableCell>{lesson.lesson_order}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {lesson.title}
                  </TableCell>
                  <TableCell className="font-thai max-w-[200px] truncate">
                    {lesson.title_thai}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(lesson.vocabulary) ? lesson.vocabulary.length : 0}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(lesson.quiz) ? lesson.quiz.length : 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingLesson(lesson)}
                      >
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
                              ต้องการลบบทเรียน "{lesson.title}" หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="font-thai">ยกเลิก</AlertDialogCancel>
                            <AlertDialogAction
                              className="font-thai bg-destructive"
                              onClick={() => deleteLesson.mutate(lesson.id)}
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

      {/* Editor Sheet */}
      {(editingLesson || showCreate) && (
        <LessonEditor
          lesson={editingLesson}
          open={!!(editingLesson || showCreate)}
          onClose={() => {
            setEditingLesson(null);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
};

export default LessonManagement;
