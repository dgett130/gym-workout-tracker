
import { db } from "../lib/db/db"
import { workouts, exercises, templates } from "../lib/db/schema"
import { promises as fs } from "fs"
import path from "path"
import * as dotenv from "dotenv"

// Load env vars
dotenv.config({ path: ".env.local" })

async function migrate() {
    console.log("Starting migration...")

    try {
        // 1. Migrate Workouts
        const workoutsPath = path.join(process.cwd(), "data", "workouts.json")
        try {
            const workoutsData = JSON.parse(await fs.readFile(workoutsPath, "utf-8"))

            console.log(`Found ${workoutsData.length} workouts to migrate`)

            for (const w of workoutsData) {
                // Create workout
                const [newWorkout] = await db
                    .insert(workouts)
                    .values({ date: w.date })
                    .returning({ id: workouts.id })

                // Create exercises
                if (w.exercises && w.exercises.length > 0) {
                    await db.insert(exercises).values(
                        w.exercises.map((ex: any) => ({
                            workoutId: newWorkout.id,
                            name: ex.name,
                            sets: ex.sets.toString(),
                            reps: ex.reps.toString(),
                            weight: ex.weight.toString(),
                        }))
                    )
                }
            }
            console.log("Workouts migration completed")
        } catch (e) {
            console.log("No workouts.json found or empty, skipping...")
        }

        // 2. Migrate Templates
        const templatesPath = path.join(process.cwd(), "data", "templates.json")
        try {
            const templatesData = JSON.parse(await fs.readFile(templatesPath, "utf-8"))

            console.log(`Found ${templatesData.length} templates to migrate`)

            if (templatesData.length > 0) {
                await db.insert(templates).values(
                    templatesData.map((t: any) => ({
                        name: t.name,
                        sets: t.sets.toString(),
                        reps: t.reps.toString(),
                        weight: t.weight.toString(),
                    }))
                )
            }
            console.log("Templates migration completed")
        } catch (e) {
            console.log("No templates.json found or empty, skipping...")
        }

        console.log("Migration finished successfully!")
    } catch (error) {
        console.error("Migration failed:", error)
    }

    process.exit(0)
}

migrate()
