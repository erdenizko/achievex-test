import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { memberId: string } }
) {
  const token = request.headers.get("x-api-key");
  const { memberId } = context.params;

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
      `${process.env.API_URL}/api/members/external/${memberId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
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