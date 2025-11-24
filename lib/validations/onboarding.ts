import { z } from "zod"

export const onboardingSchema = z.object({
    // Warmth Questions 
    // Let's stick to the PRD's implication: 
    // Warmth vs Competence bias.
    // Q1: Warmth Indicator (e.g., "I find it easy to make people smile.")
    // Q2: Warmth Indicator (e.g., "I prioritize harmony over being right.")
    // Q3: Competence Indicator (e.g., "I enjoy taking charge of a group.")
    // Q4: Competence Indicator (e.g., "I focus on efficiency more than feelings.")

    // Let's make them explicit for the form:
    warmth1: z.number().min(1).max(5),
    warmth2: z.number().min(1).max(5),
    competence1: z.number().min(1).max(5),
    competence2: z.number().min(1).max(5),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>
