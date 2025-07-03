import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    const token = request.headers.get("x-api-key");
    const body = await request.json();

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const orgToken = await prisma.organizationToken.findUnique({
            where: { token },
        });

        if (!orgToken) {
            return NextResponse.json({ error: "Invalid token" }, { status: 403 });
        }

        const member = await prisma.member.findFirst({
            where: {
                externalId: body.memberId,
            },
        });

        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }

        await prisma.taskCompletion.deleteMany({
            where: {
                memberId: member.id,
            },
        });

        await prisma.milestoneProgress.deleteMany({
            where: {
                memberId: member.id,
            },
        });


        const updatedMember = await prisma.member.update({
            where: {
                id: member.id,
            },
            data: {
                totalPoints: 0,
                spendablePoints: 0,
                currentLevel: 1,
            },
        });

        console.log("updatedMember", updatedMember);

        return NextResponse.json({ message: "Request removed from database" });
    } catch (error) {
        console.error("Error processing data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 