import { inngest } from "@/inngest/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, data } = body;

    if (!eventName) {
      return NextResponse.json(
        { error: "eventName is required" },
        { status: 400 }
      );
    }

    // Send event to Inngest
    const { ids: [eventId] } = await inngest.send({
      name: eventName,
      data: data || {},
    });

    return NextResponse.json({ eventId });
  } catch (error) {
    console.error("Error sending event to Inngest:", error);
    return NextResponse.json(
      { error: "Failed to send event" },
      { status: 500 }
    );
  }
}
