import type { GroupedTransactionMap } from "../types/Transactions"
import { format, isSameMonth, isToday } from "date-fns";
import { buildCalendarDays } from "../utils/calandar";

// import { useState } from "react"
import { formatVND } from "../utils/format";

interface CalandarProps {
    grouped: GroupedTransactionMap,
    currentDate: Date,
    setCurrentDate: (date: Date) => void,
}

export default function Calandar({ grouped, currentDate, setCurrentDate }: CalandarProps) {
    // const [currentDate, setCurrentDate] = useState(new Date());
    const days = buildCalendarDays(currentDate);
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return (
        <div className="p-4 bg-white rounded-2xl shadow ">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                    ←
                </button>

                <h2 className="text-lg font-semibold">
                    {format(currentDate, "MM/yyyy")}
                </h2>

                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                    →
                </button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7">
                {days.map((day) => {
                    const key = format(day, "yyyy-MM-dd");
                    const data = grouped[key];
                    return (
                        <div
                            key={key}
                            className={`p-2 h-12 md:h-24 text-xs cursor-pointer border border-zinc-800/40 rounded-lg
                            ${isSameMonth(day, monthStart) ? "" : "opacity-30"}
                            ${data ? (data.balance >= 0 ? "bg-green-100" : "bg-red-100") : ""}
                            ${day.getDay() === 5 ? "border-red-500" : ""}
                            ${day.getDay() === 6 ? "border-blue-500" : ""}
                        `}>
                            <div className="font-semibold">
                                {format(day, "d")}{isToday(day) && <span className="text-gray-500 ml-1  hidden sm:inline">Today</span>}
                            </div>

                            {data && (
                                <div className="mt-1 font-medium text-[10px] sm:text-xs md:text-sm flex flex-col ">
                                    <div className="text-green-500 hidden md:inline">
                                        +{formatVND(data.income)}
                                    </div>
                                    <div className="text-red-500 hidden md:inline">
                                        -{formatVND(data.expense)}
                                    </div>
                                    <div className="text-blue-500">
                                        {formatVND(data.balance)}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div >
    )
}