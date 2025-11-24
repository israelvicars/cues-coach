'use client'

import { motion } from "framer-motion"

interface MotionCardProps {
    children: React.ReactNode
    delay?: number
    className?: string
}

export function MotionCard({ children, delay = 0, className = "" }: MotionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98] // Custom spring-like easing
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
