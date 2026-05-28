import { useCategoryStore } from "../../store/useCategoryStore";
import { useTransactionStore } from "../../store/useTransactionStore";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import type { TTransactionType } from "../../types/Transactions";
import { ResponsiveContainer } from "recharts";
import { formatVND, percentFormat } from "../../utils/format";
import PieChartComponent from "../Chart/PieChart"
import MonthControl from "../MonthControl";
import ChartSwitcher from "./ChartSwitcher";
import type { TColor, IconName } from "../../types/ICategories"
import { icons } from "../../constants/icon";
import { colors } from "../../constants/color";
import LineChartComponent from "../Chart/LineChart";
import ReportForPieChart from "./Repost_for_piechart";

type chartDate = 'pie' | 'line' | 'bar';

export default function ReportTransaction() {
    const { transactions } = useTransactionStore();
    const [currentChart, setCurrentChart] = useState<chartDate>("line");
    const { categories } = useCategoryStore();
    const [currentType, setCurrentType] = useState<TTransactionType>("expense");
    const [currentDate, setcurrentDate] = useState(new Date());
    const selectedMonth = format(currentDate, "yyyy-MM");

    const categoryMap = useMemo(() => {
        return Object.fromEntries(
            categories.map((cate) => [cate.id, cate])
        )
    }, [categories])

    const filteredTransactions = useMemo(() => {
        return transactions.filter((trans) => {
            const date = trans.transaction_date.split("T")[0];
            const matchMonth = date.startsWith(selectedMonth);
            return matchMonth;
        })
    }, [transactions, selectedMonth, categoryMap]);
    const totalIncome = filteredTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const map_with_date = useMemo(() => {
        const map = new Map<string, { date: string, income: number, expense: number }>();
        filteredTransactions.forEach((trans) => {
            const date = trans.transaction_date.split("T")[0];
            const currentData = map.get(date);
            if (currentData) {
                if (trans.type === "income") {
                    currentData.income += trans.amount;
                } else {
                    currentData.expense += trans.amount;
                }
            }
            else {
                map.set(date, {
                    date,
                    income: trans.type === "income" ? trans.amount : 0,
                    expense: trans.type === "expense" ? trans.amount : 0
                });
            }
        });
        return Array.from(map.values());
    }, [filteredTransactions]);
    // console.log("map_with_date", map_with_date);
    const map_with_category = useMemo(() => {
        const map = new Map<string, { category: typeof categories[number], value: number }>();
        filteredTransactions.filter((t) => t.type === currentType)
            .forEach((trans) => {
                const category = categoryMap[trans.category_id];
                if (!category) return;
                const categoryId = trans.category_id;
                const currentData = map.get(categoryId)

                if (currentData) {
                    currentData.value += trans.amount;
                } else {
                    map.set(categoryId, { category, value: trans.amount });
                }
            });
        return Array.from(map.values());
    }, [filteredTransactions, categoryMap, currentType]);
    // console.log("map_with_category", map_with_category);
    const categoryChartData = useMemo(() => {
        if (map_with_category.length === 0) {
            return [{ name: "Không có dữ liệu", value: 1 }];
        }
        const chartData = map_with_category.map((date) => {
            return {
                name: date.category.name,
                value: date.value
            }
        })
        return chartData;
    }, [map_with_category]);
    // console.log("chartData", categoryChartData);
    return (
        <div className="min-h-screen">
            <h2 className="text-lg md:text-2xl font-bold mb-2">Báo cáo giao dịch</h2>
            <div className="w-full max-w-4xl mx-auto space-y-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-3 shadow-sm">
                <MonthControl currentDate={currentDate} setMonth={setcurrentDate} />

                <div className="w-full flex space-x-2 text-gray-500 bg-white rounded-lg">
                    <div className="flex flex-1  w-full border border-gray-200 rounded-lg md:px-8">
                        <span className="flex-1 text-left px-2">Chi Tiêu</span>
                        <span className="flex-1 text-right px-2 text-red-500 text-nowrap">- {formatVND(totalExpense)}đ</span>
                    </div>
                    <div className="flex flex-1  w-full border border-gray-200 rounded-lg md:px-8">
                        <span className="flex-1 text-left px-2">Thu Nhập</span>
                        <span className="flex-1 text-right px-2 text-green-500 text-nowrap">+ {formatVND(totalIncome)}đ</span>
                    </div>
                </div>
                <div className="flex flex-1  w-full border border-gray-200 rounded-lg md:px-8 text-gray-500 bg-white">
                    <span className="flex-1 text-left px-2">Thu Chi</span>
                    <span className="flex-1 text-right px-2 text-stone-900 text-nowrap">{formatVND(balance)}đ</span>
                </div>

            </div>
            <div className="w-full h-[400px] bg-white rounded-2xl p-4 shadow-md border my-2">
                <div className="flex h-full">
                    <ChartSwitcher chartType={currentChart} setChartType={setCurrentChart} />
                    <div className="flex-1 ml-4 p-2">
                        <ResponsiveContainer width="100%" height="100%" >
                            {currentChart === "pie" && (
                                <PieChartComponent categoryChartData={categoryChartData} totalIncome={totalIncome} totalExpense={totalExpense} currentType={currentType} />
                            )}
                            {currentChart === "line" && (
                                <LineChartComponent dailyData={map_with_date} />
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="col-span-3 md:col-span-1 gap-2 flex items-center justify-between max-w-md w-full mx-auto rounded-xl text-gray-600/80 my-2">
                <button
                    type="button"
                    onClick={() => { setCurrentType("expense"); }}
                    className={`flex-1 rounded-lg border border-gray-200 shadow-sm outline-none ${currentType === 'expense' ? 'bg-red-600/80 text-white' : ''}`}>Chi Tiêu
                </button>
                <button
                    type="button"
                    onClick={() => { setCurrentType("income"); }}
                    className={`flex-1 rounded-lg border border-gray-200 shadow-sm outline-none ${currentType === 'income' ? 'bg-green-600/80 text-white' : ''}`}>Thu Nhập
                </button>
            </div>
            {currentChart === "pie" && (
                <ReportForPieChart map_with_category={map_with_category} currentType={currentType} totalExpense={totalExpense} totalIncome={totalIncome} />
            )}

            {currentChart === "line" && (
                map_with_date.length === 0 ? (
                    <p className="text-center text-gray-500">Không có dữ liệu</p>
                ) : (
                    <div className="space-y-2">
                        {map_with_date.map((item) => {
                            return (
                                <div key={item.date} className={`flex items-center border-b-2 border-gray-400/40 rounded-lg transition pr-2`}>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1 flex items-center justify-center">
                                            {item.date}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 ml-auto">
                                        <div className="text-green-600 hover:text-gray-700">+ {formatVND(item.income)}đ
                                        </div>
                                        <div className="text-red-600 hover:text-gray-700">- {formatVND(item.expense)}đ
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                )
            )}
        </div>
    )
}
