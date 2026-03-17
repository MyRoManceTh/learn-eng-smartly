// Quick script to check Supabase connection and insert lessons
const SUPABASE_URL = 'https://wyzfsfywpyjdsnxumowi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5emZzZnl3cHlqZHNueHVtb3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODg4OTQsImV4cCI6MjA4ODU2NDg5NH0.Oo3hwK7dGoxsUqaoH-E8Nu6ll5hsiwYQ9hWt3VXuKFY';

async function check() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/lessons?select=id,title,module_id&limit=5`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Existing lessons:', JSON.stringify(data, null, 2));
    console.log('Count:', Array.isArray(data) ? data.length : 'N/A');
  } catch (e) {
    console.error('Error:', e.message);
  }
}

check();
