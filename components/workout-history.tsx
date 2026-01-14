"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getWorkouts, deleteWorkout, type Workout } from "@/lib/workout-storage"
import { Calendar, Dumbbell, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function WorkoutHistory() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const { toast } = useToast()

  const loadWorkouts = async () => {
    const data = await getWorkouts()
    setWorkouts(data)
  }

  useEffect(() => {
    loadWorkouts()
  }, [])

  const handleDelete = async (date: string) => {
    const success = await deleteWorkout(date)
    if (success) {
      await loadWorkouts()
      toast({
        title: "Allenamento eliminato",
        description: `Allenamento del ${date} rimosso`,
      })
    } else {
      toast({
        title: "Errore",
        description: "Impossibile eliminare l'allenamento",
        variant: "destructive",
      })
    }
  }

  if (workouts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Dumbbell className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Nessun allenamento registrato</p>
          <p className="text-sm text-muted-foreground mt-2">Inizia ad aggiungere i tuoi esercizi!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Card key={workout.date}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">{workout.date}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(workout.date)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>{workout.exercises.length} esercizi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workout.exercises.map((exercise, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{exercise.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {exercise.sets}x{exercise.reps} - {exercise.weight}kg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
