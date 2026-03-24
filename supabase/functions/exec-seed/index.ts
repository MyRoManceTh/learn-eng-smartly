import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { action, sql } = await req.json();

    if (action === "exec-sql" && sql) {
      // Use postgres connection via supabase-js rpc won't work for raw SQL
      // Instead, use the REST API to do individual inserts
      // But we need raw SQL execution...
      
      // Use Deno's postgres driver
      const { Pool } = await import("https://deno.land/x/postgres@v0.19.3/mod.ts");
      
      const dbUrl = Deno.env.get("SUPABASE_DB_URL");
      if (!dbUrl) throw new Error("SUPABASE_DB_URL not set");
      
      const pool = new Pool(dbUrl, 1);
      const connection = await pool.connect();
      try {
        await connection.queryObject(sql);
      } finally {
        connection.release();
        await pool.end();
      }

      return new Response(
        JSON.stringify({ ok: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
