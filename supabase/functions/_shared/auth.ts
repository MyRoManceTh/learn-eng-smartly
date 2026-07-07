// Shared authentication/authorization helpers for Edge Functions.
//
// Context: Supabase functions that are not listed in config.toml default to
// verify_jwt=true, but that only proves the caller presented *some* validly
// signed Supabase JWT — and the public anon/publishable key (baked into every
// browser bundle) is itself such a JWT. So "verify_jwt" alone does NOT mean
// "a logged-in user" or "an admin". These helpers do the real check by
// resolving the bearer token to an actual user and (optionally) their role.

import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

/** Service-role client (bypasses RLS). Use only after an auth check. */
export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

function bearerToken(req: Request): string | null {
  const header = req.headers.get("Authorization");
  if (!header) return null;
  const token = header.replace(/^Bearer\s+/i, "").trim();
  return token.length > 0 ? token : null;
}

/**
 * Resolve the request's bearer token to a real user. Returns null for the anon
 * key or any token that does not correspond to a logged-in user.
 */
export async function getAuthUser(req: Request): Promise<{ id: string } | null> {
  const token = bearerToken(req);
  if (!token) return null;

  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return null;
  return { id: data.user.id };
}

/** True only when the bearer token belongs to a user with profiles.is_admin = true. */
export async function isAdmin(req: Request): Promise<boolean> {
  const user = await getAuthUser(req);
  if (!user) return false;

  const admin = serviceClient();
  const { data } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();

  return data?.is_admin === true;
}

/**
 * Guard for cron/service-only functions. Returns true when the caller presents
 * the shared CRON_SECRET (set it as a function secret and pass it as the
 * `x-cron-secret` header from the scheduler). Falls back to admin auth so an
 * admin can also trigger the job manually.
 */
export async function isServiceOrCron(req: Request): Promise<boolean> {
  const secret = Deno.env.get("CRON_SECRET");
  if (secret && req.headers.get("x-cron-secret") === secret) return true;
  return await isAdmin(req);
}

const jsonHeaders = { "Content-Type": "application/json" };

/** Standard 401/403 response for a failed auth check. */
export function unauthorized(corsHeaders: Record<string, string>, message = "Unauthorized"): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { status: 403, headers: { ...corsHeaders, ...jsonHeaders } },
  );
}
