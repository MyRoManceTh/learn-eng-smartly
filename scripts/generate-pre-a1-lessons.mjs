// Generate all Pre-A1 lessons via the generate-lesson edge function
// Run: node scripts/generate-pre-a1-lessons.mjs

const SUPABASE_URL = 'https://wyzfsfywpyjdsnxumowi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5emZzZnl3cHlqZHNueHVtb3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4OTQsImV4cCI6MjA4ODU2NDg5NH0.Oo3hwK7dGoxsUqaoH-E8Nu6ll5hsiwYQ9hWt3VXuKFY';

const MODULES = [
  {
    moduleId: 'core-a0-alphabet',
    level: 0,
    topics: [
      'Letters A-G',
      'Letters H-N',
      'Letters O-U',
      'Letters V-Z',
    ],
  },
  {
    moduleId: 'core-a0-numbers',
    level: 0,
    topics: [
      'Numbers 1-10',
      'Numbers 11-20',
      'Counting things',
    ],
  },
  {
    moduleId: 'core-a0-colors',
    level: 0,
    topics: [
      'Basic colors',
      'Colors around us',
      'My favorite color',
    ],
  },
  {
    moduleId: 'core-a0-firstwords',
    level: 0,
    topics: [
      'Animals',
      'Body parts',
      'Common objects',
      'Yes, No, Please, Thank you',
    ],
  },
];

async function generateLesson(moduleId, level, lessonOrder, topic) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-lesson`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'get', moduleId, level, lessonOrder, topic }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err.substring(0, 200)}`);
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

async function main() {
  console.log('=== Generating Pre-A1 Lessons via AI ===\n');

  for (const mod of MODULES) {
    console.log(`\n📚 Module: ${mod.moduleId}`);

    for (let i = 0; i < mod.topics.length; i++) {
      const topic = mod.topics[i];
      const order = i + 1;
      process.stdout.write(`  [${order}/${mod.topics.length}] ${topic} ... `);

      try {
        await generateLesson(mod.moduleId, mod.level, order, topic);
        console.log('✅');
      } catch (e) {
        console.log(`❌ ${e.message}`);
      }

      // หน่วงเวลาเล็กน้อยเพื่อไม่ให้ rate limit
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\n=== Done! ===');

  // ตรวจสอบผลลัพธ์
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/lessons?module_id=like.core-a0-*&select=module_id,lesson_order,title&order=module_id,lesson_order`,
    { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
  );
  const data = await res.json();
  console.log(`\nTotal Pre-A1 lessons in DB: ${data.length}`);
  for (const l of data) {
    console.log(`  ${l.module_id} [${l.lesson_order}] ${l.title}`);
  }
}

main().catch(console.error);
