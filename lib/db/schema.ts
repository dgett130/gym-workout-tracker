import { relations } from "drizzle-orm"
import { pgTable, serial, text, timestamp, uuid, integer } from "drizzle-orm/pg-core"

export const workouts = pgTable("workouts", {
    id: serial("id").primaryKey(),
    date: text("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const workoutsRelations = relations(workouts, ({ many }) => ({
    exercises: many(exercises),
}))

export const exercises = pgTable("exercises", {
    id: serial("id").primaryKey(),
    workoutId: integer("workout_id").references(() => workouts.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    sets: text("sets").notNull(),
    reps: text("reps").notNull(),
    weight: text("weight").notNull(),
})

export const exercisesRelations = relations(exercises, ({ one }) => ({
    workout: one(workouts, {
        fields: [exercises.workoutId],
        references: [workouts.id],
    }),
}))

export const templates = pgTable("templates", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    sets: text("sets").notNull(),
    reps: text("reps").notNull(),
    weight: text("weight").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})
