import { Flame, Home, Library, User } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    let streak = 0

    if (userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { currentStreak: true }
        })
        streak = user?.currentStreak || 0
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between px-4">
                    <span className="font-bold text-lg tracking-tight">The Cues Coach</span>
                    <div className="flex items-center gap-1 text-orange-500 font-semibold bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full text-sm">
                        <Flame className="w-4 h-4 fill-orange-500" />
                        <span>{streak}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container px-4 py-6">
                {children}
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background h-16 px-6 pb-safe safe-area-bottom">
                <div className="flex justify-between items-center h-full max-w-md mx-auto">
                    <Link href="/dashboard" className="flex flex-col items-center gap-1 text-brand">
                        <Home className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Daily</span>
                    </Link>
                    <Link href="/dashboard/library" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-brand transition-colors">
                        <Library className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Library</span>
                    </Link>
                    <Link href="/dashboard/profile" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-brand transition-colors">
                        <User className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Profile</span>
                    </Link>
                </div>
            </nav>
        </div>
    )
}
