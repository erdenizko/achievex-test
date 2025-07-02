import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { memberId, amount } = body;
        const token = req.headers.get("x-api-key");

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!memberId || !amount) {
            return NextResponse.json({ message: 'Missing memberId or amount' }, { status: 400 });
        }

        console.log(`Processing deposit for member ${memberId} with amount ${amount}`);

        const orgToken = await prisma.organizationToken.findUnique({
            where: { token },
        });

        if (!orgToken) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const member = await prisma.member.findFirst({
            where: {
                externalId: memberId,
            },
        });

        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }

        // Mocking a successful response
        const response = {
            success: true,
            message: 'Deposit processed successfully',
            data: {
                memberId,
                amount,
                transactionId: `txn_${Date.now()}`
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error processing deposit:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 