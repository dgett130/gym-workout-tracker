import { relations } from "drizzle-orm"
import { pgTable, serial, text, timestamp, uuid, integer } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
    workouts: many(workouts),
    templates: many(templates),
}))

export const workouts = pgTable("workouts", {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id), // Nullable for now to support existing data
    date: text("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
    user: one(users, {
        fields: [workouts.userId],
        references: [users.id],
    }),
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
    userId: uuid("user_id").references(() => users.id), // Nullable for now
    name: text("name").notNull(),
    sets: text("sets").notNull(),
    reps: text("reps").notNull(),
    weight: text("weight").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const templatesRelations = relations(templates, ({ one }) => ({
    user: one(users, {
        fields: [templates.userId],
        references: [users.id],
    }),
}))
