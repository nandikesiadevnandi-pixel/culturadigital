import { supabase } from "@/integrations/supabase/client";

export type ModerationResult = {
  allowed: boolean;
  severity?: "none" | "low" | "medium" | "high";
  reason?: string;
  suggestion?: string;
  fallback?: boolean;
};

export async function moderateText(text: string, context: string): Promise<ModerationResult> {
  try {
    const { data, error } = await supabase.functions.invoke("moderate-text", {
      body: { text, context },
    });
    if (error) return { allowed: true, fallback: true };
    return data as ModerationResult;
  } catch {
    return { allowed: true, fallback: true };
  }
}

export async function logFlag(args: {
  user_id?: string;
  author_name?: string;
  class_name?: string;
  context: string;
  original_text: string;
  reason?: string;
  severity?: string;
}) {
  try {
    await supabase.from("moderation_flags").insert(args);
  } catch {
    /* noop */
  }
}
