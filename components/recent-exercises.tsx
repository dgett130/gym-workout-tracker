"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dumbbell, Star, X } from "lucide-react"
import { getRecentExercises, getTemplates, deleteTemplate, type Exercise, type ExerciseTemplate } from "@/lib/workout-storage"
import { AddTemplateDialog } from "@/components/add-template-dialog"
import { useToast } from "@/hooks/use-toast"

interface RecentExercisesProps {
    onExerciseSelect?: (exercise: Exercise) => void
}

export function RecentExercises({ onExerciseSelect }: RecentExercisesProps) {
    const { toast } = useToast()
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [templates, setTemplates] = useState<ExerciseTemplate[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const [recentExercises, exerciseTemplates] = await Promise.all([
            getRecentExercises(),
            getTemplates(),
        ])
        setExercises(recentExercises)
        setTemplates(exerciseTemplates)
        setLoading(false)
    }

    const handleDeleteTemplate = async (id: string, name: string) => {
        const success = await deleteTemplate(id)

        if (success) {
            toast({
                title: "Template eliminato",
                description: `"${name}" è stato rimosso dai template`,
            })
            loadData()
        } else {
            toast({
                title: "Errore",
                description: "Impossibile eliminare il template",
                variant: "destructive",
            })
        }
    }

    return (
        <Card id="recent-exercises" className="mb-8">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Dumbbell className="h-5 w-5" />
                            Esercizi Recenti
                        </CardTitle>
                        <CardDescription>Clicca su un esercizio per aggiungerlo rapidamente</CardDescription>
                    </div>
                    <AddTemplateDialog onTemplateAdded={loadData} />
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center text-muted-foreground py-4">
                        Caricamento...
                    </div>
                ) : templates.length === 0 && exercises.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">
                        Nessun esercizio recente. Aggiungi il tuo primo allenamento o crea un template!
                    </div>
                ) : (
                    <div className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:overflow-visible">
                        {/* Templates first */}
                        {templates.map((template) => (
                            <Badge
                                key={template.id}
                                variant="outline"
                                className="flex-shrink-0 cursor-pointer flex-col items-start gap-1 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[200px] md:min-w-0 relative group"
                                onClick={() => onExerciseSelect?.(template)}
                            >
                                <div className="flex items-center gap-1 w-full">
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                    <div className="font-semibold text-sm flex-1">{template.name}</div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity -mr-2"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteTemplate(template.id, template.name)
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {template.sets} serie × {template.reps} reps @ {template.weight}kg
                                </div>
                            </Badge>
                        ))}

                        {/* Recent exercises */}
                        {exercises.map((exercise, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="flex-shrink-0 cursor-pointer flex-col items-start gap-1 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[200px] md:min-w-0"
                                onClick={() => onExerciseSelect?.(exercise)}
                            >
                                <div className="font-semibold text-sm">{exercise.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {exercise.sets} serie × {exercise.reps} reps @ {exercise.weight}kg
                                </div>
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
