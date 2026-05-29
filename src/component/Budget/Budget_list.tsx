import { useBudgetStore } from "../../store/useBudgetStore";
import { useTransactionStore } from "../../store/useTransactionStore";

import { getProgressColor } from "../../utils/style";
import { formatVND } from '../../utils/format'
import { useState, useMemo } from 'react'

import { Plus } from 'lucide-react'

import type { IBudget } from '../../types/IBudget'
import BudgetForm from "./Budget_form";
import type { TColor } from "../../types/ICategories";
import { colors } from "../../constants/color";

type selectModeShowBudget = 'all' | 'current_month' | 'overspent' | 'year'
export default function BudgetPage() {
    const [modeShow, setModeShow] = useState<selectModeShowBudget>('current_month')
    // const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    // console.log('Selected month:', selectedMonth, 'Selected year:', selectedYear);
    const { budgets } = useBudgetStore();
    const { transactions } = useTransactionStore();
    const [selectedBudget, setSelectedBudget] = useState<IBudget | null>(null);
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    // const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    // const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    // console.log('Current month:', budgets);

    // console.log(monthStart, monthEnd);
    // hàm lọc ngân sách có thời gian bắt đầu hoặc kết thúc trong tháng hiện tại, nhằm hiển thị và tính toán cho tháng đó.
    
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
            start: null,
            end: null
        }
    }
    const { start, end } = getTimeRangeBudgets()
    console.log('Time range for budgets:', start, end);
    const budgetInRange = budgets.filter(budget => {
        if (!start || !end) {
            return true; // Nếu không có khoảng thời gian cụ thể, giữ lại tất cả ngân sách/ truờng hợp này sẽ xảy ra khi modeShow là 'all' hoặc 'overspent'
        }
        const budgetStart = new Date(budget.start_date);
        const budgetEnd = new Date(budget.end_date);
        return (budgetStart <= end && budgetEnd >= start);
    })
    console.log('Mode show:', modeShow);
    console.log('Start date:', start);
    console.log('End date:', end);
    console.log('Filtered budgets:', budgetInRange);
    console.log('All budgets:', budgets);

    const transactionInRange = transactions.filter(transaction => {
        if (!start || !end) {
            return true; // Nếu không có khoảng thời gian cụ thể, giữ lại tất cả ngân sách/ truờng hợp này sẽ xảy ra khi modeShow là 'all' hoặc 'overspent'
        }
        const transactionDate = new Date(transaction.transaction_date);
        return transactionDate >= start && transactionDate <= end;
        // return true
    })

    // Tạo map rỗng để lưu tổng chi tiêu (number) theo từng category_id (string)
    const expenseByCategory = new Map<string, number>();



    transactionInRange.forEach((transaction) => {
        const current = expenseByCategory.get(transaction.category_id) || 0;
        expenseByCategory.set(
            transaction.category_id,
            current + transaction.amount
        );
    });
    // console.log(expenseByCategory);
    // budget.budget_categories là 1 mảng, 

    const budgetsWithSpent = budgetInRange.map((budget) => {
        const budgetCategories = budget.budget_categories || []
        const spentAmount = budgetCategories.reduce(
            (sum, budgetCat) => {
                return (
                    sum + (expenseByCategory.get(budgetCat.categories.id) || 0)
                );
            },
            0
        );
        const percent = (spentAmount / budget.limit_amount) * 100;
        return {
            ...budget,
            spentAmount,
            percent
        };
    });

    // console.log('Budgets with spent amount:', budgetsWithSpent);
    return (
        <div className="min-h-screen bg-gray-50 p-6">
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
                <div className="flex items-center justify-between w-full my-2">
                    <div>
                        <select
                            value={modeShow}
                            onChange={(e) =>
                                setModeShow(e.target.value as selectModeShowBudget)
                            }
                        >
                            <option value="current_month">Tháng này</option>

                            <option value="year">Theo năm</option>

                            {/* <option value="custom">Tùy chỉnh</option> */}

                            <option value="all">Tất cả</option>

                            <option value="over">Vượt mức</option>
                        </select>
                    </div>
                    <div className="flex bg-theme /90 text-white px-2 py-1 rounded-2xl hover:opacity-90 transition text-nowrap">
                        <Plus>
                        </Plus>
                        <button
                            onClick={() => setIsOpenCreate(true)}>
                            Thêm mới
                        </button>
                    </div>

                </div>
                {(budgetsWithSpent.length === 0) ? (
                    <div className="text-center text-gray-500 py-20">
                        Không có ngân sách nào trong tháng này.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {budgetsWithSpent.map((budget) => (
                            <div
                                key={budget.id}
                                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
                                onClick={() => { setSelectedBudget(budget); setIsOpenUpdate(true) }}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            {budget.name}
                                        </h2>

                                        <p className="text-gray-500 mt-1 text-sm">
                                            {budget.description || 'Không có mô tả'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Đã tiêu</span>
                                        <span className="font-medium">{formatVND(budget.spentAmount)} / {formatVND(budget.limit_amount)}đ</span>
                                    </div>

                                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div title={`${budget.percent.toFixed(2)}%`}
                                            className={`h-full rounded-full ${getProgressColor(budget.percent)}`}
                                            style={{ width: `${budget.percent}%` }}
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">

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
