import { NextResponse } from "next/server"
import { db } from "@/lib/db/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await db.update(users)
            .set({ hasSeenGuide: true })
            .where(eq(users.id, session.user.id))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating user guide status:", error)
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
    }
}
