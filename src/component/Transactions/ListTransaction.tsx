import { useMemo, useState } from "react";
import { useTransactionStore } from "../../store/useTransactionStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { colors } from '../../constants/color'
import { icons } from '../../constants/icon'
import type { IDBTransaction } from "../../types/Transactions";

export default function ListTransaction() {
    const { transactions } = useTransactionStore();
    const { categories } = useCategoryStore();
    // tháng hiện tại
    const currentMonth = new Date().toISOString().slice(0, 7);

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const categoryMap = useMemo(() => {
        return Object.fromEntries(
            categories.map((cate) => [cate.id, cate])
        )
    }, [categories])
    // filter theo tháng
    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) =>
            transaction.transaction_date.startsWith(selectedMonth)
        );
    }, [transactions, selectedMonth]);

    // group theo ngày
    const groupedTransactions = useMemo(() => {
        return filteredTransactions.reduce(
            (groups: Record<string, IDBTransaction[]>, transaction) => {
                const date = transaction.transaction_date;

                if (!groups[date]) {
                    groups[date] = [];
                }

                groups[date].push(transaction);

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
            {/* Tổng quan tháng */}
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                        Tổng quan tháng
                    </h2>

                    {/* chọn tháng */}
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
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
                        <p className="text-sm text-gray-500">Số dư</p>
                        <p className="font-bold text-blue-600">
                            {balance.toLocaleString()}đ
                        </p>
                    </div>
                </div>
            </div>

            {/* Danh sách giao dịch */}
            <div className="space-y-5">
                {sortedDates.length === 0 && (
                    <div className="text-center text-gray-400 py-10">
                        Không có giao dịch trong tháng này
                    </div>
                )}

                {sortedDates.map((date) => {
                    const dayTransactions = groupedTransactions[date];

                    const totalDay = dayTransactions.reduce((sum, item) => {
                        return item.type === "income"
                            ? sum + item.amount
                            : sum - item.amount;
                    }, 0);

                    return (
                        <div key={date} className="space-y-3">
                            {/* header ngày */}
                            <div className="flex items-center justify-between border-b border-gray-300/50 pb-2">
                                <h3 className="font-semibold">
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
                                {dayTransactions.map((transaction) => {
                                    const category = categoryMap[transaction.category_id];
                                    const Icon = icons[category.icon as keyof typeof icons];
                                    return (

                                        <div
                                            key={transaction.id}
                                            className="bg-white text-sm shadow-sm p-4 flex items-center justify-between border-b border-gray-400/50"
                                        >
                                            <div className="flex  space-x-3">
                                                {Icon && <Icon className="w-5 h-5 text-white" style={{ color: colors[category.color as keyof typeof colors] || "#E5E7EB" }} />}
                                                <p className="">{category.name} </p>
                                                <p className="text-gray-400">{transaction.note ? `(${transaction.note})` : ""}</p>
                                            </div>

                                            <p
                                                className={`font-bold ${transaction.type === "income"
                                                    ? "text-green-600"
                                                    : ""
                                                    }`}
                                            >
                                                {transaction.type === "income" ? "+" : "-"}
                                                {transaction.amount.toLocaleString()}đ
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}