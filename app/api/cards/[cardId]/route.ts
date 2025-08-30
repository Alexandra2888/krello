import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: { cardId: string } }
) {
    try {
        // Validate cardId parameter
        if (!params.cardId || params.cardId === "undefined") {
            return new NextResponse("Invalid card ID", { status: 400 });
        }

        const { userId, orgId } = auth();
        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const card = await db.card.findUnique({
            where: {
                id: params.cardId,
                list: {
                    board: {
                        orgId
                    },
                },
            },
            include: {
                list: {
                    select: {
                        title: true
                    }
                }
            }
        });

        if (!card) {
            return new NextResponse("Card not found", { status: 404 });
        }

        return NextResponse.json(card);
    } catch (error) {
        console.error("Card API Error:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}