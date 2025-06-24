import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const token = request.headers.get("x-api-key");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const organisationId = await prisma.organizationToken.findFirst({
      where: {
        token,
      },
      select: {
        organizationId: true,
      },
    });

    if (!organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(organisationId);
    const tasks = await prisma.task.findMany({
      where: {
        organizationId: organisationId?.organizationId,
      },
    });

    const tasksWithMilestones = await prisma.milestone.findMany({
      where: {
        organizationId: organisationId?.organizationId,
        isActive: true,
        requirements: {
          some: {
            taskId: {
              in: tasks.map((task: { id: string }) => task.id),
            },
          },
        },
      },
      include: {
        requirements: true,
      },
    });

    const tasksWithMilestonesData = tasks.map((task) => {
      const milestones = tasksWithMilestones.filter((milestone) =>
        milestone.requirements.some(
          (requirement) => requirement.taskId === task.id
        )
      );
      return {
        ...task,
        milestones: milestones.map((milestone) => ({ name: milestone.name })),
      };
    });

    return NextResponse.json(tasksWithMilestonesData);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 