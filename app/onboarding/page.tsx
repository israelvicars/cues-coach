'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createUser } from "@/app/actions/user"
import { toast } from "sonner"

const QUESTIONS = [
    {
        id: "warmth1",
        text: "When you enter a room, do you feel like you need to earn people's attention?",
        lowLabel: "Never",
        highLabel: "Always",
    },
    {
        id: "warmth2",
        text: "Do you prioritize keeping the peace over getting your way?",
        lowLabel: "Rarely",
        highLabel: "Mostly",
    },
    {
        id: "competence1",
        text: "Do you enjoy taking charge of a group decision?",
        lowLabel: "Avoid it",
        highLabel: "Love it",
    },
    {
        id: "competence2",
        text: "Do people describe you as 'intense' or 'serious'?",
        lowLabel: "Never",
        highLabel: "Often",
    },
]

export default function OnboardingPage() {
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [isPending, startTransition] = useTransition()

    const currentQuestion = QUESTIONS[step]
    const progress = ((step + 1) / QUESTIONS.length) * 100

    const handleAnswer = (value: number) => {
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
    }

    const handleNext = () => {
        if (step < QUESTIONS.length - 1) {
            setStep(step + 1)
        } else {
            handleSubmit()
        }
    }

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                await createUser({
                    warmth1: answers.warmth1,
                    warmth2: answers.warmth2,
                    competence1: answers.competence1,
                    competence2: answers.competence2,
                })
            } catch (error) {
                toast.error("Something went wrong. Please try again.")
            }
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md shadow-lg border-2 border-brand/10">
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground font-medium">
                            Question {step + 1} of {QUESTIONS.length}
                        </span>
                        <span className="text-xs text-muted-foreground">The Charisma Audit</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                    <CardTitle className="text-xl md:text-2xl font-bold leading-tight text-center">
                        {currentQuestion.text}
                    </CardTitle>

                    <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((val) => (
                            <Button
                                key={val}
                                variant={answers[currentQuestion.id] === val ? "default" : "outline"}
                                className={`h-12 text-lg font-semibold transition-all ${answers[currentQuestion.id] === val
                                        ? "bg-brand hover:bg-brand/90 text-white scale-105 shadow-md"
                                        : "hover:border-brand/50 hover:text-brand"
                                    }`}
                                onClick={() => handleAnswer(val)}
                            >
                                {val}
                            </Button>
                        ))}
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                        <span>{currentQuestion.lowLabel}</span>
                        <span>{currentQuestion.highLabel}</span>
                    </div>
                </CardContent>

                <CardFooter className="pt-4">
                    <Button
                        className="w-full h-12 text-lg bg-brand hover:bg-brand/90 text-white rounded-xl"
                        disabled={!answers[currentQuestion.id] || isPending}
                        onClick={handleNext}
                    >
                        {isPending ? "Analyzing..." : step === QUESTIONS.length - 1 ? "Finish" : "Next"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
