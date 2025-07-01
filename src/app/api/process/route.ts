import { NextResponse } from "next/server";
import http from 'http';

const agent = new http.Agent({
    keepAlive: false,
});

export async function POST(request: Request) {
  const token = request.headers.get("x-api-key");
  const body = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("body", body);
    console.log("token", token);
    console.log("process.env.ACHIEVEX_API_URL", process.env.ACHIEVEX_API_URL);
    const apiResponse = await fetch(`${process.env.ACHIEVEX_API_URL}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token,
      },
      body: JSON.stringify(body),
      // @ts-expect-error - Node.js fetch supports agent but it's not in the types
      agent: process.env.ACHIEVEX_API_URL.startsWith('http://') ? agent : undefined,
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to process data", details: data },
        { status: apiResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 