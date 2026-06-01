import { endOfMonth, format, startOfMonth } from "date-fns";
interface MonthControlProps {
    setMonth: (date: Date) => void,
    currentDate: Date
}
// currentDate la ngay hien tai
export default function MonthControl({ setMonth, currentDate }: MonthControlProps) {
    return (
        <div className="w-full mx-auto bg-white/95 backdrop-blur border border-gray-100 rounded-2xl p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2 w-full">
                <button
                    onClick={() => {
                        const newDate = new Date(currentDate);

                        newDate.setMonth(newDate.getMonth() - 1);

                        setMonth(newDate);
                    }}
                    className="flex items-center justify-center w-11 h-11 rounded-xl bg-theme/10 text-theme hover:bg-theme/15 active:scale-95 transition-all text-xl font-medium border border-theme/20 shadow-sm touch-manipulation"
                >
                    ‹
                </button>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 flex-1 bg-gradient-to-r from-theme/5 to-theme/10 border border-theme/20 rounded-xl px-3 py-2 select-none text-center">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 tracking-wide">
                        {format(currentDate, "MM/yyyy")}
                    </h2>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <div className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-1">
                        <span>{format(startOfMonth(currentDate), "dd/MM")}</span>
                        <span className="text-gray-400">-</span>
                        <span>{format(endOfMonth(currentDate), "dd/MM")}</span>
                    </div>
                </div>
                <button
                    onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setMonth(newDate.getMonth() + 1);
                        setMonth(newDate);
                    }}
                    className="flex items-center justify-center w-11 h-11 rounded-xl bg-theme/10 text-theme hover:bg-theme/15 active:scale-95 transition-all text-xl font-medium border border-theme/20 shadow-sm touch-manipulation"
                >
                    ›
                </button>

            </div>
        </div>
    );
}