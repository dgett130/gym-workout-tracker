"use client"

import { useState, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { saveWorkout, type Exercise } from "@/lib/workout-storage"

interface WorkoutFormProps {
  onWorkoutSaved?: () => void
}

export interface WorkoutFormRef {
  addExerciseFromTemplate: (exercise: Exercise) => void
}

export const WorkoutForm = forwardRef<WorkoutFormRef, WorkoutFormProps>(({ onWorkoutSaved }, ref) => {

  const { toast } = useToast()
  const [exercises, setExercises] = useState<Exercise[]>([{ name: "", sets: "", reps: "", weight: "" }])

  useImperativeHandle(ref, () => ({
    addExerciseFromTemplate: (exercise: Exercise) => {
      setExercises([...exercises, { ...exercise }])
    },
  }))

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", weight: "" }])
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: keyof Exercise, value: string) => {
    const newExercises = [...exercises]
    newExercises[index][field] = value
    setExercises(newExercises)
  }

  const handleSave = async () => {
    const validExercises = exercises.filter((ex) => ex.name.trim() && ex.sets && ex.reps && ex.weight)

    if (validExercises.length === 0) {
      toast({
        title: "Errore",
        description: "Inserisci almeno un esercizio completo",
        variant: "destructive",
      })
      return
    }

    const today = new Date().toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    const success = await saveWorkout(today, validExercises)

    if (success) {
      toast({
        title: "Allenamento salvato!",
        description: `${validExercises.length} esercizi salvati per oggi`,
      })

      setExercises([{ name: "", sets: "", reps: "", weight: "" }])
      onWorkoutSaved?.()
    } else {
      toast({
        title: "Errore",
        description: "Impossibile salvare l'allenamento",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allenamento di oggi</CardTitle>
        <CardDescription>Inserisci gli esercizi che stai facendo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {exercises.map((exercise, index) => (
          <div key={index} className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Esercizio {index + 1}</Label>
              {exercises.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeExercise(index)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor={`name-${index}`}>Nome esercizio</Label>
                <Input
                  id={`name-${index}`}
                  placeholder="es. Leg Extension"
                  value={exercise.name}
                  onChange={(e) => updateExercise(index, "name", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor={`sets-${index}`}>Serie</Label>
                  <Input
                    id={`sets-${index}`}
                    type="number"
                    placeholder="3"
                    value={exercise.sets}
                    onChange={(e) => updateExercise(index, "sets", e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor={`reps-${index}`}>Reps</Label>
                  <Input
                    id={`reps-${index}`}
                    type="number"
                    placeholder="10"
                    value={exercise.reps}
                    onChange={(e) => updateExercise(index, "reps", e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor={`weight-${index}`}>Peso (kg)</Label>
                  <Input
                    id={`weight-${index}`}
                    type="number"
                    placeholder="40"
                    value={exercise.weight}
                    onChange={(e) => updateExercise(index, "weight", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={addExercise} variant="outline" className="w-full sm:w-auto bg-transparent">
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi esercizio
          </Button>

          <Button onClick={handleSave} className="w-full sm:flex-1">
            Salva allenamento
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

WorkoutForm.displayName = "WorkoutForm"

