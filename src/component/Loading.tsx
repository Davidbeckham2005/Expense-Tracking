import { motion } from "motion/react"

export default function Loading() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-screen text-gray-500 overflow-hidden bg-white/10 backdrop-blur-sm"
        >
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-theme/30 border-t-theme rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Đang tải...</p>
            </div>
        </motion.div>
    )
}