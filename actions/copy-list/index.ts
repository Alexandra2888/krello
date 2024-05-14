"use server"

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyList } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id, boardId } = data
    let list;

    try {
        const listToCopy = await db.list.findUnique({
            where: {
              id,
              boardId,
              board: {
                orgId,
              },
            },
            include: {
              cards: true,
            },
          });
      
          if (!listToCopy) {
            return { error: "No lists" };
          }
      
          const lastList = await db.list.findFirst({
            where: { boardId },
            orderBy: { order: "desc" },
            select: { order: true },
          });
      
          const newOrder = lastList ? lastList.order + 1 : 1;
      
          list = await db.list.create({
            data: {
                boardId: listToCopy.boardId,
                title: `${listToCopy.title} - Copy`,
                order: newOrder,
            },
            include: {
                cards: true,
            },
        });
    } catch (error) {
        return {
            error: "Failed to copy"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data: list
    }
};

export const copyList = createSafeAction(CopyList, handler)