import { useMemo, useState } from "react";
import { useTransactionStore } from "../../store/useTransactionStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { colors } from '../../constants/color'
import { icons } from '../../constants/icon'
import Calandar from "../useCalendar";
import TransactionForm from './Transaction_Form';

import { format } from "date-fns";

import type { IDBTransaction, GroupedTransactions } from "../../types/Transactions";

export default function ListTransaction() {
    const { transactions } = useTransactionStore();
    const { categories } = useCategoryStore();
    const [open, setOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<IDBTransaction | null>(null);

    const [selectedDay, setSelectedDay] = useState<string | null>(null);

    const [currentMonth, setcurrentMonth] = useState(new Date());
    const selectedMonth = format(currentMonth, "yyyy-MM");

    const categoryMap = useMemo(() => {
        return Object.fromEntries(
            categories.map((cate) => [cate.id, cate])
        )
    }, [categories])

    const filteredTransactions = useMemo(() => {
        return transactions.filter((trans) => {
            const date = trans.transaction_date.split("T")[0];
            const matchMonth = date.startsWith(selectedMonth);
            const matchDay = !selectedDay || date.startsWith(selectedDay);
            return matchMonth && matchDay;
        })
    }, [transactions, selectedMonth, selectedDay]);

    const groupedTransactions = useMemo(() => {
        return filteredTransactions.reduce(
            (groups: Record<string, GroupedTransactions>, transaction) => {
                const date = transaction.transaction_date.split("T")[0];;

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
                    groups[date].balance += transaction.amount;
                    groups[date].income += transaction.amount;
                }
                if (transaction.type === "expense") {
                    groups[date].balance -= transaction.amount;
                    groups[date].expense += transaction.amount;
                }

                return groups;
            },
            {}
        );
    }, [filteredTransactions]);

    // sort ngày mới nhất
    const sortedDates = Object.keys(groupedTransactions).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    // thống kê tháng
    const totalIncome = filteredTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    return (
        <div className="min-h-screen">
            <Calandar setMonth={setcurrentMonth} currentDay={selectedDay} setCurrentDay={setSelectedDay} />
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
                    <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl p-4 mx-4 max-h-[86vh] overflow-y-auto no-scrollbar">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-center w-full">
                                Cập nhật giao dịch
                            </h2>
                            <button onClick={() => setOpen(false)} className=" w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                                ✕
                            </button>
                        </div>
                        <TransactionForm mode="update" transaction={selectedTransaction} onClose={() => setOpen(false)} />
                    </div>
                </div>
            )}
            <div onClick={() => setSelectedDay(null)}
                className="bg-white rounded-2xl border-b border-gray-300 p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                        Tổng quan tháng
                    </h2>

                    {/* chọn tháng */}
                    <input
                        type="month"
                        value={format(currentMonth, "yyyy-MM")}
                        onChange={(e) => { const [year, month] = e.target.value.split("-"); setcurrentMonth(new Date(parseInt(year), parseInt(month) - 1, 1)); }}
                        className="border rounded-lg px-3 py-2"
                    />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className=" rounded-xl p-3">
                        <p className="text-sm text-gray-500">Thu</p>
                        <p className="font-bold text-green-600">
                            {totalIncome.toLocaleString()}đ
                        </p>
                    </div>

                    <div className=" rounded-xl p-3">
                        <p className="text-sm text-gray-500">Chi</p>
                        <p className="font-bold text-red-600">
                            {totalExpense.toLocaleString()}đ
                        </p>
                    </div>

                    <div className="0 rounded-xl p-3">
                        <p className="text-sm text-gray-500">Tổng</p>
                        <p className="font-bold text-blue-600">
                            {balance.toLocaleString()}đ
                        </p>
                    </div>
                </div>
            </div>

            {/* Danh sách giao dịch */}
            <div className="space-y-5">
                {sortedDates.length === 0 && (
                    <div onClick={() => setSelectedDay(null)} className="text-center text-gray-400 py-10">
                        Không có giao dịch trong tháng này
                    </div>
                )}

                {sortedDates.map((date) => {
                    const dayTransactions = groupedTransactions[date];
                    const totalDay = dayTransactions.income - dayTransactions.expense;

                    return (
                        <div key={date} className="space-y-3">
                            {/* header ngày */}
                            <div className="flex items-center justify-between border-b border-gray-300/50 rounded-lg px-2 bg-gray-300">
                                <h3 className="font-semibold  text-sm">
                                    {new Date(date).toLocaleDateString("vi-VN", {
                                        weekday: "long",
                                        day: "2-digit",
                                        month: "2-digit",
                                    })}
                                </h3>

                                <p
                                    className={`font-bold ${totalDay >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {totalDay >= 0 ? "+" : ""}
                                    {totalDay.toLocaleString()}đ
                                </p>
                            </div>

                            {/* items */}
                            <div className="space-y-2">
                                {dayTransactions.transactions.map((transaction) => {
                                    const category = categoryMap[transaction.category_id];
                                    const Icon = icons[category.icon as keyof typeof icons];
                                    return (

                                        <div onClick={() => { setSelectedTransaction(transaction); setOpen(true) }}
                                            key={transaction.id}
                                            className="text-sm hover:bg-gray-100 flex items-center justify-between border-b border-gray-400/50">
                                            <div className="flex px-2 space-x-3">
                                                {Icon && <Icon className="w-4 h-4 text-white" style={{ color: colors[category.color as keyof typeof colors] || "#E5E7EB" }} />}
                                                <p>{category.name} </p>
                                                <p className="text-gray-600/80">{transaction.note ? `(${transaction.note})` : ""}</p>
                                            </div>
                                            <p
                                                className={`font-bold ${transaction.type === "income" ? "text-green-600" : ""}`}>
                                                {transaction.type === "income" ? "+" : "-"}
                                                {transaction.amount.toLocaleString()}đ
                                            </p>
                                        </div>
                                    )
                                })
                                }
                            </div >
                        </div >
                    );
                })}
            </div >
        </div >
    );
}