'use server'

import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { Archetype, Category } from "@prisma/client"

export async function getDailyCue() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) return null

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            logs: {
                where: {
                    completedAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today start
                    },
                },
                include: { cue: true },
            },
        },
    })

    if (!user) return null

    // 1. Check if already completed today
    if (user.logs.length > 0) {
        return {
            cue: user.logs[0].cue,
            isCompleted: true,
        }
    }

    // 2. Select a new cue based on Archetype
    // Strategy: Target weakness
    // PUSHOVER (High Warmth, Low Comp) -> Need COMPETENCE
    // COLD_FISH (Low Warmth, High Comp) -> Need WARMTH
    // CHARMER (Balanced) -> Random

    let targetCategory: Category | undefined

    if (user.archetype === Archetype.PUSHOVER) {
        targetCategory = Category.COMPETENCE
    } else if (user.archetype === Archetype.COLD_FISH) {
        targetCategory = Category.WARMTH
    }
    // Charmer gets random (undefined category filter)

    // Fetch candidate cues
    // In a real app, we'd filter out *all* previously completed cues.
    // For MVP, we'll just pick a random one from the target category.

    const whereClause = targetCategory ? { category: targetCategory } : {}

    const count = await prisma.cue.count({ where: whereClause })
    const skip = Math.floor(Math.random() * count)

    const cues = await prisma.cue.findMany({
        where: whereClause,
        take: 1,
        skip: skip,
    })

    if (cues.length === 0) {
        // Fallback if no cues found (shouldn't happen if seeded)
        return null
    }

    return {
        cue: cues[0],
        isCompleted: false,
    }
}

export async function completeCue(cueId: string, reflection: string) {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) throw new Error("Unauthorized")

    const cue = await prisma.cue.findUnique({ where: { id: cueId } })
    if (!cue) throw new Error("Cue not found")

    // Transaction to ensure data integrity
    await prisma.$transaction(async (tx) => {
        // 1. Create Log
        await tx.cueLog.create({
            data: {
                userId,
                cueId,
                reflection,
            },
        })

        // 2. Update User Stats
        const updateData: any = {
            currentStreak: { increment: 1 },
        }

        if (cue.category === Category.WARMTH) {
            updateData.warmthScore = { increment: 1 }
        } else if (cue.category === Category.COMPETENCE) {
            updateData.competenceScore = { increment: 1 }
        }

        await tx.user.update({
            where: { id: userId },
            data: updateData,
        })
    })

    revalidatePath("/dashboard")
}
