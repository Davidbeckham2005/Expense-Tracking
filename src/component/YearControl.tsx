import { endOfYear, format, startOfYear } from "date-fns";
interface YearControlProps {
    setYear: (date: Date) => void,
    currentDate: Date
}

export default function YearControl({ setYear, currentDate }: YearControlProps) {
return(
    <div className="w-full mx-auto bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between gap-3 w-full">

            {/* Prev Year */}
            <button
                onClick={() =>
                    setYear(
                        new Date(
                            currentDate.getFullYear() - 1,
                            currentDate.getMonth(),
                            1
                        )
                    )
                }
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 active:scale-95 transition-all text-xl font-medium border border-gray-200 dark:border-zinc-700 shadow-sm"
            >
                ‹
            </button>

            {/* Year Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 flex-1 bg-linear-to from-theme/5 to-theme/10 border border-theme/20 rounded-lg px-4 py-2 select-none">

                <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-zinc-100 tracking-wide">
                    {format(currentDate, "yyyy")}
                </h2>

                <span className="hidden sm:inline text-gray-300 dark:text-zinc-700">
                    |
                </span>

                <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                    <span>
                        {format(startOfYear(currentDate), "dd/MM/yyyy")}
                    </span>

                    <span className="text-gray-400">-</span>

                    <span>
                        {format(endOfYear(currentDate), "dd/MM/yyyy")}
                    </span>
                </div>
            </div>

            {/* Next Year */}
            <button
                onClick={() =>
                    setYear(
                        new Date(
                            currentDate.getFullYear() + 1,
                            currentDate.getMonth(),
                            1
                        )
                    )
                }
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 active:scale-95 transition-all text-xl font-medium border border-gray-200 dark:border-zinc-700 shadow-sm"
            >
                ›
            </button>
        </div>
    </div>
)
}
