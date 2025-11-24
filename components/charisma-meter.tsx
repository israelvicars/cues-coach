'use client'

import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface CharismaMeterProps {
    warmth: number
    competence: number
}

export function CharismaMeter({ warmth, competence }: CharismaMeterProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Calculate percentages relative to total + buffer to avoid 0/0 division issues
    // or just relative to a "max" level if we had levels.
    // For now, let's show them relative to each other or just raw scale if we assume a max per level.
    // Let's assume a "Level" cap of 100 for now, or just show them side by side.

    // Better visualization: Balance. 
    // But for simple progress bars, let's just assume a max of 20 for the MVP "level 1".
    const MAX_SCORE = Math.max(20, warmth, competence)

    const warmthPercent = (warmth / MAX_SCORE) * 100
    const competencePercent = (competence / MAX_SCORE) * 100

    return (
        <div className="space-y-4 w-full">
            <div className="space-y-1">
                <div className="flex justify-between text-sm font-medium">
                    <span className="text-warmth-dark">Warmth</span>
                    <span>{warmth}</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-warmth/20">
                    <motion.div
                        className="h-full bg-warmth rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${mounted ? warmthPercent : 0}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-sm font-medium">
                    <span className="text-competence-dark">Competence</span>
                    <span>{competence}</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-competence/20">
                    <motion.div
                        className="h-full bg-competence rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${mounted ? competencePercent : 0}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                    />
                </div>
            </div>
        </div>
    )
}
