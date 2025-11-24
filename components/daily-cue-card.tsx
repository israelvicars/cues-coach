'use client'

import { useState, useTransition } from "react"
import { Cue } from "@prisma/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea" // We might need to install this or use standard textarea
import { completeCue } from "@/app/actions/cues"
import { toast } from "sonner"
import { Drawer } from "vaul"
import { CheckCircle2, Flame } from "lucide-react"

interface DailyCueCardProps {
    cue: Cue
    isCompleted: boolean
}

export function DailyCueCard({ cue, isCompleted }: DailyCueCardProps) {
    const [isPending, startTransition] = useTransition()
    const [reflection, setReflection] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const handleComplete = () => {
        startTransition(async () => {
            try {
                await completeCue(cue.id, reflection)
                setIsOpen(false)
                toast.success(`Great job! ${cue.category === 'WARMTH' ? 'Warmth' : 'Competence'} +1`)
            } catch (error) {
                toast.error("Failed to complete cue")
            }
        })
    }

    if (isCompleted) {
        return (
            <Card className="w-full max-w-md border-2 border-green-500/20 bg-green-50/50 dark:bg-green-900/10">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-2 w-fit">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-xl text-green-700 dark:text-green-300">Mission Accomplished!</CardTitle>
                    <CardDescription>You completed "{cue.title}" today.</CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-6">
                    <p className="text-sm text-muted-foreground">
                        Come back tomorrow for your next challenge.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={`w-full max-w-md shadow-xl border-t-4 ${cue.category === 'WARMTH' ? 'border-t-warmth' : 'border-t-competence'
            }`}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${cue.category === 'WARMTH'
                                ? 'bg-warmth/10 text-warmth-dark'
                                : 'bg-competence/10 text-competence-dark'
                            }`}>
                            {cue.category}
                        </span>
                        <CardTitle className="mt-3 text-2xl">{cue.title}</CardTitle>
                    </div>
                    <Flame className={`w-6 h-6 ${cue.difficulty === 'Hard' ? 'text-red-500' : 'text-orange-400'
                        }`} />
                </div>
                <CardDescription className="text-base mt-2">
                    {cue.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                    <h4 className="font-semibold mb-1 text-sm uppercase text-muted-foreground">Instruction</h4>
                    <p className="text-lg font-medium leading-relaxed">
                        {cue.instruction}
                    </p>
                </div>
            </CardContent>

            <CardFooter>
                <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
                    <Drawer.Trigger asChild>
                        <Button className="w-full h-14 text-xl font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform bg-brand hover:bg-brand/90 text-white">
                            I Did It!
                        </Button>
                    </Drawer.Trigger>
                    <Drawer.Portal>
                        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 focus:outline-none">
                            <div className="p-4 bg-background rounded-t-[10px] flex-1">
                                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
                                <div className="max-w-md mx-auto">
                                    <Drawer.Title className="font-bold text-2xl mb-4">
                                        How did it go?
                                    </Drawer.Title>
                                    <p className="text-muted-foreground mb-6">
                                        Briefly reflect on what happened. Did you notice a difference?
                                    </p>

                                    <textarea
                                        className="w-full min-h-[150px] p-4 rounded-xl border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                        placeholder="I noticed that..."
                                        value={reflection}
                                        onChange={(e) => setReflection(e.target.value)}
                                    />

                                    <Button
                                        className="w-full mt-6 h-12 text-lg font-semibold bg-brand text-white"
                                        onClick={handleComplete}
                                        disabled={isPending}
                                    >
                                        {isPending ? "Saving..." : "Complete Mission"}
                                    </Button>
                                </div>
                            </div>
                        </Drawer.Content>
                    </Drawer.Portal>
                </Drawer.Root>
            </CardFooter>
        </Card>
    )
}
