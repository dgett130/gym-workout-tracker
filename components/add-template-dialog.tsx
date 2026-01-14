"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { saveTemplate, type Exercise } from "@/lib/workout-storage"

interface AddTemplateDialogProps {
    onTemplateAdded?: () => void
}

export function AddTemplateDialog({ onTemplateAdded }: AddTemplateDialogProps) {
    const { toast } = useToast()
    const [open, setOpen] = useState(false)
    const [exercise, setExercise] = useState<Exercise>({
        name: "",
        sets: "",
        reps: "",
        weight: "",
    })

    const updateField = (field: keyof Exercise, value: string) => {
        setExercise({ ...exercise, [field]: value })
    }

    const handleSave = async () => {
        if (!exercise.name.trim() || !exercise.sets || !exercise.reps || !exercise.weight) {
            toast({
                title: "Errore",
                description: "Compila tutti i campi",
                variant: "destructive",
            })
            return
        }

        const success = await saveTemplate(exercise)

        if (success) {
            toast({
                title: "Template salvato!",
                description: `"${exercise.name}" è stato aggiunto ai tuoi template`,
            })

            setExercise({ name: "", sets: "", reps: "", weight: "" })
            setOpen(false)
            onTemplateAdded?.()
        } else {
            toast({
                title: "Errore",
                description: "Impossibile salvare il template",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi Template
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crea Template Esercizio</DialogTitle>
                    <DialogDescription>
                        Crea un template personalizzato per aggiungere velocemente esercizi ricorrenti
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="template-name">Nome esercizio</Label>
                        <Input
                            id="template-name"
                            placeholder="es. Panca Piana"
                            value={exercise.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            className="mt-1.5"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <Label htmlFor="template-sets">Serie</Label>
                            <Input
                                id="template-sets"
                                type="number"
                                placeholder="3"
                                value={exercise.sets}
                                onChange={(e) => updateField("sets", e.target.value)}
                                className="mt-1.5"
                            />
                        </div>

                        <div>
                            <Label htmlFor="template-reps">Reps</Label>
                            <Input
                                id="template-reps"
                                type="number"
                                placeholder="10"
                                value={exercise.reps}
                                onChange={(e) => updateField("reps", e.target.value)}
                                className="mt-1.5"
                            />
                        </div>

                        <div>
                            <Label htmlFor="template-weight">Peso (kg)</Label>
                            <Input
                                id="template-weight"
                                type="number"
                                placeholder="40"
                                value={exercise.weight}
                                onChange={(e) => updateField("weight", e.target.value)}
                                className="mt-1.5"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Annulla
                    </Button>
                    <Button onClick={handleSave}>Salva Template</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
