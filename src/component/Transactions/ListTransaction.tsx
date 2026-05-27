import { useMemo, useState } from "react";
import { useTransactionStore } from "../../store/useTransactionStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { colors } from '../../constants/color'
import { icons } from '../../constants/icon'
import Calandar from "../useCalendar";
import TransactionForm from './Transaction_Form';
import type { IconName } from "../../types/ICategories";
import { Search, CirclePlus } from "lucide-react";

import { format } from "date-fns";


import type { IDBTransaction, GroupedTransactions, TTransactionType } from "../../types/Transactions";

export default function ListTransaction() {
    const { transactions } = useTransactionStore();
    const { categories } = useCategoryStore();
    const [openUpdate, setopenUpdate] = useState(false);
    const [openCreate, setopenCreate] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<IDBTransaction | null>(null);

    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [currentType, setCurrentType] = useState<TTransactionType | null>(null);
    const [currentMonth, setcurrentMonth] = useState(new Date());
    const selectedMonth = format(currentMonth, "yyyy-MM");

    const categoryMap = useMemo(() => {
        return Object.fromEntries(
            categories.map((cate) => [cate.id, cate])
        )
    }, [categories])
    const [search, setSearch] = useState("");

    const filteredTransactions = useMemo(() => {
        return transactions.filter((trans) => {
            const matchSearch = !search || trans.note?.toLowerCase().includes(search.toLowerCase()) || categoryMap[trans.category_id]?.name.toLowerCase().includes(search.toLowerCase());
            if (!matchSearch) return false;
            const date = trans.transaction_date.split("T")[0];
            const matchMonth = date.startsWith(selectedMonth);
            const matchDay = !selectedDay || date.startsWith(selectedDay);
            const matchType = !currentType || trans.type === currentType;
            return matchMonth && matchDay && matchType;
        })
    }, [transactions, selectedMonth, selectedDay, search, categoryMap, currentType]);

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
            {openUpdate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setopenUpdate(false)} />
                    <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl p-4 mx-4 max-h-[86vh] overflow-y-auto no-scrollbar">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-center w-full">
                                Cập nhật giao dịch
                            </h2>
                            <button onClick={() => setopenUpdate(false)} className=" w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                                ✕
                            </button>
                        </div>
                        <TransactionForm mode="update" transaction={selectedTransaction} onClose={() => setopenUpdate(false)} />
                    </div>
                </div>
            )}
            {openCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setopenCreate(false)} />
                    <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl p-4 mx-4 max-h-[86vh] overflow-y-auto no-scrollbar">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-center w-full">
                                Thêm giao dịch mới
                            </h2>
                            <button onClick={() => setopenCreate(false)} className=" w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                                ✕
                            </button>
                        </div>
                        <TransactionForm mode="create" transaction={selectedTransaction} onClose={() => setopenCreate(false)} />
                    </div>
                </div>
            )}
            <div onClick={() => setSelectedDay(null)} className="bg-white rounded-2xl border-b border-gray-300 p-4 space-y-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <div className="flex items-center justify-start">

                        <input
                            type="text"
                            placeholder="Tìm kiếm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-md pl-8 pr-10 rounded-xl border border-gray-200 bg-white shadow-sm outline-none"
                        />
                    </div>


                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center justify-between">
                    <h2 className="text-sm md:text-xl font-bold">
                        Tổng quan tháng
                    </h2>

                    <div className="col-span-3 md:col-span-1 gap-2 flex items-center justify-between max-w-90 w-full mx-auto rounded-xl text-gray-600/80">
                        <button
                            type="button"
                            onClick={() => { setCurrentType(null); }}
                            className={`flex-1 rounded-lg border border-gray-200 shadow-sm outline-none ${currentType === null ? 'bg-blue-600/80 text-white' : ''}`}>Tất cả
                        </button>
                        <button
                            type="button"
                            onClick={() => { setCurrentType("expense"); }}
                            className={`flex-1 rounded-lg border border-gray-200 shadow-sm outline-none ${currentType === 'expense' ? 'bg-red-600/80 text-white' : ''}`}>Tiền chi
                        </button>
                        <button
                            type="button"
                            onClick={() => { setCurrentType("income"); }}
                            className={`flex-1 rounded-lg border border-gray-200 shadow-sm outline-none ${currentType === 'income' ? 'bg-green-600/80 text-white' : ''}`}>Tiền thu
                        </button>
                    </div>
                    <CirclePlus className="cursor-pointer hover:scale-110 transition-transform" onClick={() => setopenCreate(true)}> </CirclePlus>
                    <div className="col-span-2 md:col-span-1 flex items-center justify-end gap-2">

                        <input
                            type="month"
                            value={format(currentMonth, "yyyy-MM")}
                            onChange={(e) => { const [year, month] = e.target.value.split("-"); setcurrentMonth(new Date(parseInt(year), parseInt(month) - 1, 1)); }}
                            className="border rounded-lg px-3 py-1 text-sm outline-none"
                        />
                    </div>

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
                            <div className="">
                                {dayTransactions.transactions.map((transaction) => {
                                    const category = categoryMap[transaction.category_id];
                                    const Icon = icons[category?.icon as IconName];
                                    return (

                                        <div onClick={() => { setSelectedTransaction(transaction); setopenUpdate(true) }}
                                            key={transaction.id}
                                            className="py-2 text-sm hover:bg-gray-100 flex items-center justify-between border-b border-gray-400/50">
                                            <div className="flex px-2 space-x-3">
                                                {Icon && <Icon className="w-4 h-4 text-white" style={{ color: colors[category.color as keyof typeof colors] || "#E5E7EB" }} />}
                                                <p>{category?.name || "Không xác định"} </p>
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