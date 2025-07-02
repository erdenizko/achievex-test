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

        const taskCompletion = await prisma.taskCompletion.findFirst({
            where: {
                memberId: member.id,
            },
            orderBy: {
                completedAt: "desc",
            },
        });

        if (!taskCompletion) {
            return NextResponse.json({ error: "Task completion not found" }, { status: 404 });
        }

        await prisma.milestone.findMany({
            where: {
                organizationId: orgToken.organizationId,
                isActive: true,
                isStreakBased: true,
                requirements: {
                    some: {
                        taskId: taskCompletion.taskId,
                    },
                },
            },
        }).then((milestones) => {
            return NextResponse.json({ milestones });
        });
    } catch (error) {
        console.error("Error processing data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 