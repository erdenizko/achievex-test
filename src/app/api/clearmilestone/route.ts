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
        console.log("body", body);
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

        await prisma.milestoneProgress.findMany({
            where: {
                memberId: member.id,
            },
        }).then((milestones) => {
            milestones.forEach(async (milestoneProgress) => {
                await prisma.milestoneRequirementProgress.deleteMany({
                    where: {
                        milestoneProgressId: milestoneProgress.id,
                    },
                });
                await prisma.milestoneProgress.delete({
                    where: {
                        id: milestoneProgress.id,
                    },
                });
            });
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