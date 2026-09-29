import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});


export const endMeeting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ client_id: z.string().uuid(), messages: z.array(messageSchema) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { runWrapUp } = await import("./deal-os.server");
    const supabase = context.supabase;

    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id, full_name, ai_summary")
      .eq("id", data.client_id)
      .maybeSingle();
    if (clientError) throw new Error(clientError.message);
    if (!client) throw new Error("Client not found.");

    const summary = await runWrapUp(data.messages, client.full_name);
    const now = new Date();

    const { error: meetingError } = await supabase.from("meetings").insert({
      client_id: data.client_id,
      starts_at: now.toISOString(),
      ai_summary: summary,
    });
    if (meetingError) throw new Error(meetingError.message);

    const dated = `[${now.toISOString().slice(0, 10)}]\n${summary}`;
    const merged = client.ai_summary ? `${dated}\n\n${client.ai_summary}` : dated;
    const { error: updateError } = await supabase
      .from("clients")
      .update({ ai_summary: merged, last_contact_at: now.toISOString() })
      .eq("id", data.client_id);
    if (updateError) throw new Error(updateError.message);

    return { summary };
  });
