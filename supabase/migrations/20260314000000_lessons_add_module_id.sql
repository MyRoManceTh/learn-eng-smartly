-- =============================================
-- Lessons: เพิ่ม module_id เพื่อรองรับ Skill Tree
-- =============================================

-- เพิ่ม column module_id
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS module_id TEXT;

-- เพิ่ม column topic (เก็บ topic ที่ใช้สร้าง)
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS topic TEXT;

-- ลบ unique constraint เก่า (level + lesson_order)
ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS lessons_level_lesson_order_key;

-- สร้าง unique constraint ใหม่ (module_id + lesson_order)
ALTER TABLE public.lessons ADD CONSTRAINT lessons_module_order_key UNIQUE (module_id, lesson_order);

-- Index สำหรับ query
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_order ON public.lessons(module_id, lesson_order);
