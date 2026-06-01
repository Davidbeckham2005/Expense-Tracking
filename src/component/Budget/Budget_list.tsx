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
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type statusBudget = 'onLimited' | 'overLimit' | 'allLimited'
type selectModeShowBudget = 'all' | 'current_month' | 'year'
export default function BudgetPage() {
    const [modeShow, setModeShow] = useState<selectModeShowBudget>('current_month')
    const [statusBudget, setStatusBudget] = useState<statusBudget>('onLimited')
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

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
    return (
        <div className="min-h-screen p-4 md:p-6">
            <AnimatePresence>
                {isOpenCreate && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm cursor-pointer" onClick={() => setIsOpenCreate(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative z-10 w-full max-w-xl bg-popover text-popover-foreground border rounded-2xl shadow-xl p-4 mx-4 max-h-[96vh] overflow-y-auto no-scrollbar"
                        >
                            <BudgetForm mode="create" onClose={() => setIsOpenCreate(false)} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isOpenUpdate && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm cursor-pointer" onClick={() => setIsOpenUpdate(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative z-10 w-full max-w-4xl bg-popover text-popover-foreground border rounded-2xl shadow-xl p-4 mx-4 max-h-[96vh] overflow-y-auto no-scrollbar"
                        >
                            <BudgetForm mode="update" onClose={() => setIsOpenUpdate(false)} defaultValue={selectedBudget} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full mb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                        <div className="flex items-center gap-3">
                            <Select
                                value={statusBudget}
                                onValueChange={(val) => setStatusBudget(val as typeof statusBudget)}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="onLimited">Khả dụng</SelectItem>
                                    <SelectItem value="overLimit">Vượt giới hạn</SelectItem>
                                    <SelectItem value="allLimited">Tất cả</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-3">
                            <Select
                                value={modeShow}
                                onValueChange={(val) => setModeShow(val as typeof modeShow)}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="current_month">Tháng này</SelectItem>
                                    <SelectItem value="year">Theo năm</SelectItem>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                </SelectContent>
                            </Select>
                            <h2 className="text-foreground text-sm font-medium"> {modeShow === 'current_month' && `${monthName} ${selectedYear}`}
                            </h2>
                        </div>
                    </div>

                    <Button onClick={() => setIsOpenCreate(true)}>
                        <Plus className="h-4 w-4" />
                        Thêm mới
                    </Button>

                </div>
                {(filteredBudgets.length === 0) ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-muted-foreground py-20"
                    >
                        Không có ngân sách nào trong tháng này.
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-5"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                    >
                        {filteredBudgets.map((budget) => (
                            <motion.div
                                key={budget.id}
                                variants={{
                                    hidden: { opacity: 0, y: 12 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => { setSelectedBudget(budget); setIsOpenUpdate(true) }}
                            >
                                <Card className="p-5 cursor-pointer">
                                    <div className="flex items-start justify-between w-full">
                                        <div className="w-full">
                                            <div className="w-full flex justify-between items-center gap-2">
                                                <h2 className="text-xl font-semibold text-card-foreground">
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
                                                <p className="text-muted-foreground mt-1 text-sm line-clamp-2 truncate">
                                                    {budget.description || 'Không có mô tả'}
                                                </p>
                                                <div className="flex gap-1 text-sm font-medium text-muted-foreground/70">
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
                                            <div className="w-full h-3 max-w-[90%] bg-muted rounded-full ">
                                                <div className="w-full flex gap-2 items-center h-full">
                                                    <div title={`${budget.percent.toFixed(2)}%`}
                                                        className={`h-full rounded-full ${getProgressColor(budget.percent)}`}
                                                        style={{ width: `${budget.percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className={`text-sm font-medium ${getColor(budget.percent)}`}>{budget.percent.toFixed(2)}%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground/70">
                                            <span className="font-medium">Ngân sách {formatVND(budget.limit_amount)}đ</span>
                                            <span className="font-medium">Chi tiêu {formatVND(budget.spentAmount)}đ</span>

                                        </div>
                                        <div className="flex flex-wrap gap-2">

                                            {(budget.budget_categories || []).map((bc) => (
                                                <div
                                                    key={bc.categories.id}
                                                    className="px-3 py-1 rounded-full text-xs text-white hover:scale-105 transition-all" style={{ backgroundColor: colors[bc.categories.color as TColor] }}
                                                >
                                                    {bc.categories.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}</div>
        </div >
    );
}
