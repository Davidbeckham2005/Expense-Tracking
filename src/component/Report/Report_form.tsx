import { useCategoryStore } from "../../store/useCategoryStore";
import { useTransactionStore } from "../../store/useTransactionStore";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import type { IDBTransaction, GroupedTransactions, TTransactionType } from "../../types/Transactions";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatVND, percentFormat } from "../../utils/format";
const COLORS = [
    "#3B82F6",
    "#EF4444",
    "#22C55E",
    "#FACC15",
    "#A855F7",
    "#EC4899",
    "#F97316",
];


export default function ReportTransaction() {
    const { transactions } = useTransactionStore();
    const { categories } = useCategoryStore();

    const [currentType, setCurrentType] = useState<TTransactionType>("expense");
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
            return matchMonth;
        })
    }, [transactions, selectedMonth, search, categoryMap]);
    const totalIncome = filteredTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    // const balance = totalIncome - totalExpense;
    // const groupedTransactions = useMemo(() => {
    //     return filteredTransactions.reduce(
    //         (groups: Record<string, GroupedTransactions>, transaction) => {
    //             const date = transaction.transaction_date.split("T")[0];;

    //             if (!groups[date]) {
    //                 groups[date] = {
    //                     income: 0,
    //                     expense: 0,
    //                     balance: 0,
    //                     transactions: []
    //                 };
    //             }

    //             groups[date].transactions.push(transaction);
    //             if (transaction.type === "income") {
    //                 groups[date].balance += transaction.amount;
    //                 groups[date].income += transaction.amount;
    //             }
    //             if (transaction.type === "expense") {
    //                 groups[date].balance -= transaction.amount;
    //                 groups[date].expense += transaction.amount;
    //             }

    //             return groups;
    //         },
    //         {}
    //     );
    // }, [filteredTransactions]);
    const categoryChartData = useMemo(() => {
        const map = new Map<string, { name: string, value: number }>();
        filteredTransactions.filter((t) => t.type === currentType)
            .forEach((trans) => {
                const category = categoryMap[trans.category_id];
                if (!category) return;
                const categoryId = trans.category_id;
                const currentData = map.get(categoryId)

                if (currentData) {
                    currentData.value += trans.amount;
                } else {
                    map.set(categoryId, { name: category.name, value: trans.amount });
                }
            });
        const allData = Array.from(map.values());
        if (allData.length === 0) {
            return [{ name: "Không có dữ liệu", value: 1 }];
        }
        const chartData = allData.map((date) => {
            return {
                name: date.name,
                value: date.value
            }
        })
        return chartData;
    }, [filteredTransactions, categoryMap, currentType]);
    return (
        <div className="w-full h-[400px] bg-white rounded-2xl p-4 shadow-md">
            <h2 className="text-2xl font-bold mb-4">Báo cáo giao dịch</h2>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart key={currentType}>
                    <Pie
                        data={categoryChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={(entry) => `${entry.name}: ${percentFormat(entry.value, currentType === 'income' ? totalIncome : totalExpense)}`}
                    >
                        {categoryChartData.map((_, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        formatter={(value, name) => [formatVND(Number(value)) + 'đ', name]}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
            <div className="col-span-3 md:col-span-1 gap-2 flex items-center justify-between max-w-90 w-full mx-auto rounded-xl text-gray-600/80">
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
        </div>)
}
