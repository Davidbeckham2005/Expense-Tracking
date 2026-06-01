import { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { motion } from "motion/react"

export default function ThemeSettings() {
    // Đọc màu đã lưu từ bộ nhớ máy tính (nếu chưa có thì lấy mặc định xanh dương)
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('app-theme') || 'default';
    });

    const themes = [
        { id: 'default', name: 'Xanh dương', colorClass: 'bg-blue-500' },
        { id: 'purple', name: 'Tím Cyber', colorClass: 'bg-purple-500' },
        { id: 'emerald', name: 'Xanh lục', colorClass: 'bg-emerald-500' },
        { id: 'amber', name: 'Vàng hổ phách', colorClass: 'bg-amber-500' },
    ];

    useEffect(() => {
        // Gắn thuộc tính data-theme trực tiếp lên thẻ html gốc của trang web
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('app-theme', currentTheme);
    }, [currentTheme]);

    return (
        <div className="w-full bg-white/15 backdrop-blur-xl border border-white/40 p-5 md:p-6 rounded-2xl shadow-lg text-slate-800">
            {/* Tiêu đề vùng cài đặt */}
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
                <Palette className="w-5 h-5 text-theme" />
                <h3 className="font-bold tracking-wide">Cài đặt giao diện</h3>
            </div>

            <p className="text-xs text-slate-500 mb-4">Thay đổi màu sắc chủ đề cho ứng dụng chi tiêu:</p>

            {/* Lưới các nút chọn màu */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {themes.map((t) => {
                    const isSelected = currentTheme === t.id;
                    return (
                        <motion.button
                            key={t.id}
                            type="button"
                            onClick={() => setCurrentTheme(t.id)}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl border font-medium text-sm transition-all duration-200 bg-white/20 backdrop-blur-sm
                                ${isSelected
                                    ? ' border-theme text-slate-900 shadow-md scale-[1.02]'
                                    : ' border-white/30 text-slate-500 hover:border-theme/30 hover:text-slate-800'}`}
                        >
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${t.colorClass} shadow-md`} />
                                <span>{t.name}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-theme" />}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}