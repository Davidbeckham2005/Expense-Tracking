import { useCategoryStore } from "../../store/useCategoryStore";
import { useTransactionStore } from "../../store/useTransactionStore";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import type { TTransactionType } from "../../types/Transactions";
import { ResponsiveContainer } from "recharts";
import { formatVND } from "../../utils/format";
import PieChartComponent from "../Chart/PieChart"
import MonthControl from "../MonthControl";
import ChartSwitcher from "./ChartSwitcher";

import YearControl from "../YearControl";
import LineChartComponent from "../Chart/LineChart";
import ReportForPieChart from "./Report_for_piechart";
import ReportForLineChart from "./Report_for_linechart";
import BarChartComponent from "../Chart/BarChart";
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type chartDate = 'pie' | 'line' | 'bar';
type FilterMode = "month" | "year";
export default function ReportTransaction() {
    const { transactions } = useTransactionStore();
    const [currentChart, setCurrentChart] = useState<chartDate>("pie");
    const { categories } = useCategoryStore();
    const [currentType, setCurrentType] = useState<TTransactionType>("expense");
    const [currentDate, setcurrentDate] = useState(new Date());
    const [filterMode, setFilterMode] = useState<FilterMode>("month");

    const selectedMonth = format(currentDate, "yyyy-MM");
    const selectedYear = format(currentDate, "yyyy");

    const categoryMap = useMemo(() => {
        return Object.fromEntries(
            categories.map((cate) => [cate.id, cate])
        )
    }, [categories])

    const filteredTransactions = useMemo(() => {
        return transactions.filter((trans) => {
            const date = trans.transaction_date.split("T")[0];
            if (filterMode === "month") {
                return date.startsWith(selectedMonth);
            }
            if (filterMode === "year") {
                return date.startsWith(selectedYear);
            }
        })
    }, [transactions, selectedMonth, selectedYear, categoryMap, filterMode]);
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
    return (
        <div className="min-h-screen">
            <h2 className="text-lg md:text-2xl font-bold mb-2 text-foreground">Báo cáo giao dịch</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
                <div className="space-y-3">
                    <Card className="w-full max-w-4xl mx-auto p-4 space-y-3 lg:max-w-none lg:mx-0">
                        <div className="flex flex-1 w-full border bg-muted/30 rounded-lg">
                            <Button
                                variant={filterMode === "month" ? "default" : "ghost"}
                                onClick={() => { setFilterMode("month") }}
                                className="flex-1"
                            >Hàng tháng</Button>
                            <Button
                                variant={filterMode === "year" ? "default" : "ghost"}
                                onClick={() => { setFilterMode("year") }}
                                className="flex-1"
                            >Hàng năm</Button>
                        </div>
                        {filterMode === "month" && (<MonthControl currentDate={currentDate} setMonth={setcurrentDate} />)}
                        {filterMode === "year" && (<YearControl currentDate={currentDate} setYear={setcurrentDate} />)}

                        <div className="w-full flex gap-2 text-muted-foreground">
                            <div className="flex flex-1 w-full border rounded-lg md:px-8">
                                <span className="flex-1 text-left px-2">Chi Tiêu</span>
                                <span className="flex-1 text-right px-2 text-red-500 text-nowrap">- {formatVND(totalExpense)}đ</span>
                            </div>
                            <div className="flex flex-1 w-full border rounded-lg md:px-8">
                                <span className="flex-1 text-left px-2">Thu Nhập</span>
                                <span className="flex-1 text-right px-2 text-green-500 text-nowrap">+ {formatVND(totalIncome)}đ</span>
                            </div>
                        </div>
                        <div className="flex flex-1 w-full border bg-muted/30 rounded-lg md:px-8 text-foreground">
                            <span className="flex-1 text-left px-2">Thu Chi</span>
                            <span className="flex-1 text-right px-2 text-foreground text-nowrap">{formatVND(balance)}đ</span>
                        </div>
                    </Card>

                    {currentChart === 'pie' && (<div className="gap-2 flex items-center justify-between max-w-md w-full mx-auto rounded-xl my-2 lg:max-w-none lg:mx-0">
                        <Button
                            variant={currentType === 'expense' ? "destructive" : "outline"}
                            onClick={() => { setCurrentType("expense"); }}
                            className="flex-1"
                        >Chi Tiêu
                        </Button>
                        <Button
                            variant={currentType === 'income' ? "default" : "outline"}
                            onClick={() => { setCurrentType("income"); }}
                            className="flex-1"
                        >Thu Nhập
                        </Button>
                    </div>)}
                    {currentChart === "pie" && (
                        <ReportForPieChart map_with_category={map_with_category} currentType={currentType} totalExpense={totalExpense} totalIncome={totalIncome} />
                    )}

                    {(currentChart === "line" || currentChart === "bar") && (
                        <ReportForLineChart map_with_date={map_with_date} />
                    )}
                </div>

                <div className="min-w-0">
                    <Card className="w-full h-[25rem] my-2 p-4">
                        <div className="flex h-full w-full">
                            <div className="hidden md:block"><ChartSwitcher chartType={currentChart} setChartType={setCurrentChart}></ChartSwitcher></div>
                            <div className="flex-1 min-w-0 md:ml-4 md:p-2">
                                <ResponsiveContainer width="100%" height="100%" >
                                    {currentChart === "pie" && (
                                        <PieChartComponent categoryChartData={categoryChartData} totalIncome={totalIncome} totalExpense={totalExpense} currentType={currentType} />
                                    )}
                                    {currentChart === "line" && (
                                        <LineChartComponent dailyData={map_with_date} />
                                    )}
                                    {currentChart === "bar" && (
                                        <BarChartComponent dailyData={map_with_date} />
                                    )}

                                </ResponsiveContainer>
                            </div>

                        </div>
                    </Card>
                    <div className="mx-auto md:hidden">
                        <ChartSwitcher chartType={currentChart} setChartType={setCurrentChart}></ChartSwitcher>
                    </div>
                </div>
            </div>
        </div>
    )
}
