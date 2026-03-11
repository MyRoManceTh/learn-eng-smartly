import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

// =============================================
// AI Content Generation
// =============================================

async function generateImage(apiKey: string, imagePrompt: string): Promise<string | null> {
  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: `Generate a colorful, friendly illustration for a language learning lesson about: "${imagePrompt}". Style: warm watercolor illustration, educational, inviting, no text in the image.`,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      console.error("Image generation failed:", response.status);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;
  } catch (e) {
    console.error("Image generation error:", e);
    return null;
  }
}

async function uploadImageToStorage(base64DataUrl: string, lessonId: string): Promise<string | null> {
  try {
    const supabase = getSupabase();
    const base64Data = base64DataUrl.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    const fileName = `${lessonId}.png`;
    const { error } = await supabase.storage
      .from("lesson-images")
      .upload(fileName, binaryData, { contentType: "image/png", upsert: true });

    if (error) {
      console.error("Storage upload error:", error);
      return null;
    }

    const { data: publicUrl } = supabase.storage.from("lesson-images").getPublicUrl(fileName);
    return publicUrl.publicUrl;
  } catch (e) {
    console.error("Upload error:", e);
    return null;
  }
}

function buildPrompt(topic: string, level: number): string {
  return `You are an English-Thai bilingual education content creator. Create a lesson about "${topic}" for level ${level}/5 learners.

Return a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "title": "English title",
  "titleThai": "Thai title",
  "vocabulary": [
    {"word": "english word", "phonetic": "Thai phonetic reading", "meaning": "Thai meaning", "partOfSpeech": "n./v./adj./adv./phr."}
  ],
  "articleSentences": [
    [{"english": "word", "thai": "คำอ่านออกเสียงเป็นไทย (phonetic)"}]
  ],
  "articleTranslation": "Full Thai translation of the article",
  "imagePrompt": "short description for image",
  "quiz": [
    {"question": "Question in Thai", "options": ["opt1","opt2","opt3","opt4"], "correctIndex": 0, "type": "vocab or comprehension"}
  ]
}

Rules:
- 6-8 vocabulary words appropriate for level ${level}
- Article: 4-6 sentences using the vocabulary words
- articleSentences: each sentence is an array of {english, thai} word pairs
- CRITICAL: "phonetic" in vocabulary and "thai" in articleSentences must be PHONETIC PRONUNCIATION in Thai script — how the word actually SOUNDS when spoken, NOT a translation, and NOT based on English spelling!
- 4 quiz questions (2 vocab, 2 comprehension) in Thai
- Level 1: very simple sentences, basic words
- Level 5: complex sentences, advanced vocabulary
- All Thai text must use Thai script

THAI PHONETIC TRANSLITERATION RULES (follow strictly):
1. Use ACTUAL pronunciation, NOT English spelling:
   - Silent L: "walk"→"วอค", "talk"→"ทอค", "half"→"ฮาฟ", "would"→"วูด", "could"→"คูด"
   - Silent K: "knife"→"ไนฟ์", "know"→"โน", "knee"→"นี"
   - Silent B: "climb"→"ไคลม์", "bomb"→"บอม"
   - Silent GH: "thought"→"ธอท", "night"→"ไนท์"

2. Consonant sounds:
   - /θ/ (think)→ท, /ð/ (the)→ด, /ʃ/ (she)→ช, /tʃ/ (catch)→ช, /dʒ/ (judge)→จ

3. Vowel accuracy (very important):
   - Short /ʊ/→อุ: "book"→"บุ๊ค", "cook"→"คุก", "pull"→"พุล" (NOT อู which is long)
   - Long /uː/→อู: "food"→"ฟูด", "moon"→"มูน"
   - /ə/ (schwa)→อะ/เออะ: "about"→"อะเบาท์", "after"→"อาฟเทอะ"
   - /aʊ/: "found"→"ฟาวนด์" (include ALL consonants — don't drop N!)

4. Past tense -ed:
   - After voiceless→ท์: "walked"→"วอคท์", "laughed"→"ลาฟท์", "dropped"→"ดร็อปท์"
   - After voiced→ด์: "called"→"คอลด์", "pulled"→"พุลด์"
   - After /t,d/→เอ็ด: "wanted"→"วอนเท็ด", "decided"→"ดิไซเด็ด"

5. Suffixes: -ing→อิ้ง ("cooking"→"คุกกิ้ง"), -tion→ชั่น ("station"→"สเตชั่น")

6. Always add การันต์ (์) on final silent consonants: "ลาฟท์" NOT "ลาฟท"

Examples of CORRECT phonetics:
"apple"→"แอ๊ปเปิ้ล", "like"→"ไลค์", "after"→"อาฟเทอะ", "water"→"วอเทอะ",
"catch"→"แค็ตช์", "cooking"→"คุกกิ้ง", "found"→"ฟาวนด์", "walked"→"วอคท์",
"grateful"→"เกรทฟุล", "probably"→"พร็อบบะบลี"`;
}

