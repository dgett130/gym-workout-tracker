"use client"

import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import { useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

interface TourGuideProps {
    hasSeenGuide: boolean
}

export function TourGuide({ hasSeenGuide }: TourGuideProps) {
    const startTour = useCallback(() => {
        const driverObj = driver({
            showProgress: true,
            steps: [
                {
                    element: 'header',
                    popover: {
                        title: 'Benvenuto su Gym Tracker!',
                        description: 'Questa è la tua nuova dashboard per gestire tutti i tuoi allenamenti.'
                    }
                },
                {
                    element: '[value="today"]',
                    popover: {
                        title: 'Allenamento di Oggi',
                        description: 'Qui puoi inserire gli esercizi che stai svolgendo ora. Usa il form per aggiungere serie, ripetizioni e peso.'
                    }
                },
                {
                    element: '#recent-exercises',
                    popover: {
                        title: 'Esercizi Recenti e Template',
                        description: 'Qui troverai i tuoi esercizi preferiti e quelli usati di recente per un inserimento rapido. Clicca per aggiungerli subito!'
                    }
                },
                {
                    element: '[value="history"]',
                    popover: {
                        title: 'Storico',
                        description: 'Consulta tutti i tuoi allenamenti passati per monitorare i progressi.'
                    }
                },
                {
                    element: '#user-menu',
                    popover: {
                        title: 'Profilo Utente',
                        description: 'Qui puoi gestire il tuo account e fare logout.'
                    }
                }
            ],
            onDestroyed: async () => {
                // Update preference on server only if it wasn't seen before
                if (!hasSeenGuide) {
                    await fetch('/api/users/guide', { method: 'POST' });
                    // Ideally we should update local state via router refresh or prop, but simple fetch is fine for "set and forget"
                }
            }
        });

        driverObj.drive();
    }, [hasSeenGuide]);

    useEffect(() => {
        if (!hasSeenGuide) {
            // Small timeout to ensure DOM is ready
            setTimeout(() => startTour(), 1000)
        }
    }, [hasSeenGuide, startTour])

    return (
        <Button variant="ghost" size="icon" onClick={startTour} title="Guida introduttiva">
            <HelpCircle className="h-5 w-5" />
        </Button>
    )
}
