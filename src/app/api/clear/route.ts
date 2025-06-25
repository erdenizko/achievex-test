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

        await prisma.member.update({
            where: {
                id: member.id,
            },
            data: {
                totalPoints: member.totalPoints - taskCompletion.pointsEarned,
                spendablePoints: member.spendablePoints - taskCompletion.pointsEarned,
            },
        });

        await prisma.taskCompletion.delete({
            where: {
                id: taskCompletion.id,
            },
        });

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
            milestones.forEach(async (milestone) => {
                await prisma.milestoneProgress.findMany({
                    where: {
                        memberId: member.id,
                        milestoneId: milestone.id,
                    },
                }).then((milestoneProgress) => {
                    milestoneProgress.forEach(async (progress) => {
                        await prisma.milestoneProgress.update({
                            where: {
                                id: progress.id,
                            },
                            data: {
                                completed: false,
                                currentStreak: Math.max(0, progress.currentStreak - 1),
                                streakStartDate: null,
                            },
                        });
                        await prisma.milestoneRequirementProgress.findMany({
                            where: {
                                milestoneProgressId: progress.id,
                            },
                        }).then((milestoneRequirementProgress) => {
                            milestoneRequirementProgress.forEach(async (progress) => {
                                await prisma.milestoneRequirementProgress.update({
                                    where: {
                                        id: progress.id,
                                    },
                                    data: {
                                        completed: false,
                                        currentValue: Math.max(0, progress.currentValue - 1),
                                    },
                                });
                            });
                        });
                    });
                });
            });
        });

        return NextResponse.json({ message: "Request removed from database" });
    } catch (error) {
        console.error("Error processing data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 