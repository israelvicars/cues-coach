import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CharismaMeter } from "@/components/charisma-meter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Trophy } from "lucide-react"

export default async function ProfilePage() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) redirect("/onboarding")

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            _count: {
                select: { logs: true }
            }
        }
    })

    if (!user) redirect("/onboarding")

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                <p className="text-muted-foreground">
                    Track your progress and charisma balance.
                </p>
            </div>

            {/* Archetype Card */}
            <Card className="bg-gradient-to-br from-brand/10 to-background border-brand/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Archetype
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-brand mb-2">
                        {user.archetype.replace('_', ' ')}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {user.archetype === 'PUSHOVER' && "High Warmth, growing Competence."}
                        {user.archetype === 'COLD_FISH' && "High Competence, growing Warmth."}
                        {user.archetype === 'CHARMER' && "Balanced Warmth and Competence."}
                    </p>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                        <Flame className="w-8 h-8 text-orange-500 mb-2" />
                        <div className="text-2xl font-bold">{user.currentStreak}</div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Day Streak</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                        <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
                        <div className="text-2xl font-bold">{user._count.logs}</div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Cues Done</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charisma Meter */}
            <Card>
                <CardHeader>
                    <CardTitle>Charisma Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <CharismaMeter
                        warmth={user.warmthScore}
                        competence={user.competenceScore}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
