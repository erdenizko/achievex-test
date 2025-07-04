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

        const milestone = await prisma.milestone.findUnique({
            where: {
                id: body.milestoneId,
            },
        });

        if (!milestone) {
            return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
        }

        let milestoneProgress = await prisma.milestoneProgress.findFirst({
            where: {
                memberId: member.id,
                milestoneId: body.milestoneId,
            }
        });

        // Create milestone progress if it doesn't exist
        if (!milestoneProgress) {
            milestoneProgress = await prisma.milestoneProgress.create({
                data: {
                    memberId: member.id,
                    milestoneId: body.milestoneId,
                    completed: false,
                    currentStreak: 0,
                    milestoneRequirementsIds: [],
                }
            });
        }

        if(milestoneProgress.completed) {
            return NextResponse.json({ error: "Milestone already completed" }, { status: 400 });
        }


        if(milestone.isStreakBased) {
            await prisma.milestoneProgress.update({
                where: {
                    id: milestoneProgress.id,
                    memberId: member.id
                },
                data: {
                    completed: milestone.streakDuration ? ((milestoneProgress.currentStreak + 1) >= milestone.streakDuration) : true,
                    currentStreak: milestone.isStreakBased ? milestoneProgress.currentStreak + 1 : 0,
                },
            });
        } else {
            await prisma.milestoneProgress.update({
                where: {
                    id: milestoneProgress.id,
                    memberId: member.id
                },
                data: {
                    completed: true,
                },
            });
        }

        await prisma.member.update({
            where: {
                id: member.id,
            },
            data: {
                totalPoints: member.totalPoints + milestone.rewardPoints,
                spendablePoints: member.spendablePoints + milestone.rewardPoints,
            },
        });

        return NextResponse.json({ message: "We processed your request" });
    } catch (error) {
        console.error("Error processing data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 