import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const token = request.headers.get("x-api-key");
  const body = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const apiResponse = await fetch(`${process.env.API_URL}/api/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token,
      },
      body: JSON.stringify(body),
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