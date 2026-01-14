import { NextResponse } from "next/server"
import { db } from "@/lib/db/db"
import { templates } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { auth } from "@/auth"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const userId = session.user.id

        const allTemplates = await db.select()
            .from(templates)
            .where(eq(templates.userId, userId))
            .orderBy(desc(templates.createdAt))

        return NextResponse.json(allTemplates)
    } catch (error) {
        console.error("[v0] Error reading templates:", error)
        return NextResponse.json({ error: "Failed to read templates" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const userId = session.user.id

        const exercise = await request.json()

        if (!exercise.name || !exercise.sets || !exercise.reps || !exercise.weight) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 })
        }

        const [newTemplate] = await db.insert(templates).values({
            userId,
            name: exercise.name,
            sets: exercise.sets.toString(),
            reps: exercise.reps.toString(),
            weight: exercise.weight.toString(),
        }).returning()

        return NextResponse.json({ success: true, template: newTemplate })
    } catch (error) {
        console.error("[v0] Error saving template:", error)
        return NextResponse.json({ error: "Failed to save template" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const userId = session.user.id

        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 })
        }

        // Ensure we only delete templates belonging to the user
        await db.delete(templates)
            .where(and(
                eq(templates.id, id),
                eq(templates.userId, userId)
            ))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[v0] Error deleting template:", error)
        return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
    }
}
