import { sql } from "@vercel/postgres"
import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const workouts = pgTable("workouts", {
    id: serial("id").primaryKey(),
    date: text("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const exercises = pgTable("exercises", {
    id: serial("id").primaryKey(),
    workoutId: serial("workout_id").references(() => workouts.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    sets: text("sets").notNull(),
    reps: text("reps").notNull(),
    weight: text("weight").notNull(),
})

export const templates = pgTable("templates", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    sets: text("sets").notNull(),
    reps: text("reps").notNull(),
    weight: text("weight").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})
