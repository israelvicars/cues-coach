import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function LibraryPage() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) redirect("/onboarding")

    const logs = await prisma.cueLog.findMany({
        where: { userId },
        include: { cue: true },
        orderBy: { completedAt: 'desc' }
    })

    // Group by Category
    const groupedLogs = logs.reduce((acc, log) => {
        const category = log.cue.category
        if (!acc[category]) acc[category] = []
        acc[category].push(log)
        return acc
    }, {} as Record<string, typeof logs>)

    return (
        <div className="space-y-6 pb-20">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Your Library</h1>
                <p className="text-muted-foreground">
                    A collection of all the social cues you've mastered.
                </p>
            </div>

            {logs.length === 0 ? (
                <Card className="bg-muted/50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                        <p className="text-muted-foreground">No cues completed yet.</p>
                        <p className="text-sm text-muted-foreground">Start your daily mission to fill this up!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedLogs).map(([category, categoryLogs]) => (
                        <div key={category} className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${category === 'WARMTH' ? 'bg-warmth' : 'bg-competence'
                                    }`} />
                                {category}
                            </h2>

                            <Accordion type="single" collapsible className="w-full space-y-2">
                                {categoryLogs.map((log) => (
                                    <AccordionItem key={log.id} value={log.id} className="border rounded-xl px-4 bg-card">
                                        <AccordionTrigger className="hover:no-underline py-4">
                                            <div className="flex flex-col items-start text-left gap-1">
                                                <span className="font-semibold text-base">{log.cue.title}</span>
                                                <span className="text-xs text-muted-foreground font-normal">
                                                    {new Date(log.completedAt).toLocaleDateString(undefined, {
                                                        month: 'short', day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-4 pt-1 space-y-3">
                                            <div className="bg-muted/30 p-3 rounded-lg text-sm">
                                                <span className="font-semibold block mb-1 text-xs uppercase text-muted-foreground">Reflection</span>
                                                "{log.reflection}"
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                <span className="font-semibold text-foreground">Tip: </span>
                                                {log.cue.description}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
