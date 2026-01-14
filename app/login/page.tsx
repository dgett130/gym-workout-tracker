"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { authenticate } from "@/app/lib/actions"
import { useActionState } from "react"
import { Dumbbell } from "lucide-react"

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Dumbbell className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Accedi</CardTitle>
                    <CardDescription>Inserisci le tue credenziali per accedere</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={dispatch} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        {errorMessage && (
                            <div className="text-sm text-red-500 font-medium">
                                {errorMessage}
                            </div>
                        )}
                        <LoginButton />
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Non hai un account?{" "}
                        <Link href="/register" className="underline hover:text-primary">
                            Registrati
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function LoginButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Accesso in corso..." : "Accedi"}
        </Button>
    )
}
