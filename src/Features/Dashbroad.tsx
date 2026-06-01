import { useState, useEffect } from 'react';
import NavBar from './NavBar';
import type { TabType } from '../types/tab';
import ExpenseManager from '../component/Transactions/AddTransaction';
import ListCategory from '../component/Category/ListCategory';
import { useAuth } from '../context/AuthContext';
import { useCategoryStore } from '../store/useCategoryStore';
import Loading from '../component/Loading';
import { useTransactionStore } from '../store/useTransactionStore';
import ListTransaction from '../component/Transactions/ListTransaction';
import ReportTransaction from '../component/Report/Report_form';
import BudgetPage from '../component/Budget/Budget_list';
import { useBudgetStore } from '../store/useBudgetStore';
import ThemeSettings from './Setting';
import { AnimatePresence, motion } from "motion/react"


export default function DashBroad() {
    const { fetchCategories, isLoading } = useCategoryStore();
    const { fetchTransactions, isLoading: isTransactionsLoading } = useTransactionStore();
    const { fetchBudgets, isLoading: isBudgetsLoading, deactivateBudget, isLoading: isDeactivateLoading } = useBudgetStore();
    const { user } = useAuth();
    const [tab, setTab] = useState<TabType>('nhap-vao');
    useEffect(() => {
        deactivateBudget(user?.id);
        fetchCategories(user?.id);
        fetchTransactions(user?.id);
        fetchBudgets(user?.id);
    }, []);
    if (isLoading || isTransactionsLoading || isBudgetsLoading || isDeactivateLoading) {
        return <Loading></Loading>;
    }
    return (
        <div className="min-h-screen max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl w-full mx-auto">
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-12">
                        <NavBar tab={tab} setTab={setTab}></NavBar>
                    </div>

                    <main className="lg:col-span-12 p-4 md:p-8 w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={tab}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.2 }}
                            >
                                {tab === 'category' && <ListCategory />}
                                {tab === 'lich' && <ListTransaction />}
                                {tab === 'bao-cao' && <ReportTransaction />}
                                {tab === 'nhap-vao' && <ExpenseManager />}
                                {tab === 'budget' && <BudgetPage />}
                                {tab === 'setting' && <ThemeSettings />}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
        <div className="min-h-screen bg-white max-w-6xl w-full mx-auto *:bg-slate-50 rounded-3xl overflow-hidden shadow-xl border border-gray-100 ">
            <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-12 text-white">
                    <NavBar tab={tab} setTab={setTab}></NavBar>
                </div>
                <main className="lg:col-span-12 p-4 md:p-8 max-w-6xl w-full mx-auto">
                    {tab === 'category' && <ListCategory></ListCategory>}
                    {tab === 'lich' && <ListTransaction></ListTransaction>}
                    {/* {tab === 'khac' && <Setting></Setting>} */}
                    {tab === 'bao-cao' && <ReportTransaction></ReportTransaction>}
                    {tab === 'nhap-vao' && <ExpenseManager></ExpenseManager>}
                    {tab === 'budget' && <BudgetPage></BudgetPage>}
                </main>
            </div>
        </div>
    );
}
