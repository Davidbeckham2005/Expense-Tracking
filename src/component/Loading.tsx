import { motion } from "motion/react"

export default function Loading() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-screen text-muted-foreground overflow-hidden bg-background"
        >
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Đang tải...</p>
            </div>
        </motion.div>
    )
}
