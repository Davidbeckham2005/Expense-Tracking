import { endOfYear, format, startOfYear } from "date-fns";
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
interface YearControlProps {
    setYear: (date: Date) => void,
    currentDate: Date
}

export default function YearControl({ setYear, currentDate }: YearControlProps) {
    return (
        <Card className="w-full mx-auto p-3">
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
                    className="flex items-center justify-center w-11 h-11 rounded-lg text-muted-foreground hover:bg-muted/80 transition-all text-xl font-medium border shadow-sm"
                >
                    ‹
                </motion.button>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 flex-1 bg-muted/50 border rounded-lg px-4 py-2 select-none">

                    <h2 className="text-base sm:text-lg font-semibold text-foreground tracking-wide">
                        {format(currentDate, "yyyy")}
                    </h2>

                    <span className="hidden sm:inline text-muted-foreground/50">|</span>

                    <div className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <span>
                            {format(startOfYear(currentDate), "dd/MM/yyyy")}
                        </span>

                        <span className="text-muted-foreground/50">-</span>

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
                    className="flex items-center justify-center w-11 h-11 rounded-lg text-muted-foreground hover:bg-muted/80 transition-all text-xl font-medium border shadow-sm"
                >
                    ›
                </motion.button>
            </div>
        </Card>
    )
}
