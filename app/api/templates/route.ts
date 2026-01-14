import { NextResponse } from "next/server"
import { db } from "@/lib/db/db"
import { templates } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET() {
    try {
        const allTemplates = await db.select().from(templates).orderBy(desc(templates.createdAt))
        return NextResponse.json(allTemplates)
    } catch (error) {
        console.error("[v0] Error reading templates:", error)
        return NextResponse.json({ error: "Failed to read templates" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const exercise = await request.json()

        if (!exercise.name || !exercise.sets || !exercise.reps || !exercise.weight) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 })
        }

        const [newTemplate] = await db.insert(templates).values({
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
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 })
        }

        await db.delete(templates).where(eq(templates.id, id))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[v0] Error deleting template:", error)
        return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
    }
}
