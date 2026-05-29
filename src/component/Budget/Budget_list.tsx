import { useBudgetStore } from "../../store/useBudgetStore";
import { useTransactionStore } from "../../store/useTransactionStore";

import { getProgressColor } from "../../utils/style";
import { formatVND } from '../../utils/format'
import { useState, useMemo } from 'react'




import type { IBudget } from '../../types/IBudget'
import BudgetForm from "./Budget_form";
export default function BudgetPage() {
    const { budgets } = useBudgetStore();
    const { transactions } = useTransactionStore();
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedBudget, setSelectedBudget] = useState<IBudget | null>(null);
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    console.log('Current month:', budgets);
    const filteredBudgets = budgets.filter(budget => {
        const budgetStart = new Date(budget.start_date);
        const budgetEnd = new Date(budget.end_date);
        return (budgetStart <= monthEnd && budgetEnd >= monthStart);
    })
    const transactionsInMonth = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
    })
    const expenseByCategory = new Map<string, number>();

    transactionsInMonth.forEach((transaction) => {
        const current =
            expenseByCategory.get(transaction.category_id) || 0;

        expenseByCategory.set(
            transaction.category_id,
            current + transaction.amount
        );
    });
    const budgetsWithSpent = filteredBudgets.map((budget) => {

        const spentAmount = budget.budget_categories.reduce(
            (sum, budgetCat) => {

                return (
                    sum +
                    (expenseByCategory.get(
                        budgetCat.categories.id
                    ) || 0)
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

    console.log('Budgets with spent amount:', budgetsWithSpent);
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {isOpenCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpenCreate(false)} />
                    <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl p-4 mx-4 max-h-[96vh] overflow-y-auto no-scrollbar">
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={() => setIsOpenCreate(false)} className="h-8 flex items-center justify-end w-full rounded-full">
                                ✕
                            </button>
                        </div>
                        <BudgetForm mode="create" onClose={() => setIsOpenCreate(false)} />
                    </div>
                </div>
            )}
            {isOpenUpdate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpenUpdate(false)} />
                    <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl p-4 mx-4 max-h-[96vh] overflow-y-auto no-scrollbar">
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={() => setIsOpenUpdate(false)} className="h-8 flex items-center justify-end w-full rounded-full">
                                ✕
                            </button>
                        </div>
                        <BudgetForm mode="update" onClose={() => setIsOpenUpdate(false)} defaultValue={selectedBudget} />
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between ">
                    <button className="bg-theme/90 text-white px-2 py-1 rounded-2xl hover:opacity-90 transition"
                        onClick={() => setIsOpenCreate(true)}>
                        Thêm mới
                    </button>
                </div>

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
                                    <div
                                        className={`h-full rounded-full ${getProgressColor(budget.percent)}`}
                                        style={{ width: `${budget.percent}%` }}
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {budget.budget_categories.map((bc) => (
                                        <div
                                            key={bc.categories.id}
                                            className="px-3 py-1 bg-gray-100 rounded-full text-xs"
                                        >
                                            {bc.categories.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
