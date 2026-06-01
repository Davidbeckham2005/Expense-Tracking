import { useMemo, useState } from "react";
import { useTransactionStore } from "../../store/useTransactionStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { colors } from '../../constants/color'
import { icons } from '../../constants/icon'
import Calandar from "../useCalendar";
import TransactionForm from './Transaction_Form';
import type { IconName } from "../../types/ICategories";
import { Search, CirclePlus, Settings, Trash2, CalendarDays, ChevronUp, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

import { toast } from "react-hot-toast";

import type { IDBTransaction, GroupedTransactions, TTransactionType } from "../../types/Transactions";
import { motion, AnimatePresence } from "motion/react"

export default function ListTransaction() {
    const { user } = useAuth()
    const { transactions, deleteTransactions } = useTransactionStore();
    const { categories } = useCategoryStore();
    const [openUpdate, setopenUpdate] = useState(false);
    const [openCreate, setopenCreate] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<IDBTransaction | null>(null);

    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [currentType, setCurrentType] = useState<TTransactionType | null>(null);
    const [currentDate, setcurrentDate] = useState(new Date());
    const selectedMonth = format(currentDate, "yyyy-MM");

    const [selectedTransactionIds, setSelectedTransactionIds] = useState<string[]>([]);
    const [isSetting, setIsSetting] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

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

    const handleSelectTransaction = (transactionId: string, isSelected: boolean) => {
        if (isSelected) {
            setSelectedTransactionIds((prev) => [...prev, transactionId]);
        } else {
            setSelectedTransactionIds((prev) =>
                prev.filter((id) => id !== transactionId)
            );
        }
    }
    const handleDelete = async () => {
        if (selectedTransactionIds.length === 0) return;
        try {
            await deleteTransactions(selectedTransactionIds, user?.id);
            setSelectedTransactionIds([]);
            toast.success("Xóa giao dịch thành công");

        } catch (error) {
            console.error("Failed to delete transactions:", error);
            toast.error("Failed to delete transactions");
        }
    }
    return (
        <div className="min-h-screen">
            <div className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-white/40 bg-white/15 backdrop-blur-lg px-4 py-3 shadow-lg">
                <button
                    type="button"
                    onClick={() => setShowCalendar((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-xl bg-theme/10 px-3 py-2 text-sm font-medium text-theme transition hover:bg-theme/15"
                >
                    <CalendarDays className="h-4 w-4" />
                    <span>{showCalendar ? "Ẩn lịch" : "Hiện lịch"}</span>
                    {showCalendar ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <div className="col-span-1 flex items-center justify-start md:justify-end gap-2">

                    <input
                        type="month"
                        value={format(currentDate, "yyyy-MM")}
                        onChange={(e) => { const [year, month] = e.target.value.split("-"); setcurrentDate(new Date(parseInt(year), parseInt(month) - 1, 1)); }}
                        className="w-full md:w-auto border rounded-xl px-3 py-2 text-sm outline-none bg-white shadow-sm"
                    />
                </div>
            </div>
            {showCalendar && (
                <div className="mb-4">
                    <Calandar setMonth={setcurrentDate} currentDay={selectedDay} setCurrentDay={setSelectedDay} currentDate={currentDate} />
                </div>
            )}
            <AnimatePresence>
                {openUpdate && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setopenUpdate(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative z-10 w-full max-w-xl bg-white/20 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-4 mx-4 max-h-[96vh] overflow-y-auto no-scrollbar"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-center w-full text-slate-800">
                                    Cập nhật giao dịch
                                </h2>
                                <button onClick={() => setopenUpdate(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/30 text-slate-600">
                                    ✕
                                </button>
                            </div>
                            <TransactionForm mode="update" transaction={selectedTransaction} onClose={() => setopenUpdate(false)} id={selectedTransaction?.id} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {openCreate && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setopenCreate(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative z-10 w-full max-w-xl bg-white/20 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-4 mx-4 max-h-[86vh] overflow-y-auto no-scrollbar"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-center w-full text-slate-800">
                                    Thêm giao dịch mới
                                </h2>
                                <button onClick={() => setopenCreate(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/30 text-slate-600">
                                    ✕
                                </button>
                            </div>
                            <TransactionForm mode="create" transaction={selectedTransaction} onClose={() => setopenCreate(false)} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div onClick={() => setSelectedDay(null)} className="bg-white/15 backdrop-blur-lg rounded-2xl border border-white/40 p-4 space-y-4 shadow-lg">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <div className="flex items-center justify-start">

                        <input
                            type="text"
                            placeholder="Tìm kiếm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full max-w-none md:max-w-md pl-10 pr-4 py-3 rounded-2xl border border-white/40 bg-white/20 backdrop-blur-sm shadow-sm outline-none text-sm md:text-base"
                        />
                    </div>


                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center justify-between">
                    <h2 className="text-sm md:text-xl font-bold">
                        Tổng quan tháng
                    </h2>

                    <div className="col-span-1 md:col-span-2 gap-2 flex items-center justify-between w-full rounded-xl text-gray-600 font-bold">
                        <button
                            type="button"
                            onClick={() => { setCurrentType(null); }}
                            className={`flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm outline-none transition ${currentType === null ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-200 hover:text-blue-600'}`}>Tất cả
                        </button>
                        <button
                            type="button"
                            onClick={() => { setCurrentType("expense"); }}
                            className={`flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm outline-none transition ${currentType === 'expense' ? 'bg-red-600 text-white border-red-600' : 'hover:border-red-200 hover:text-red-600'}`}>Tiền chi
                        </button>
                        <button
                            type="button"
                            onClick={() => { setCurrentType("income"); }}
                            className={`flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm outline-none transition ${currentType === 'income' ? 'bg-green-600 text-white  border-green-600' : 'hover:border-green-200 hover:text-green-600'}`}>Tiền thu
                        </button>
                    </div>
                    <div className="flex items-center justify-start md:justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setopenCreate(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-theme px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
                        >
                            <CirclePlus className="h-4 w-4" />
                            <span>Thêm</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsSetting(!isSetting); setSelectedTransactionIds([]); }}
                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${isSetting ? 'border-theme bg-theme/10 text-theme' : 'border-gray-200 bg-white text-gray-600 hover:border-theme/30 hover:text-theme'}`}
                        >
                            <Settings className="h-4 w-4" />
                            <span className="hidden sm:inline">Chọn</span>
                        </button>
                    </div>


                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                        <p className="text-sm text-gray-500">Thu</p>
                        <p className="font-bold text-green-600">
                            {totalIncome.toLocaleString()}đ
                        </p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                        <p className="text-sm text-gray-500">Chi</p>
                        <p className="font-bold text-red-600">
                            {totalExpense.toLocaleString()}đ
                        </p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                        <p className="text-sm text-gray-500">Tổng</p>
                        <p className="font-bold text-blue-600">
                            {balance.toLocaleString()}đ
                        </p>
                    </div>
                </div>
            </div>

            {/* Danh sách giao dịch */}
            {isSetting && (<div className="w-full my-2">
                <div className="flex justify-end w-full"
                    onClick={() => {
                        if (window.confirm("Bạn có chắc muốn xóa những giao dịch này?")) {
                            handleDelete();
                        }
                    }}>
                    <span></span> <Trash2 className={'cursor-pointer hover:scale-110 transition-transform' + `${selectedTransactionIds.length > 0 ? ' text-red-500' : ''}`} /> </div>
            </div>)}
            <motion.div
                className="space-y-5"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            >
                {sortedDates.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSelectedDay(null)} className="text-center text-gray-400 py-10"
                    >
                        Không có giao dịch trong tháng này
                    </motion.div>
                )}

                {sortedDates.map((date) => {
                    const dayTransactions = groupedTransactions[date];
                    const totalDay = dayTransactions.income - dayTransactions.expense;

                    return (
                        <motion.div
                            key={date}
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between rounded-lg px-3 py-1.5 bg-white/30 backdrop-blur-sm border border-white/30">
                                <h3 className="font-semibold text-sm text-slate-800">
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

                            <div className="">
                                {dayTransactions.transactions.map((transaction) => {
                                    const category = categoryMap[transaction.category_id];
                                    const Icon = icons[category?.icon as IconName];
                                    return (
                                        <motion.div
                                            className="flex"
                                            key={transaction.id}
                                            variants={{
                                                hidden: { opacity: 0, x: -8 },
                                                visible: { opacity: 1, x: 0 }
                                            }}
                                        >
                                            {isSetting && (<input
                                                type="checkbox"
                                                className="mr-2 accent-theme"
                                                checked={selectedTransactionIds.includes(transaction.id)}
                                                onChange={(e) => { handleSelectTransaction(transaction.id, e.target.checked) }}
                                            />)}
                                            <div
                                                className="flex-1 py-2.5 text-sm hover:bg-white/30 flex items-center justify-between border-b border-white/20 px-3 rounded-lg transition-colors"
                                                onClick={() => { setSelectedTransaction(transaction); setopenUpdate(true) }}
                                            >
                                                <div className="flex px-2 space-x-3">
                                                    {Icon && <Icon className="w-4 h-4" style={{ color: colors[category.color as keyof typeof colors] || "#E5E7EB" }} />}
                                                    <p className="text-slate-800">{category?.name || "Không xác định"} </p>
                                                    <p className="text-slate-500/80">{transaction.note ? `(${transaction.note})` : ""}</p>
                                                </div>
                                                <p
                                                    className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-rose-600"}`}>
                                                    {transaction.type === "income" ? "+" : "-"}
                                                    {transaction.amount.toLocaleString()}đ
                                                </p>
                                            </div>
                                        </motion.div>
                                    )
                                })
                                }
                            </div >
                        </motion.div>
                    );
                })}
            </motion.div>
        </div >
    );
}