import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, addDays } from "date-fns";

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