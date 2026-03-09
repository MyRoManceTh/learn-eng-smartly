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

async function generateAndSaveLesson(level: number, lessonOrder: number): Promise<void> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  const topics: Record<number, string[]> = {
    1: ["daily routine", "food and drinks", "my family", "at the market", "weather", "animals", "school life", "hobbies", "the park", "my house"],
    2: ["traveling by bus", "going to the doctor", "cooking Thai food", "weekend plans", "shopping online", "exercise and health", "Thai festivals", "pets at home", "neighborhood", "at the restaurant"],
    3: ["social media habits", "environmental problems", "Thai street food culture", "job interviews", "online learning", "recycling and waste", "public transportation", "healthy eating", "Thai music scene", "volunteering"],
    4: ["climate change impact on Thailand", "digital nomad lifestyle", "Thai startup ecosystem", "mental health awareness", "sustainable tourism", "artificial intelligence in daily life", "cultural preservation", "urban vs rural living", "financial literacy", "remote work culture"],
    5: ["geopolitical implications of trade", "philosophical perspectives on technology", "socioeconomic inequality", "bioethics and genetic engineering", "the psychology of decision-making", "globalization and cultural identity", "cryptocurrency regulations", "media literacy in the digital age"],
  };

  const levelTopics = topics[level] || topics[1];
  const topic = levelTopics[(lessonOrder - 1) % levelTopics.length];

  const prompt = `You are an English-Thai bilingual education content creator. Create a lesson about "${topic}" for level ${level}/5 learners.

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

  const textResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
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
  const tempId = `lesson-${level}-${lessonOrder}-${Date.now()}`;
  const base64Image = await generateImage(LOVABLE_API_KEY, imagePrompt);
  let imageUrl: string | null = null;
  if (base64Image) {
    imageUrl = await uploadImageToStorage(base64Image, tempId);
  }

  // Save to DB
  const supabase = getSupabase();
  const { error } = await supabase.from("lessons").insert({
    level,
    lesson_order: lessonOrder,
    title: parsed.title,
    title_thai: parsed.titleThai,
    vocabulary: parsed.vocabulary,
    article_sentences: parsed.articleSentences,
    article_translation: parsed.articleTranslation,
    image_url: imageUrl,
    image_prompt: imagePrompt,
    quiz: parsed.quiz,
    is_published: true,
  });

  if (error) {
    console.error("Failed to save lesson:", error);
    throw new Error("Failed to save lesson to database");
  }

  console.log(`Generated and saved lesson: level ${level}, order ${lessonOrder}`);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, level, lessonOrder } = await req.json();
    const supabase = getSupabase();

    if (action === "trigger-next") {
      // Called after a user completes the latest lesson for a level
      // Check if the next lesson already exists
      const nextOrder = (lessonOrder || 1) + 1;
      const { data: existing } = await supabase
        .from("lessons")
        .select("id")
        .eq("level", level)
        .eq("lesson_order", nextOrder)
        .single();

      if (!existing) {
        // Generate the next lesson in background
        console.log(`Triggering generation for level ${level}, order ${nextOrder}`);
        // Don't await - let it run in background
        generateAndSaveLesson(level, nextOrder).catch((e) => {
          console.error("Background generation failed:", e);
        });
      }

      return new Response(JSON.stringify({ ok: true, nextOrder }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "seed") {
      // Seed initial lessons for all levels if they don't exist
      for (let lvl = 1; lvl <= 5; lvl++) {
        const { data: existing } = await supabase
          .from("lessons")
          .select("id")
          .eq("level", lvl)
          .eq("lesson_order", 1)
          .single();

        if (!existing) {
          await generateAndSaveLesson(lvl, 1);
        }
      }
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-lesson error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
