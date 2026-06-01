import { endOfYear, format, startOfYear } from "date-fns";
import { motion } from "motion/react"
interface YearControlProps {
    setYear: (date: Date) => void,
    currentDate: Date
}

export default function YearControl({ setYear, currentDate }: YearControlProps) {
return(
    <div className="w-full mx-auto bg-white/15 backdrop-blur-lg border border-white/40 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-between gap-3 w-full">

            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                    setYear(
                        new Date(
                            currentDate.getFullYear() - 1,
                            currentDate.getMonth(),
                            1
                        )
                    )
                }
                className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-white/30 transition-all text-xl font-medium border border-white/30 shadow-sm"
            >
                ‹
            </motion.button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 select-none">

                <h2 className="text-base sm:text-lg font-semibold text-slate-800 tracking-wide">
                    {format(currentDate, "yyyy")}
                </h2>

                <span className="hidden sm:inline text-slate-300">|</span>

                <div className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1">
                    <span>
                        {format(startOfYear(currentDate), "dd/MM/yyyy")}
                    </span>

                    <span className="text-slate-400">-</span>

                    <span>
                        {format(endOfYear(currentDate), "dd/MM/yyyy")}
                    </span>
                </div>
            </div>

            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                    setYear(
                        new Date(
                            currentDate.getFullYear() + 1,
                            currentDate.getMonth(),
                            1
                        )
                    )
                }
                className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-white/30 transition-all text-xl font-medium border border-white/30 shadow-sm"
            >
                ›
            </motion.button>
        </div>
    </div>
)
}
