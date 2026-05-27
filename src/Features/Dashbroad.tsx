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
export default function DashBroad() {
    const { fetchCategories, isLoading } = useCategoryStore();
    const { fetchTransactions, isLoading: isTransactionsLoading } = useTransactionStore();
    const { user } = useAuth();
    const [tab, setTab] = useState<TabType>('category');
    useEffect(() => {
        fetchCategories(user?.id);
        fetchTransactions(user?.id);
    }, []);


    return (
        <div className="min-h-screen bg-white max-w-6xl w-full mx-auto *:bg-slate-50 rounded-3xl overflow-hidden shadow-xl border border-gray-100 ">
            <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-12 text-white">
                    <NavBar tab={tab} setTab={setTab}></NavBar>
                </div>
                {(isLoading || isTransactionsLoading) && <Loading></Loading>}
                <main className="lg:col-span-12 p-4 md:p-8 max-w-6xl w-full mx-auto">
                    {tab === 'category' && <ListCategory></ListCategory>}
                    {tab === 'lich' && <ListTransaction></ListTransaction>}
                    {tab === 'khac' && <Setting></Setting>}
                    {tab === 'nhap-vao' && <ExpenseManager></ExpenseManager>}
                </main>
            </div>
        </div>
    );
}