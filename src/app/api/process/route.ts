import { NextResponse } from "next/server";

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
    console.log("process.env.ACHIEVEX_API_URL/process", `${process.env.ACHIEVEX_API_URL}/process`);
    const apiResponse = await fetch(`${process.env.ACHIEVEX_API_URL}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token,
      },
      body: JSON.stringify(body),
    });

    console.log("apiResponse-----", apiResponse);

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