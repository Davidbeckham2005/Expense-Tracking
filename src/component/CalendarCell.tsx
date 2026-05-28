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
        <div onClick={() => onSelect(key)} className={`h-9 md:h-20 text-xs cursor-pointer border rounded-lg bg-theme-light/20 m-0.5
                ${currentDay === key ? "ring-1 ring-theme-500" : ""}
                ${isSameMonth(day, monthStart) ? "" : "opacity-30"}
                ${isToday(day) ? "ring-2 ring-green-500" : ""}
                `}>
            <div className="font-semibold px-2">{format(day, "d")}</div>
            {data && (
                <div className="mt-1 font-medium text-[10px] sm:text-xs md:text-sm flex flex-col px-1">
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
})