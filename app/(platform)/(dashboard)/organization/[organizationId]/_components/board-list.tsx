import { FormPopover } from "@/components/form/form-popover"
import {  User2 } from "lucide-react"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"


export const BoardList = async () => {
    const { orgId } = auth();
    if (!orgId) {
        return redirect("/select-org");
    }
    const boards = await db.board.findMany({
        where: {
            orgId
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    
    return (
        <div className="space-y-4">
            <div className="flex items-center font-semibold text-lg text-neutral-700">
                <User2 className="h-6 w-6 mr-2" />
                Your boards
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {boards.map((board) => (
                    <Link key={board.id} href={`/board/${board.id}`}
                        style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
                        className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                        <p className="relative font-semibold text-white">
                            {board.title}
                        </p>
                    </Link>
                ))}
                <FormPopover sideOffset={10} side="right">
                <div role="button" className="aspect-video relative w-full h-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition">
                    <p className="text0sm">Create new board</p>
                    </div>
                    </FormPopover>
            </div>
        </div>
    )
}
BoardList.Skeleton = function SkeletonBoardList() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Skeleton className="aspect-video h-full w-full p-2" />
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2" />
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
            <Skeleton className="aspect-video h-full w-full p-2"/>
        </div>
    )
}