"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkoutForm, type WorkoutFormRef } from "@/components/workout-form"
import { WorkoutHistory } from "@/components/workout-history"
import { RecentExercises } from "@/components/recent-exercises"
import { useRef, useState } from "react"
import type { Exercise } from "@/lib/workout-storage"

export function MainContent() {
    const [refreshKey, setRefreshKey] = useState(0)
    const workoutFormRef = useRef<WorkoutFormRef>(null)

    const handleWorkoutSaved = () => {
        setRefreshKey((prev) => prev + 1)
    }

    const handleExerciseSelect = (exercise: Exercise) => {
        workoutFormRef.current?.addExerciseFromTemplate(exercise)
    }

    return (
        <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="today">Oggi</TabsTrigger>
                <TabsTrigger value="history">Storico</TabsTrigger>
            </TabsList>
            <TabsContent value="today" className="space-y-6">
                <RecentExercises key={`recent-${refreshKey}`} onExerciseSelect={handleExerciseSelect} />

                <WorkoutForm ref={workoutFormRef} onWorkoutSaved={handleWorkoutSaved} />
            </TabsContent>
            <TabsContent value="history">
                <WorkoutHistory key={`history-${refreshKey}`} />
            </TabsContent>
        </Tabs>
    )
}
