import { useBudgetStore } from "../../store/useBudgetStore";
import { useTransactionStore } from "../../store/useTransactionStore";

import { getProgressColor, getColor } from "../../utils/style";
import { formatVND } from '../../utils/format'
import { useState } from 'react'

import { Plus } from 'lucide-react'

import type { IBudget } from '../../types/IBudget'
import BudgetForm from "./Budget_form";
import type { TColor } from "../../types/ICategories";
import { colors } from "../../constants/color";

type statusBudget = 'onLimited' | 'overLimit' | 'allLimited'
type selectModeShowBudget = 'all' | 'current_month' | 'year'
export default function BudgetPage() {
    const [modeShow, setModeShow] = useState<selectModeShowBudget>('current_month')
    const [statusBudget, setStatusBudget] = useState<statusBudget>('onLimited')
    // const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    // console.log('Selected month:', selectedMonth, 'Selected year:', selectedYear);
    const { budgets } = useBudgetStore();
    const { transactions } = useTransactionStore();
    const [selectedBudget, setSelectedBudget] = useState<IBudget | null>(null);
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);

    const monthName =
        new Date(
            selectedYear,
            selectedMonth
        ).toLocaleString('vi-VN', {
            month: 'long'
        });
    const getTimeRangeBudgets = () => {
        if (modeShow === 'current_month') {
            return {
                start: new Date(selectedYear, selectedMonth, 1),
                end: new Date(selectedYear, selectedMonth + 1, 0)
            }
        }
        if (modeShow === 'year') {
            return {
                start: new Date(selectedYear, 0, 1),
                end: new Date(selectedYear, 11, 31, 23, 59, 59)
            }
        }
        return {
            start: new Date(),
            end: new Date()
        }
    }

    const budgetsMatchSpent = budgets.map((budget) => {
        const budget_start = new Date(budget.start_date);
        const budget_end = new Date(budget.end_date);


        const spentAmount = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.transaction_date)
            const isInBudgetPeriod = transactionDate >= budget_start && transactionDate <= budget_end;

            return isInBudgetPeriod;
        })
            .reduce((sum, transaction) => {
                const CategoriInBudget = budget.budget_categories
                    ?.some(bc => bc.categories.id === transaction.category_id);
                return CategoriInBudget ? sum + transaction.amount : sum
            }, 0)
        return {
            ...budget,
            spentAmount,
            percent: (spentAmount / budget.limit_amount) * 100,
            remainingAmount: budget.limit_amount - spentAmount
        }
    });

    const statusFilterBudget = {
        onLimited: (budget: typeof budgetsMatchSpent[0]) => budget.percent <= 100,
        overLimit: (budget: typeof budgetsMatchSpent[0]) => budget.percent > 100,
        allLimited: (budget: typeof budgetsMatchSpent[0]) => true
    }
    const DateFilterBudget = {
        current_month_year: (budget: typeof budgetsMatchSpent[0]) => {
            const { start, end } = getTimeRangeBudgets();
            const budget_start = new Date(budget.start_date);
            const budget_end = new Date(budget.end_date);
            return budget_start <= end && budget_end >= start;
        },
        all: (budget: typeof budgetsMatchSpent[0]) => true
    }
    const filteredBudgets = budgetsMatchSpent.filter(budget => {
        const matchDate = () => {
            switch (modeShow) {
                case 'current_month':
                case 'year':
                    return DateFilterBudget.current_month_year(budget);
                case 'all':
                    return DateFilterBudget.all(budget);
            }
        }
        const matchStatus = () => {
            switch (statusBudget) {
                case 'onLimited':
                    return statusFilterBudget.onLimited(budget);
                case 'overLimit':
                    return statusFilterBudget.overLimit(budget)
                case 'allLimited':
                    return statusFilterBudget.allLimited(budget)
            }
        }
        return matchDate() && matchStatus();
    });
    // console.log('Filtered budgets:', filteredBudgets);
    // console.log('Budgets match spent:', budgetsMatchSpent);
    // console.log('Budgets with spent amount:', budgetsWithSpent);
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {isOpenCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpenCreate(false)} />
                    <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl p-4 mx-4 max-h-[96vh] overflow-y-auto no-scrollbar">
                        <BudgetForm mode="create" onClose={() => setIsOpenCreate(false)} />
                    </div>
                </div>
            )}
            {isOpenUpdate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpenUpdate(false)} />
                    <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-xl p-4 mx-4 max-h-[96vh] overflow-y-auto no-scrollbar">
                        <BudgetForm mode="update" onClose={() => setIsOpenUpdate(false)} defaultValue={selectedBudget} />
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full mb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                        <div className="flex items-center gap-3">
                            <select
                                value={statusBudget}
                                onChange={(e) => setStatusBudget(e.target.value as typeof statusBudget)}>
                                <option value="onLimited">Khả dụng</option>
                                <option value="overLimit">Vượt giới hạn</option>
                                <option value="allLimited">Tất cả</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={modeShow}
                                onChange={(e) => setModeShow(e.target.value as selectModeShowBudget)}>
                                <option value="current_month">Tháng này</option>
                                <option value="year">Theo năm</option>
                                {/* <option value="custom">Tùy chỉnh</option> */}
                                <option value="all">Tất cả</option>
                            </select>
                            <h2> {modeShow === 'current_month' && `${monthName} ${selectedYear}`}
                            </h2>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 self-start md:self-auto bg-theme/90 text-white px-3 py-2 rounded-xl hover:opacity-90 transition text-nowrap shadow-sm">
                        <Plus className="h-4 w-4" />
                        <button type="button" onClick={() => setIsOpenCreate(true)}> Thêm mới
                        </button>
                    </div>

                </div>
                {(filteredBudgets.length === 0) ? (
                    <div className="text-center text-gray-500 py-20">
                        Không có ngân sách nào trong tháng này.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filteredBudgets.map((budget) => (
                            <div
                                key={budget.id}
                                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
                                onClick={() => { setSelectedBudget(budget); setIsOpenUpdate(true) }}
                            >
                                <div className="flex items-start justify-between w-full">
                                    <div className="w-full">
                                        <div className="w-full flex justify-between items-center gap-2">
                                            <h2 className="text-xl font-semibold">
                                                {budget.name}
                                            </h2>
                                            {budget.is_active && (
                                                <div
                                                    className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                                                    title="Đang hoạt động"
                                                />
                                            )}
                                        </div>
                                        <div className="w-full flex justify-between items-center gap-2">
                                            <p className="text-gray-500 mt-1 text-sm line-clamp-2 truncate">
                                                {budget.description || 'Không có mô tả'}
                                            </p>
                                            <div className="flex gap-1 text-sm font-medium text-gray-600/70">
                                                <span>Còn lại: </span>
                                                <span className={` ${getColor(budget.percent)}`}>
                                                    {formatVND(budget.remainingAmount)}đ
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-full h-3 max-w-[90%] bg-gray-200 rounded-full ">
                                            <div className="w-full flex gap-2 items-center h-full">
                                                <div title={`${budget.percent.toFixed(2)}%`}
                                                    className={`h-full rounded-full ${getProgressColor(budget.percent)}`}
                                                    style={{ width: `${budget.percent}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className={`text-sm font-medium ${getColor(budget.percent)}`}>{budget.percent.toFixed(2)}%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600/70">
                                        <span className="font-medium">Ngân sách {formatVND(budget.limit_amount)}đ</span>
                                        <span className="font-medium">Chi tiêu {formatVND(budget.spentAmount)}đ</span>

                                    </div>
                                    <div className="flex flex-wrap gap-2">

                                        {(budget.budget_categories || []).map((bc) => (
                                            <div
                                                key={bc.categories.id}
                                                className="px-3 py-1 rounded-full text-xs hover:scale-105 transition-all" style={{ backgroundColor: colors[bc.categories.color as TColor] }}
                                            >
                                                {bc.categories.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}</div>
        </div >
    );
}
