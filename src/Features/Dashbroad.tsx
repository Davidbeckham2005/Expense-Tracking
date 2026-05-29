import { useState, useEffect } from 'react';
import NavBar from './NavBar';
import type { TabType } from '../types/tab';
import Setting from './Setting';
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


export default function DashBroad() {
    const { fetchCategories, isLoading } = useCategoryStore();
    const { fetchTransactions, isLoading: isTransactionsLoading } = useTransactionStore();
    const { fetchBudgets, isLoading: isBudgetsLoading, deactivateBudget, isLoading: isDeactivateLoading } = useBudgetStore();
    const { user } = useAuth();
    const [tab, setTab] = useState<TabType>('budget');
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
        <div className="min-h-screen bg-white max-w-6xl w-full mx-auto *:bg-slate-50 rounded-3xl overflow-hidden shadow-xl border border-gray-100 ">
            <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-12 text-white">
                    <NavBar tab={tab} setTab={setTab}></NavBar>

                </div>

                <main className="lg:col-span-12 p-4 md:p-8 max-w-6xl w-full mx-auto">
                    {tab === 'category' && <ListCategory></ListCategory>}
                    {tab === 'lich' && <ListTransaction></ListTransaction>}
                    {tab === 'khac' && <Setting></Setting>}
                    {tab === 'bao-cao' && <ReportTransaction></ReportTransaction>}
                    {tab === 'nhap-vao' && <ExpenseManager></ExpenseManager>}
                    {tab === 'budget' && <BudgetPage></BudgetPage>}
                </main>
            </div>
        </div>
    );
}