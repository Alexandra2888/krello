import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ENTITY_TYPE } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { cardId: string } }) {
    try {
        // Validate cardId parameter
        if (!params.cardId || params.cardId === "undefined") {
            return new NextResponse("Invalid card ID", { status: 400 });
        }

        const { userId, orgId } = auth();
        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const auditLogs = await db.auditLog.findMany({
            where: {
                orgId, 
                entityId: params.cardId, 
                entityType: ENTITY_TYPE.CARD
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 3
        });
        
        return NextResponse.json(auditLogs);

    } catch (error) {
        console.error("Card Logs API Error:", error);
        return new NextResponse('Internal error', {
            status: 500
        });
    }
}