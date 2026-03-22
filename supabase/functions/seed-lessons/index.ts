import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

const PRE_A1_LESSONS = [
  // ── core-a0-alphabet ──
  {
    module_id: "core-a0-alphabet", lesson_order: 1, level: 0, topic: "Letters A-G",
    title: "Apple to Gorilla", title_thai: "ตัวอักษร A-G",
    vocabulary: [
      { word: "apple", phonetic: "แอปเปิล", meaning: "แอปเปิล", partOfSpeech: "n." },
      { word: "ball", phonetic: "บอล", meaning: "ลูกบอล", partOfSpeech: "n." },
      { word: "cat", phonetic: "แคท", meaning: "แมว", partOfSpeech: "n." },
      { word: "dog", phonetic: "ด็อก", meaning: "หมา", partOfSpeech: "n." },
      { word: "egg", phonetic: "เอ็ก", meaning: "ไข่", partOfSpeech: "n." },
      { word: "fish", phonetic: "ฟิช", meaning: "ปลา", partOfSpeech: "n." },
      { word: "gorilla", phonetic: "กอริลลา", meaning: "กอริลลา", partOfSpeech: "n." },
    ],
    article_sentences: [
      [{ english: "A", thai: "เอ" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Apple.", thai: "แอปเปิล" }],
      [{ english: "B", thai: "บี" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Ball.", thai: "บอล" }],
      [{ english: "C", thai: "ซี" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Cat.", thai: "แคท" }],
      [{ english: "D", thai: "ดี" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Dog.", thai: "ด็อก" }],
      [{ english: "E", thai: "อี" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Egg.", thai: "เอ็ก" }],
      [{ english: "F", thai: "เอฟ" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Fish.", thai: "ฟิช" }],
      [{ english: "G", thai: "จี" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Gorilla.", thai: "กอริลลา" }],
    ],
    article_translation: "A คือ Apple (แอปเปิล) B คือ Ball (ลูกบอล) C คือ Cat (แมว) D คือ Dog (หมา) E คือ Egg (ไข่) F คือ Fish (ปลา) G คือ Gorilla (กอริลลา)",
    image_prompt: "Colorful alphabet cards A to G with cute cartoon animals and objects, bright child-friendly style",
    quiz: [
      { question: "ตัวอักษร A อ่านว่าอะไร?", options: ["บี", "ซี", "เอ", "ดี"], correctIndex: 2, type: "vocab" },
      { question: "Dog แปลว่าอะไร?", options: ["แมว", "ปลา", "หมา", "ไข่"], correctIndex: 2, type: "vocab" },
      { question: "คำว่า Fish เริ่มต้นด้วยตัวอักษรอะไร?", options: ["D", "E", "F", "G"], correctIndex: 2, type: "comprehension" },
      { question: "ตัวอักษร E อ่านว่าอะไร?", options: ["ดี", "อี", "เอฟ", "บี"], correctIndex: 1, type: "comprehension" },
    ],
  },
  {
    module_id: "core-a0-alphabet", lesson_order: 2, level: 0, topic: "Letters H-N",
    title: "Hat to Night", title_thai: "ตัวอักษร H-N",
    vocabulary: [
      { word: "hat", phonetic: "แฮท", meaning: "หมวก", partOfSpeech: "n." },
      { word: "ice", phonetic: "ไอซ์", meaning: "น้ำแข็ง", partOfSpeech: "n." },
      { word: "juice", phonetic: "จูส", meaning: "น้ำผลไม้", partOfSpeech: "n." },
      { word: "king", phonetic: "คิง", meaning: "กษัตริย์", partOfSpeech: "n." },
      { word: "lion", phonetic: "ไลอัน", meaning: "สิงโต", partOfSpeech: "n." },
      { word: "moon", phonetic: "มูน", meaning: "พระจันทร์", partOfSpeech: "n." },
      { word: "night", phonetic: "ไนท์", meaning: "กลางคืน", partOfSpeech: "n." },
    ],
    article_sentences: [
      [{ english: "H", thai: "เอช" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Hat.", thai: "แฮท" }],
      [{ english: "I", thai: "ไอ" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Ice.", thai: "ไอซ์" }],
      [{ english: "J", thai: "เจ" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Juice.", thai: "จูส" }],
      [{ english: "K", thai: "เค" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "King.", thai: "คิง" }],
      [{ english: "L", thai: "เอล" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Lion.", thai: "ไลอัน" }],
      [{ english: "M", thai: "เอม" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Moon.", thai: "มูน" }],
      [{ english: "N", thai: "เอน" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Night.", thai: "ไนท์" }],
    ],
    article_translation: "H คือ Hat (หมวก) I คือ Ice (น้ำแข็ง) J คือ Juice (น้ำผลไม้) K คือ King (กษัตริย์) L คือ Lion (สิงโต) M คือ Moon (พระจันทร์) N คือ Night (กลางคืน)",
    image_prompt: "Colorful alphabet cards H to N with cute cartoon objects, bright child-friendly style",
    quiz: [
      { question: "Hat แปลว่าอะไร?", options: ["รองเท้า", "หมวก", "เสื้อ", "กระเป๋า"], correctIndex: 1, type: "vocab" },
      { question: "ตัวอักษร L อ่านว่าอะไร?", options: ["เค", "เอล", "เอม", "เอน"], correctIndex: 1, type: "vocab" },
      { question: "Moon แปลว่าอะไร?", options: ["ดวงอาทิตย์", "ดาว", "พระจันทร์", "เมฆ"], correctIndex: 2, type: "comprehension" },
      { question: "คำว่า King เริ่มต้นด้วยตัวอักษรอะไร?", options: ["H", "I", "J", "K"], correctIndex: 3, type: "comprehension" },
    ],
  },
  {
    module_id: "core-a0-alphabet", lesson_order: 3, level: 0, topic: "Letters O-U",
    title: "Orange to Umbrella", title_thai: "ตัวอักษร O-U",
    vocabulary: [
      { word: "orange", phonetic: "ออเรนจ์", meaning: "ส้ม", partOfSpeech: "n." },
      { word: "pink", phonetic: "พิงค์", meaning: "สีชมพู", partOfSpeech: "n." },
      { word: "queen", phonetic: "ควีน", meaning: "ราชินี", partOfSpeech: "n." },
      { word: "rain", phonetic: "เรน", meaning: "ฝน", partOfSpeech: "n." },
      { word: "sun", phonetic: "ซัน", meaning: "ดวงอาทิตย์", partOfSpeech: "n." },
      { word: "tree", phonetic: "ทรี", meaning: "ต้นไม้", partOfSpeech: "n." },
      { word: "umbrella", phonetic: "อัมเบรลลา", meaning: "ร่ม", partOfSpeech: "n." },
    ],
    article_sentences: [
      [{ english: "O", thai: "โอ" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Orange.", thai: "ออเรนจ์" }],
      [{ english: "P", thai: "พี" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Pink.", thai: "พิงค์" }],
      [{ english: "Q", thai: "คิว" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Queen.", thai: "ควีน" }],
      [{ english: "R", thai: "อาร์" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Rain.", thai: "เรน" }],
      [{ english: "S", thai: "เอส" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Sun.", thai: "ซัน" }],
      [{ english: "T", thai: "ที" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Tree.", thai: "ทรี" }],
      [{ english: "U", thai: "ยู" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Umbrella.", thai: "อัมเบรลลา" }],
    ],
    article_translation: "O คือ Orange (ส้ม) P คือ Pink (ชมพู) Q คือ Queen (ราชินี) R คือ Rain (ฝน) S คือ Sun (ดวงอาทิตย์) T คือ Tree (ต้นไม้) U คือ Umbrella (ร่ม)",
    image_prompt: "Colorful alphabet cards O to U with cute cartoon objects, bright child-friendly style",
    quiz: [
      { question: "Orange แปลว่าอะไร?", options: ["แอปเปิล", "กล้วย", "ส้ม", "องุ่น"], correctIndex: 2, type: "vocab" },
      { question: "Queen แปลว่าอะไร?", options: ["กษัตริย์", "ราชินี", "เจ้าชาย", "เจ้าหญิง"], correctIndex: 1, type: "vocab" },
      { question: "ตัวอักษร S อ่านว่าอะไร?", options: ["อาร์", "เอส", "ที", "คิว"], correctIndex: 1, type: "comprehension" },
      { question: "Umbrella แปลว่าอะไร?", options: ["หมวก", "รองเท้า", "ร่ม", "กระเป๋า"], correctIndex: 2, type: "comprehension" },
    ],
  },
  {
    module_id: "core-a0-alphabet", lesson_order: 4, level: 0, topic: "Letters V-Z",
    title: "Van to Zebra", title_thai: "ตัวอักษร V-Z",
    vocabulary: [
      { word: "van", phonetic: "แวน", meaning: "รถตู้", partOfSpeech: "n." },
      { word: "water", phonetic: "วอเตอร์", meaning: "น้ำ", partOfSpeech: "n." },
      { word: "x-ray", phonetic: "เอกซ์เรย์", meaning: "เอกซเรย์", partOfSpeech: "n." },
      { word: "yellow", phonetic: "เยลโลว์", meaning: "สีเหลือง", partOfSpeech: "adj." },
      { word: "zebra", phonetic: "ซีบรา", meaning: "ม้าลาย", partOfSpeech: "n." },
    ],
    article_sentences: [
      [{ english: "V", thai: "วี" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Van.", thai: "แวน" }],
      [{ english: "W", thai: "ดับเบิลยู" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Water.", thai: "วอเตอร์" }],
      [{ english: "X", thai: "เอกซ์" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "X-ray.", thai: "เอกซ์เรย์" }],
      [{ english: "Y", thai: "วาย" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Yellow.", thai: "เยลโลว์" }],
      [{ english: "Z", thai: "ซี" }, { english: "is", thai: "อิส" }, { english: "for", thai: "ฟอร์" }, { english: "Zebra.", thai: "ซีบรา" }],
      [{ english: "Now", thai: "นาว" }, { english: "I", thai: "ไอ" }, { english: "know", thai: "โน" }, { english: "my", thai: "มาย" }, { english: "ABC!", thai: "เอบีซี!" }],
    ],
    article_translation: "V คือ Van (รถตู้) W คือ Water (น้ำ) X คือ X-ray (เอกซเรย์) Y คือ Yellow (สีเหลือง) Z คือ Zebra (ม้าลาย) ตอนนี้ฉันรู้จัก ABC แล้ว!",
    image_prompt: "Colorful alphabet cards V to Z with cute cartoon objects including a zebra, bright child-friendly style",
    quiz: [
      { question: "Zebra แปลว่าอะไร?", options: ["สิงโต", "ม้าลาย", "ยีราฟ", "ช้าง"], correctIndex: 1, type: "vocab" },
      { question: "ตัวอักษร W อ่านว่าอะไร?", options: ["วี", "ดับเบิลยู", "เอกซ์", "วาย"], correctIndex: 1, type: "vocab" },
      { question: "Yellow แปลว่าสีอะไร?", options: ["สีแดง", "สีน้ำเงิน", "สีเขียว", "สีเหลือง"], correctIndex: 3, type: "comprehension" },
      { question: "Van แปลว่าอะไร?", options: ["รถยนต์", "รถตู้", "รถบัส", "รถไฟ"], correctIndex: 1, type: "comprehension" },
    ],
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = getSupabase();

    // Delete existing pre-a1 lessons
    await supabase.from("lessons").delete().like("module_id", "core-a0-%");

    // Insert all lessons
    const { error } = await supabase.from("lessons").insert(
      PRE_A1_LESSONS.map((l) => ({ ...l, is_published: true }))
    );

    if (error) throw error;

    return new Response(
      JSON.stringify({ ok: true, inserted: PRE_A1_LESSONS.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
