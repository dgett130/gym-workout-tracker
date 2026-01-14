"use client"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkoutForm, type WorkoutFormRef } from "@/components/workout-form"
import { WorkoutHistory } from "@/components/workout-history"
import { RecentExercises } from "@/components/recent-exercises"
import { Dumbbell } from "lucide-react"
import type { Exercise } from "@/lib/workout-storage"
import { TourGuide } from "@/components/tour-guide"
import { User } from "next-auth"

interface DashboardProps {
    user: User & { hasSeenGuide: boolean }
}

export function Dashboard({ user }: DashboardProps) {
    const [refreshKey, setRefreshKey] = useState(0)
    const workoutFormRef = useRef<WorkoutFormRef>(null)

    const handleWorkoutSaved = () => {
        setRefreshKey((prev) => prev + 1)
    }

    const handleExerciseSelect = (exercise: Exercise) => {
        workoutFormRef.current?.addExerciseFromTemplate(exercise)
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                                <Dumbbell className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">Gym Tracker</h1>
                                <p className="text-sm text-muted-foreground">Traccia i tuoi allenamenti</p>
                            </div>
                        </div>

                        <div id="user-menu" className="flex items-center gap-2">
                            <TourGuide hasSeenGuide={user.hasSeenGuide} />
                            {/* User menu placeholder or actual menu if needed */}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Tabs defaultValue="today" className="w-full mb-8">
                    <TabsList className="grid w-full grid-cols-2 mb-5">
                        <TabsTrigger value="today" className="text-base">
                            Oggi
                        </TabsTrigger>
                        <TabsTrigger value="history" className="text-base">
                            Storico
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="history" className="mt-0">
                        <WorkoutHistory key={refreshKey} />
                    </TabsContent>

                    <TabsContent value="today" className="mt-0">
                        <RecentExercises key={refreshKey} onExerciseSelect={handleExerciseSelect} />
                        <WorkoutForm ref={workoutFormRef} onWorkoutSaved={handleWorkoutSaved} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
