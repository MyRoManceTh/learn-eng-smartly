import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    return imageUrl || null;
  } catch (e) {
    console.error("Image generation error:", e);
    return null;
  }
}

async function uploadImageToStorage(base64DataUrl: string, lessonId: string): Promise<string | null> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract base64 data
    const base64Data = base64DataUrl.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    const fileName = `${lessonId}.png`;
    const { error } = await supabase.storage
      .from("lesson-images")
      .upload(fileName, binaryData, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from("lesson-images")
      .getPublicUrl(fileName);

    return publicUrl.publicUrl;
  } catch (e) {
    console.error("Upload error:", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { level = 1, lessonsCompleted = 0 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const topics = {
      1: ["daily routine", "food and drinks", "my family", "at the market", "weather", "animals", "school life", "hobbies", "the park", "my house"],
      2: ["traveling by bus", "going to the doctor", "cooking Thai food", "weekend plans", "shopping online", "exercise and health", "Thai festivals", "pets at home", "neighborhood", "at the restaurant"],
      3: ["social media habits", "environmental problems", "Thai street food culture", "job interviews", "online learning", "recycling and waste", "public transportation", "healthy eating", "Thai music scene", "volunteering"],
      4: ["climate change impact on Thailand", "digital nomad lifestyle", "Thai startup ecosystem", "mental health awareness", "sustainable tourism", "artificial intelligence in daily life", "cultural preservation", "urban vs rural living", "financial literacy", "remote work culture"],
      5: ["geopolitical implications of trade", "philosophical perspectives on technology", "socioeconomic inequality", "bioethics and genetic engineering", "the psychology of decision-making", "globalization and cultural identity", "cryptocurrency regulations", "media literacy in the digital age"],
    };

    const levelTopics = topics[level as keyof typeof topics] || topics[1];
    const topic = levelTopics[(lessonsCompleted) % levelTopics.length];

    const prompt = `You are an English-Thai bilingual education content creator. Create a lesson about "${topic}" for level ${level}/5 learners.

Return a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "lesson": {
    "id": "lesson-${Date.now()}",
    "title": "English title",
    "titleThai": "Thai title",
    "level": ${level},
    "vocabulary": [
      {"word": "english word", "phonetic": "Thai phonetic reading", "meaning": "Thai meaning", "partOfSpeech": "n./v./adj./adv./phr."}
    ],
    "articleSentences": [
      [{"english": "word", "thai": "คำอ่านออกเสียงเป็นไทย (phonetic)"}]
    ],
    "articleTranslation": "Full Thai translation of the article",
    "imagePrompt": "short description for image"
  },
  "quiz": [
    {"question": "Question in Thai", "options": ["opt1","opt2","opt3","opt4"], "correctIndex": 0, "type": "vocab or comprehension"}
  ]
}

Rules:
- 6-8 vocabulary words appropriate for level ${level}
- Article: 4-6 sentences using the vocabulary words
- articleSentences: each sentence is an array of {english, thai} word pairs
- CRITICAL: the "thai" field in articleSentences must be PHONETIC PRONUNCIATION in Thai script (e.g., "แอปเปิ้ล" for "apple", "ไลค์" for "like", "อาฟเทอะ" for "after"). It is NOT a translation! It is how to READ/PRONOUNCE the English word in Thai script.
- 4 quiz questions (2 vocab, 2 comprehension) in Thai
- Level 1: very simple sentences, basic words
- Level 5: complex sentences, advanced vocabulary
- All Thai text must use Thai script
- Phonetic readings example: "hello" → "เฮลโล", "school" → "สคูล", "water" → "วอเทอะ"`;

    // Generate lesson text and image in parallel
    const [textResponse] = await Promise.all([
      fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "user", content: prompt }],
        }),
      }),
    ]);

    if (!textResponse.ok) {
      if (textResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (textResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${textResponse.status}`);
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

    // Now generate image based on the lesson's imagePrompt
    const imagePrompt = parsed.lesson?.imagePrompt || topic;
    const lessonId = parsed.lesson?.id || `lesson-${Date.now()}`;

    const base64Image = await generateImage(LOVABLE_API_KEY, imagePrompt);
    let imageUrl: string | null = null;

    if (base64Image) {
      imageUrl = await uploadImageToStorage(base64Image, lessonId);
    }

    // Add imageUrl to response
    parsed.imageUrl = imageUrl;

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-lesson error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
