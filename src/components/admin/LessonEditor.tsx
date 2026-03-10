import { useState } from "react";
import { useAdminLessons } from "@/hooks/useAdminLessons";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

interface Props {
  lesson: any | null;
  open: boolean;
  onClose: () => void;
}

const LessonEditor = ({ lesson, open, onClose }: Props) => {
  const isEditing = !!lesson;
  const { createLesson, updateLesson } = useAdminLessons();

  const [title, setTitle] = useState(lesson?.title || "");
  const [titleThai, setTitleThai] = useState(lesson?.title_thai || "");
  const [level, setLevel] = useState(lesson?.level || 1);
  const [lessonOrder, setLessonOrder] = useState(lesson?.lesson_order || 1);
  const [imageUrl, setImageUrl] = useState(lesson?.image_url || "");
  const [articleTranslation, setArticleTranslation] = useState(lesson?.article_translation || "");
  const [vocabularyJson, setVocabularyJson] = useState(
    JSON.stringify(lesson?.vocabulary || [], null, 2)
  );
  const [sentencesJson, setSentencesJson] = useState(
    JSON.stringify(lesson?.article_sentences || [], null, 2)
  );
  const [quizJson, setQuizJson] = useState(
    JSON.stringify(lesson?.quiz || [], null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSave = () => {
    setJsonError(null);
    let vocabulary, article_sentences, quiz;
    try {
      vocabulary = JSON.parse(vocabularyJson);
      article_sentences = JSON.parse(sentencesJson);
      quiz = JSON.parse(quizJson);
    } catch {
      setJsonError("JSON ไม่ถูกต้อง กรุณาตรวจสอบ");
      return;
    }

    const data = {
      title,
      title_thai: titleThai,
      level,
      lesson_order: lessonOrder,
      image_url: imageUrl || null,
      article_translation: articleTranslation,
      vocabulary,
      article_sentences,
      quiz,
    };

    if (isEditing) {
      updateLesson.mutate({ id: lesson.id, updates: data }, { onSuccess: onClose });
    } else {
      createLesson.mutate(data as any, { onSuccess: onClose });
    }
  };

  const isPending = createLesson.isPending || updateLesson.isPending;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-thai">
            {isEditing ? "แก้ไขบทเรียน" : "สร้างบทเรียนใหม่"}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-thai">Level</Label>
              <Select value={String(level)} onValueChange={(v) => setLevel(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((l) => (
                    <SelectItem key={l} value={String(l)}>Level {l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-thai">ลำดับบทเรียน</Label>
              <Input
                type="number"
                min={1}
                value={lessonOrder}
                onChange={(e) => setLessonOrder(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label>Title (EN)</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson title" />
          </div>

          <div>
            <Label className="font-thai">ชื่อ (TH)</Label>
            <Input value={titleThai} onChange={(e) => setTitleThai(e.target.value)} placeholder="ชื่อบทเรียน" />
          </div>

          <div>
            <Label>Image URL</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>

          <div>
            <Label className="font-thai">คำแปลบทความ (TH)</Label>
            <Textarea
              value={articleTranslation}
              onChange={(e) => setArticleTranslation(e.target.value)}
              rows={3}
              placeholder="คำแปลภาษาไทยของบทความ..."
            />
          </div>

          <div>
            <Label className="font-thai">คำศัพท์ (JSON)</Label>
            <Textarea
              value={vocabularyJson}
              onChange={(e) => setVocabularyJson(e.target.value)}
              rows={6}
              className="font-mono text-xs"
              placeholder='[{"word":"hello","phonetic":"เฮ-โล","meaning":"สวัสดี","partOfSpeech":"interj."}]'
            />
          </div>

          <div>
            <Label className="font-thai">ประโยคบทความ (JSON)</Label>
            <Textarea
              value={sentencesJson}
              onChange={(e) => setSentencesJson(e.target.value)}
              rows={6}
              className="font-mono text-xs"
              placeholder='[[{"english":"Hello","thai":"สวัสดี"}]]'
            />
          </div>

          <div>
            <Label className="font-thai">คำถาม Quiz (JSON)</Label>
            <Textarea
              value={quizJson}
              onChange={(e) => setQuizJson(e.target.value)}
              rows={6}
              className="font-mono text-xs"
              placeholder='[{"question":"...","choices":["a","b","c","d"],"answer":0}]'
            />
          </div>

          {jsonError && (
            <p className="text-sm text-destructive font-thai">{jsonError}</p>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={isPending} className="flex-1 font-thai">
              <Save className="w-4 h-4 mr-1" />
              {isPending ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
            <Button variant="outline" onClick={onClose} className="font-thai">
              ยกเลิก
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LessonEditor;
