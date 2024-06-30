"use server"

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCard } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Not authorized",
        };
    }

    const { title, boardId, listId } = data
    let card;

    try {
        const list = await db.list.findUnique({
            where: {
                id: listId,
                board: {
                    orgId
                },
            },
        });
        if (!list) {
            return {error:"List not found"}
        }

        const lastcard = await db.card.findFirst({
            where: {
                listId
            },
            orderBy: {
                order: "desc"
            },
            select: { order: true }
        });
        const newOrder = lastcard ? lastcard.order + 1 : 1;
        card = await db.card.create({
            data: {
                title, listId, order: newOrder
            }
        });

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE
        })

        await createAuditLog({
            entityTitle: card.title,
            entityId: card.id,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE,
        })
        
        } catch (error) {
            return {
                error: "Failed to create a list"
            }
    }
    


    revalidatePath(`/board/${boardId}`);
    return { data: card };
};

export const createCard = createSafeAction(CreateCard, handler)