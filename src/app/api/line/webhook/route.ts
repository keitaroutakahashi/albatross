import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log("=== Webhook received ===");
  console.log(JSON.stringify(body, null, 2));

  for (const event of body.events ?? []) {
    console.log("Event Type:", event.type);
    console.log("Source:", event.source);

    if (event.source?.type === "group") {
      console.log("groupId:", event.source.groupId);
      console.log("userId :", event.source.userId);
    }
  }

  return Response.json({ ok: true });
}
