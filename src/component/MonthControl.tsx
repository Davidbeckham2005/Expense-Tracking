import { endOfMonth, format, startOfMonth } from "date-fns";
import { motion } from "motion/react"
interface MonthControlProps {
    setMonth: (date: Date) => void,
    currentDate: Date
}
export default function MonthControl({ setMonth, currentDate }: MonthControlProps) {
    return (
        <div className="w-full mx-auto bg-white/15 backdrop-blur-lg border border-white/40 rounded-2xl p-1 shadow-lg">
            <div className="flex items-center justify-between gap-2 w-full">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setMonth(newDate.getMonth() - 1);
                        setMonth(newDate);
                    }}
                    className="flex items-center justify-center h-8 w-8 md:w-11 md:h-11 rounded-xl bg-white/20 text-theme hover:bg-white/30 transition-all text-xl font-medium border border-white/30 shadow-sm touch-manipulation"
                >
                    ‹
                </motion.button>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl select-none text-center">
                    <h2 className="text-base sm:text-lg font-semibold text-slate-800 tracking-wide">
                        {format(currentDate, "MM/yyyy")}
                    </h2>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <div className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1">
                        <span>{format(startOfMonth(currentDate), "dd/MM")}</span>
                        <span className="text-slate-400">-</span>
                        <span>{format(endOfMonth(currentDate), "dd/MM")}</span>
                    </div>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setMonth(newDate.getMonth() + 1);
                        setMonth(newDate);
                    }}
                    className="flex items-center justify-center h-8 w-8 md:w-11 md:h-11 rounded-xl bg-white/20 text-theme hover:bg-white/30 transition-all text-xl font-medium border border-white/30 shadow-sm touch-manipulation"
                >
                    ›
                </motion.button>

            </div>
        </div>
    );
}