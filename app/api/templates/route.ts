import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

export interface Exercise {
    name: string
    sets: string
    reps: string
    weight: string
}

export interface ExerciseTemplate extends Exercise {
    id: string
}

const DATA_FILE = path.join(process.cwd(), "data", "templates.json")

async function ensureDataFile() {
    try {
        await fs.access(DATA_FILE)
    } catch {
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
        await fs.writeFile(DATA_FILE, JSON.stringify([]))
    }
}

async function readTemplates(): Promise<ExerciseTemplate[]> {
    await ensureDataFile()
    const content = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(content)
}

async function writeTemplates(templates: ExerciseTemplate[]): Promise<void> {
    await ensureDataFile()
    await fs.writeFile(DATA_FILE, JSON.stringify(templates, null, 2))
}

export async function GET() {
    try {
        const templates = await readTemplates()
        return NextResponse.json(templates)
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

        const templates = await readTemplates()

        // Create new template with unique ID
        const newTemplate: ExerciseTemplate = {
            id: randomUUID(),
            ...exercise,
        }

        templates.push(newTemplate)
        await writeTemplates(templates)

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

        const templates = await readTemplates()
        const filtered = templates.filter((t) => t.id !== id)

        await writeTemplates(filtered)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[v0] Error deleting template:", error)
        return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
    }
}
