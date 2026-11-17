import { NextResponse } from "next/server";
import { createLink } from "@/lib/links";

function getValidUrl(url: string) {
  // Require http(s):// followed by a host. Reject spaces and backslashes.
  if (!/^https?:\/\/[^/]/i.test(url) || /[\s\\]/.test(url)) {
    return null;
  }
  try {
    return new URL(url).href;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const url = typeof data?.url === "string" ? getValidUrl(data.url.trim()) : null;
  const alias = typeof data?.alias === "string" ? data.alias.trim() : "";

  if (!url) {
    return NextResponse.json({ error: "Enter a full URL starting with http:// or https://." }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
    return NextResponse.json({ error: "Use letters, numbers, hyphens, or underscores for the alias." }, { status: 400 });
  }

  try {
    const saved = await createLink(alias, url);
    if (!saved) {
      return NextResponse.json({ error: "That alias is already taken." }, { status: 409 });
    }
    return NextResponse.json({ alias }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not save the link. Check the database connection." }, { status: 500 });
  }
}
