import type { GroupedTransactions } from "../types/Transactions"
import { format } from "date-fns";
import { buildCalendarDays } from "../utils/calandar";
import CalendarCell from "./CalendarCell";
import { useMemo } from "react"
import { useTransactionStore } from '../store/useTransactionStore'
import MonthControl from './MonthControl'

interface CalandarProps {
    setMonth: (date: Date) => void,
    currentDay: string | null,
    setCurrentDay: (date: string | null) => void,
    currentDate: Date
}

export default function Calandar({ setMonth, currentDay, setCurrentDay, currentDate }: CalandarProps) {
    const { transactions } = useTransactionStore();

    const monthKey = format(currentDate, "yyyy-MM");

    const days = buildCalendarDays(currentDate);
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => {
            return t.transaction_date.startsWith(monthKey);
        });
    }, [transactions, monthKey]);
    const groupedTransactions = useMemo(() => {
        return filteredTransactions.reduce(
            (groups: Record<string, GroupedTransactions>, transaction) => {
                const date = transaction.transaction_date.split("T")[0];

                if (!groups[date]) {
                    groups[date] = {
                        income: 0,
                        expense: 0,
                        balance: 0,
                        transactions: []
                    };
                }

                groups[date].transactions.push(transaction);

                if (transaction.type === "income") {
                    groups[date].income += transaction.amount;
                    groups[date].balance += transaction.amount;
                }

                if (transaction.type === "expense") {
                    groups[date].expense += transaction.amount;
                    groups[date].balance -= transaction.amount;
                }

                return groups;
            },
            {}
        );
    }, [filteredTransactions]);


    return (
        <div className=" bg-white rounded-2xl shadow ">
            {/* Header */}
            <MonthControl setMonth={setMonth} currentDate={currentDate} />

            <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7">
                {days.map((day) => {
                    const key = format(day, "yyyy-MM-dd");
                    const data = groupedTransactions[key];
                    return (
                        <CalendarCell key={key} day={day} monthStart={monthStart} data={data} currentDay={currentDay} onSelect={setCurrentDay}
                        />
                    );
                })}
            </div>
        </div >
    )
}