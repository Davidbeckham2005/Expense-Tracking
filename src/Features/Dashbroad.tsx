import { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, History, PieChart } from 'lucide-react';
import NavBar from './NavBar';
import type { TabType } from '../types/tab';
import Setting from './Setting';
export default function DashBroad() {
    const [tab, setTab] = useState<TabType>('home');


    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
                <div className="lg:col-span-12 text-white">
                    <NavBar tab={tab} setTab={setTab}></NavBar>
                </div>
                <main className="lg:col-span-9 p-4 md:p-8 max-w-7xl w-full mx-auto">

                    {tab === 'home' && (
                        // Grid con cho Trang chủ: Khoảng cách các thành phần là gap-6
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* --- KHU VỰC THỐNG KÊ (3 thẻ chiếm 3 cột trên md, 1 cột trên mobile) --- */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-400 uppercase">Số dư hiện tại</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">15,250,000 đ</p>
                                </div>
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Wallet size={24} /></div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-400 uppercase">Tổng Thu Nhập</p>
                                    <p className="text-2xl font-bold text-green-600 mt-1">+25,000,000 đ</p>
                                </div>
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl"><ArrowUpRight size={24} /></div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-400 uppercase">Tổng Chi Tiêu</p>
                                    <p className="text-2xl font-bold text-red-500 mt-1">-9,750,000 đ</p>
                                </div>
                                <div className="p-3 bg-red-50 text-red-500 rounded-xl"><ArrowDownRight size={24} /></div>
                            </div>


                            {/* --- KHU VỰC PHÂN TÍCH BIỂU ĐỒ (Chiếm 1 cột trên md, 1 cột trên mobile) --- */}
                            <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <PieChart size={20} className="text-purple-500" />
                                        <h3 className="text-lg font-bold text-gray-700">Phân bổ</h3>
                                    </div>
                                    {/* Progress bars */}
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-gray-500">🍔 Ăn uống</span><span>40%</span></div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-orange-500 h-full rounded-full" style={{ width: '40%' }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-gray-500">🏠 Nhà ở</span><span>35%</span></div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-blue-500 h-full rounded-full" style={{ width: '35%' }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-gray-500">🎉 Giải trí</span><span>25%</span></div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-purple-500 h-full rounded-full" style={{ width: '25%' }}></div></div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* --- KHU VỰC LỊCH SỬ GIAO DỊCH (Chiếm 2 cột trên md, giúp cân bằng layout) --- */}
                            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <History size={20} className="text-blue-500" />
                                        <h3 className="text-lg font-bold text-gray-700">Giao dịch mới nhất</h3>
                                    </div>
                                    <button className="text-xs text-blue-600 hover:underline font-bold">Xem tất cả</button>
                                </div>

                                {/* Danh sách các item */}
                                <div className="divide-y divide-gray-100">
                                    <div className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl p-1.5 bg-orange-50 rounded-lg">🍔</span>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-800">Bánh mì & Cà phê</p>
                                                <p className="text-xs text-gray-400">Hôm nay, 08:20</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-sm text-red-500">-45,000 đ</span>
                                    </div>

                                    <div className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl p-1.5 bg-green-50 rounded-lg">💰</span>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-800">Freelance Project</p>
                                                <p className="text-xs text-gray-400">Hôm qua, 18:00</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-sm text-green-600">+4,500,000 đ</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                    {tab === 'khac' && <Setting></Setting>}

                </main>
            </div>
        </div>
    );
}