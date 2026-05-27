import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from "date-fns";

export const buildCalendarDays = (date: Date) => {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));

    const days = [];
    let current = start;

    while (current <= end) {
        days.push(current);
        current = addDays(current, 1);
    }

    return days;
};

export const handleNextMonth = (selectedMonth: string) => {
    const date = new Date(selectedMonth);

    date.setMonth(date.getMonth() + 1);

    const newMonth =
        `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}`;

    return newMonth;
};
export const handlePrevMonth = (selectedMonth: string) => {
    const date = new Date(selectedMonth);

    date.setMonth(date.getMonth() - 1);

    const newMonth =
        `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}`;

    return newMonth;
};