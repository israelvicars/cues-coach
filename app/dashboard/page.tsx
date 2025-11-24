import { getDailyCue } from "@/app/actions/cues"
import { DailyCueCard } from "@/components/daily-cue-card"
import { MotionCard } from "@/components/motion-card"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
        redirect("/onboarding")
    }

    const dailyCueData = await getDailyCue()

    if (!dailyCueData) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <h2 className="text-2xl font-bold">All caught up!</h2>
                <p className="text-muted-foreground">
                    You've mastered all available cues for your archetype. Check back later for more!
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="text-center space-y-2 mb-4">
                <h1 className="text-3xl font-bold tracking-tight">Today's Cue</h1>
                <p className="text-muted-foreground">
                    One small action to boost your charisma.
                </p>
            </div>

            <MotionCard delay={0.2} className="w-full max-w-md">
                <DailyCueCard
                    cue={dailyCueData.cue}
                    isCompleted={dailyCueData.isCompleted}
                />
            </MotionCard>
        </div>
    )
}
