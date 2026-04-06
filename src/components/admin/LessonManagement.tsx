import { useState } from "react";
import { useAdminLessons } from "@/hooks/useAdminLessons";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Zap, BookOpen, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import LessonEditor from "./LessonEditor";
import { skillTreeModules, getLessonsByModule } from "@/data/skillTreeData";

const LessonManagement = () => {
  const [filterLevel, setFilterLevel] = useState<number>(0);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Seed state
  const [seeding, setSeeding] = useState(false);
  const [seedProgress, setSeedProgress] = useState({ current: 0, total: 0, currentModule: "" });
  const [seedResults, setSeedResults] = useState<{ moduleId: string; created: number; skipped: number; errors: number }[]>([]);

  const { lessons, isLoading, deleteLesson, seedModule } = useAdminLessons(filterLevel);

  // ───── Seed ทุก Module ทีละอัน ─────
  const handleSeedAll = async () => {
    setSeeding(true);
    setSeedResults([]);

    const modules = skillTreeModules;
    const total = modules.length;
    setSeedProgress({ current: 0, total, currentModule: "" });

    for (let i = 0; i < modules.length; i++) {
      const mod = modules[i];
      const moduleLessons = getLessonsByModule(mod.id);
      const topics = moduleLessons.map((l) => l.topic);

      setSeedProgress({ current: i + 1, total, currentModule: `${mod.nameThai} (${mod.id})` });

      try {
        const { data, error } = await supabase.functions.invoke("generate-lesson", {
          body: {
            action: "seed-module",
            moduleId: mod.id,
            level: mod.level,
            topics,
          },
        });

        if (error) throw error;

        setSeedResults((prev) => [
          ...prev,
          {
            moduleId: mod.id,
            created: data.results?.filter((r: any) => r.status === "created").length || 0,
            skipped: data.results?.filter((r: any) => r.status === "exists").length || 0,
            errors: data.results?.filter((r: any) => r.status.startsWith("error")).length || 0,
          },
        ]);
      } catch (e: any) {
        console.error(`Seed failed for ${mod.id}:`, e);
        setSeedResults((prev) => [
          ...prev,
          { moduleId: mod.id, created: 0, skipped: 0, errors: topics.length },
        ]);
      }
    }

    setSeeding(false);
    toast.success("Seed ทุก module เสร็จแล้ว!");
  };

  // ───── Seed เฉพาะ Level ─────
  const handleSeedLevel = async (level: number) => {
    const modules = skillTreeModules.filter((m) => m.level === level);
    setSeeding(true);
    setSeedResults([]);

    const total = modules.length;
    setSeedProgress({ current: 0, total, currentModule: "" });

    for (let i = 0; i < modules.length; i++) {
      const mod = modules[i];
      const moduleLessons = getLessonsByModule(mod.id);
      const topics = moduleLessons.map((l) => l.topic);

      setSeedProgress({ current: i + 1, total, currentModule: `${mod.nameThai} (${mod.id})` });

      try {
        const { data, error } = await supabase.functions.invoke("generate-lesson", {
          body: {
            action: "seed-module",
            moduleId: mod.id,
            level: mod.level,
            topics,
          },
        });

        if (error) throw error;

        setSeedResults((prev) => [
          ...prev,
          {
            moduleId: mod.id,
            created: data.results?.filter((r: any) => r.status === "created").length || 0,
            skipped: data.results?.filter((r: any) => r.status === "exists").length || 0,
            errors: data.results?.filter((r: any) => r.status.startsWith("error")).length || 0,
          },
        ]);
      } catch (e: any) {
        console.error(`Seed failed for ${mod.id}:`, e);
        setSeedResults((prev) => [
          ...prev,
          { moduleId: mod.id, created: 0, skipped: 0, errors: topics.length },
        ]);
      }
    }

    setSeeding(false);
    toast.success(`Seed Level ${level} เสร็จแล้ว!`);
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

      {/* Seed All Lessons Section */}
      <div className="border-2 border-dashed border-yellow-500/50 rounded-lg p-4 bg-yellow-500/5 space-y-3">
        <h3 className="font-semibold font-thai flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" /> Seed บทเรียนจาก Skill Tree
        </h3>
        <p className="text-sm text-muted-foreground font-thai">
          สร้างบทเรียนทั้งหมดล่วงหน้า ตาม topic ใน Skill Tree ({skillTreeModules.length} modules)
          บทเรียนที่มีอยู่แล้วจะถูกข้ามไป
        </p>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSeedAll}
            disabled={seeding}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {seeding ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Zap className="w-4 h-4 mr-1" />}
            {seeding ? "กำลังสร้าง..." : "Seed ทุก Module"}
          </Button>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <Button
              key={lvl}
              variant="outline"
              size="sm"
              onClick={() => handleSeedLevel(lvl)}
              disabled={seeding}
              className="font-thai"
            >
              Seed Level {lvl}
            </Button>
          ))}
        </div>

        {/* Progress */}
        {seeding && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-thai">
              <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
              <span>
                Module {seedProgress.current}/{seedProgress.total}: {seedProgress.currentModule}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all"
                style={{ width: `${(seedProgress.current / Math.max(seedProgress.total, 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Results */}
        {seedResults.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-1 text-xs">
            {seedResults.map((r, i) => (
              <div key={i} className="flex items-center gap-2 font-mono">
                {r.errors > 0 ? (
                  <XCircle className="w-3 h-3 text-red-500 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                )}
                <span className="truncate">{r.moduleId}</span>
                <span className="text-green-600">+{r.created}</span>
                {r.skipped > 0 && <span className="text-muted-foreground">skip:{r.skipped}</span>}
                {r.errors > 0 && <span className="text-red-500">err:{r.errors}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lessons Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Level</TableHead>
              <TableHead>Module</TableHead>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>ชื่อ (EN)</TableHead>
              <TableHead>ชื่อ (TH)</TableHead>
              <TableHead className="w-[70px]">คำศัพท์</TableHead>
              <TableHead className="w-[60px]">Quiz</TableHead>
              <TableHead className="w-[100px] text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground font-thai">
                  ยังไม่มีบทเรียน — ลอง Seed จาก Skill Tree ด้านบน
                </TableCell>
              </TableRow>
            ) : (
              lessons.map((lesson: any) => (
                <TableRow key={lesson.id}>
                  <TableCell>
                    <Badge variant="outline">{["","Pre-A1","A1","A2","B1","B2"][lesson.level] || lesson.level}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono max-w-[150px] truncate">
                    {lesson.module_id || "-"}
                  </TableCell>
                  <TableCell>{lesson.lesson_order}</TableCell>
                  <TableCell className="font-medium max-w-[180px] truncate">
                    {lesson.title}
                  </TableCell>
                  <TableCell className="font-thai max-w-[180px] truncate">
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
