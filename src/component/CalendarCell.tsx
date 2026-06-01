import { memo } from "react";
import { formatVND } from "../utils/format";
import { format, isSameMonth, isToday } from "date-fns";
import type { GroupedTransactions } from "../types/Transactions";

interface Props {
    day: Date;
    monthStart: Date;
    data?: GroupedTransactions;
    currentDay: string | null;
    onSelect: (date: string) => void;
}
// monthStart để xác định xem ngày đó có thuộc tháng hiện tại hay không, nếu không thuộc thì sẽ mờ đi 
export default memo(function CalendarDay({ day, monthStart, data, currentDay, onSelect, }: Props) {
    const key = format(day, "yyyy-MM-dd");

    return (
        <div onClick={() => onSelect(key)} className={`min-h-16 h-16 md:h-20 text-xs cursor-pointer bg-theme-light/20 border border-gray-300/20 p-1 overflow-hidden
                ${currentDay === key ? "ring-1 ring-theme-500" : ""}
                ${isSameMonth(day, monthStart) ? "" : "opacity-30"}
                ${isToday(day) ? "ring-2 ring-green-500" : ""}
                `}>
            <div className="flex items-center justify-between gap-1 px-1 font-semibold text-[11px] md:text-xs">
                <span>{format(day, "d")}</span>
                {data && <span className="text-[10px] text-gray-400 md:hidden">{formatVND(data.balance)}</span>}
            </div>
            {data && (
                <div className="mt-1 font-medium text-[10px] sm:text-xs md:text-sm flex flex-col px-1 leading-tight">
                    <div className="text-green-500 hidden md:inline">
                        +{formatVND(data.income)}
                    </div>
                    <div className="text-red-500 hidden md:inline">
                        -{formatVND(data.expense)}
                    </div>
                    <div className="text-blue-500 truncate">
                        {formatVND(data.balance)}
                    </div>
                </div>
            )}

        </div>
    );
})