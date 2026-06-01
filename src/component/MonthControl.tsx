import { endOfMonth, format, startOfMonth } from "date-fns";
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
interface MonthControlProps {
    setMonth: (date: Date) => void,
    currentDate: Date
}
export default function MonthControl({ setMonth, currentDate }: MonthControlProps) {
    return (
        <Card className="w-full mx-auto p-3">
            <div className="flex items-center justify-between gap-3 w-full">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setMonth(newDate.getMonth() - 1);
                        setMonth(newDate);
                    }}
                    className="flex items-center justify-center h-10 w-10 md:w-11 md:h-11 rounded-xl bg-muted text-primary hover:bg-muted/80 transition-all text-xl font-medium border shadow-sm touch-manipulation"
                >
                    ‹
                </motion.button>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 flex-1 bg-muted/50 border rounded-xl select-none text-center px-4 py-2">
                    <h2 className="text-base sm:text-lg font-semibold text-foreground tracking-wide">
                        {format(currentDate, "MM/yyyy")}
                    </h2>
                    <span className="hidden sm:inline text-muted-foreground/50">|</span>
                    <div className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <span>{format(startOfMonth(currentDate), "dd/MM")}</span>
                        <span className="text-muted-foreground/50">-</span>
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
                    className="flex items-center justify-center h-10 w-10 md:w-11 md:h-11 rounded-xl bg-muted text-primary hover:bg-muted/80 transition-all text-xl font-medium border shadow-sm touch-manipulation"
                >
                    ›
                </motion.button>

            </div>
        </Card>
    );
}
