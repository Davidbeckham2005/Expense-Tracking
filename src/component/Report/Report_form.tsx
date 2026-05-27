import { useCategoryStore } from "../../store/useCategoryStore";
import { useTransactionStore } from "../../store/useTransactionStore";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import type { IDBTransaction, GroupedTransactions } from "../../types/Transactions";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
    const categoryChartData = useMemo(() => {
        const map = new Map<string, number>();

        filteredTransactions
            .filter((t) => t.type === "expense")
            .forEach((trans) => {
                const category = categoryMap[trans.category_id];

                if (!category) return;

                map.set(
                    category.name,
                    (map.get(category.name) || 0) + trans.amount
                );
            });

        return Array.from(map.entries()).map(([name, value]) => ({
            name,
            value,
        }));
    }, [filteredTransactions, categoryMap]);
    return (
        <div className="w-full h-[400px] bg-white rounded-2xl p-4 shadow-md">
            <h2 className="text-2xl font-bold mb-4">Báo cáo giao dịch</h2>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={categoryChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                    >
                        {categoryChartData.map((_, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>)
}
