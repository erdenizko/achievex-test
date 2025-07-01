import { NextResponse } from "next/server";
import http from 'http';

const agent = new http.Agent({
    keepAlive: false,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const token = request.headers.get("x-api-key");
  const { memberId } = await params;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!memberId) {
    return NextResponse.json(
      { error: "Member ID is required" },
      { status: 400 }
    );
  }

  try {
    const apiResponse = await fetch(
      `${process.env.ACHIEVEX_API_URL}/members/external/${memberId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        // @ts-expect-error - Node.js fetch supports agent but it's not in the types
        agent: process.env.ACHIEVEX_API_URL.startsWith('http://') ? agent : undefined,
      }
    );

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch member data", details: data },
        { status: apiResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching member data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 