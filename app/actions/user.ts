'use server'

import { z } from "zod"
import { onboardingSchema } from "@/lib/validations/onboarding"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Archetype } from "@prisma/client"

export async function createUser(data: z.infer<typeof onboardingSchema>) {
    // Next.js may wrap the data in an array when called from client components
    const unwrappedData = Array.isArray(data) ? data[0] : data

    const result = onboardingSchema.safeParse(unwrappedData)

    if (!result.success) {
        console.error("Validation error:", result.error)
        return { error: "Invalid data" }
    }

    const { warmth1, warmth2, competence1, competence2 } = result.data

    const warmthScore = warmth1 + warmth2
    const competenceScore = competence1 + competence2

    let archetype: Archetype = Archetype.CHARMER

    if (warmthScore > competenceScore + 1) {
        archetype = Archetype.PUSHOVER
    } else if (competenceScore > warmthScore + 1) {
        archetype = Archetype.COLD_FISH
    } else {
        // Balanced or low/low, high/high
        archetype = Archetype.CHARMER
    }

    // Create User
    // Note: In a real app we'd use Auth (Supabase Auth). 
    // Here we are creating an anonymous user or "guest" account for the prototype.
    // We'll generate a random email or just use ID. 
    // The schema requires email. Let's generate a fake one for now based on UUID.

    const tempId = crypto.randomUUID()

    const user = await prisma.user.create({
        data: {
            email: `guest_${tempId}@example.com`,
            archetype,
            warmthScore,
            competenceScore,
        },
    })

    // Set Cookie
    const cookieStore = await cookies()
    cookieStore.set("userId", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
    })

    redirect("/dashboard")
}