async function generateAndSaveLesson(
  moduleId: string,
  level: number,
  lessonOrder: number,
  topic: string,
): Promise<void> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  const prompt = buildPrompt(topic, level);

  const textResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!textResponse.ok) {
    const t = await textResponse.text();
    throw new Error(`AI gateway error: ${textResponse.status} - ${t}`);
  }

  const data = await textResponse.json();
  const content = data.choices?.[0]?.message?.content || "";

  let parsed;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
  } catch {
    console.error("Failed to parse AI response:", content);
    throw new Error("Failed to parse lesson content");
  }

  // Generate image
  const imagePrompt = parsed.imagePrompt || topic;
  const tempId = `${moduleId}-${lessonOrder}-${Date.now()}`;
  const base64Image = await generateImage(LOVABLE_API_KEY, imagePrompt);
  let imageUrl: string | null = null;
  if (base64Image) {
    imageUrl = await uploadImageToStorage(base64Image, tempId);
  }

  // Save to DB (upsert to avoid conflicts)
  const supabase = getSupabase();
  const { error } = await supabase.from("lessons").upsert({
    module_id: moduleId,
    level,
    lesson_order: lessonOrder,
    topic,
    title: parsed.title,
    title_thai: parsed.titleThai,
    vocabulary: parsed.vocabulary,
    article_sentences: parsed.articleSentences,
    article_translation: parsed.articleTranslation,
    image_url: imageUrl,
    image_prompt: imagePrompt,
    quiz: parsed.quiz,
    is_published: true,
  }, { onConflict: "module_id,lesson_order" });

  if (error) {
    console.error("Failed to save lesson:", error);
    throw new Error("Failed to save lesson to database");
  }

  console.log(`Generated: ${moduleId} lesson ${lessonOrder} - "${topic}"`);
}

// =============================================
// Response helpers
// =============================================

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function lessonResponse(row: any) {
  return jsonResponse({
    lesson: {
      title: row.title,
      titleThai: row.title_thai,
      vocabulary: row.vocabulary,
      articleSentences: row.article_sentences,
      articleTranslation: row.article_translation,
    },
    quiz: row.quiz,
    imageUrl: row.image_url,
  });
}

// =============================================
// Main handler
// =============================================

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { action, moduleId, level, lessonOrder, topic } = body;
    const supabase = getSupabase();

    // ─── GET: ดึงบทเรียน (จาก DB หรือ generate ถ้าไม่มี) ───
    if (!action || action === "get") {
      if (!moduleId || !lessonOrder) {
        return jsonResponse({ error: "Missing moduleId or lessonOrder" }, 400);
      }

      // ค้นหาบทเรียนที่มีอยู่
      const { data: existing } = await supabase
        .from("lessons")
        .select("*")
        .eq("module_id", moduleId)
        .eq("lesson_order", lessonOrder)
        .eq("is_published", true)
        .single();

      if (existing) {
        return lessonResponse(existing);
      }

      // ไม่เจอ → generate ใหม่
      if (!topic || !level) {
        return jsonResponse({ error: "Lesson not found and missing topic/level to generate" }, 404);
      }

      await generateAndSaveLesson(moduleId, level, lessonOrder, topic);

      const { data: newLesson } = await supabase
        .from("lessons")
        .select("*")
        .eq("module_id", moduleId)
        .eq("lesson_order", lessonOrder)
        .single();

      if (!newLesson) {
        return jsonResponse({ error: "Failed to generate lesson" }, 500);
      }

      return lessonResponse(newLesson);
    }

    // ─── SEED-MODULE: สร้างทุกบทเรียนใน 1 module ───
    if (action === "seed-module") {
      const { moduleId: mId, level: lvl, topics: topicList } = body;
      if (!mId || !lvl || !topicList?.length) {
        return jsonResponse({ error: "Missing moduleId, level, or topics" }, 400);
      }

      const results: { order: number; topic: string; status: string }[] = [];

      for (let i = 0; i < topicList.length; i++) {
        const t = topicList[i];
        const order = i + 1;

        // เช็คว่ามีอยู่แล้วหรือยัง
        const { data: existing } = await supabase
          .from("lessons")
          .select("id")
          .eq("module_id", mId)
          .eq("lesson_order", order)
          .single();

        if (existing) {
          results.push({ order, topic: t, status: "exists" });
          continue;
        }

        try {
          await generateAndSaveLesson(mId, lvl, order, t);
          results.push({ order, topic: t, status: "created" });
        } catch (e) {
          console.error(`Failed to generate ${mId} lesson ${order}:`, e);
          results.push({ order, topic: t, status: `error: ${e instanceof Error ? e.message : "unknown"}` });
        }
      }

      return jsonResponse({ ok: true, moduleId: mId, results });
    }

    // ─── SEED-BATCH: สร้างหลาย module ทีเดียว ───
    if (action === "seed-batch") {
      const { modules } = body;
      if (!modules?.length) {
        return jsonResponse({ error: "Missing modules array" }, 400);
      }

      const batchResults: { moduleId: string; created: number; skipped: number; errors: number }[] = [];

      for (const mod of modules) {
        const { moduleId: mId, level: lvl, topics: topicList } = mod;
        let created = 0, skipped = 0, errors = 0;

        for (let i = 0; i < topicList.length; i++) {
          const t = topicList[i];
          const order = i + 1;

          const { data: existing } = await supabase
            .from("lessons")
            .select("id")
            .eq("module_id", mId)
            .eq("lesson_order", order)
            .single();

          if (existing) {
            skipped++;
            continue;
          }

          try {
            await generateAndSaveLesson(mId, lvl, order, t);
            created++;
          } catch (e) {
            console.error(`Failed: ${mId} lesson ${order}:`, e);
            errors++;
          }
        }

        batchResults.push({ moduleId: mId, created, skipped, errors });
        console.log(`Module ${mId}: created=${created}, skipped=${skipped}, errors=${errors}`);
      }

      return jsonResponse({ ok: true, results: batchResults });
    }

    return jsonResponse({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("generate-lesson error:", e);
    return jsonResponse(
      { error: e instanceof Error ? e.message : "Unknown error" },
      500
    );
  }
});
