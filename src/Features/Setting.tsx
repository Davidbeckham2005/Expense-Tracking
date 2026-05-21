import { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

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
        <div className="w-full backdrop-blur-md border p-6 rounded-2xl shadow-xl text-white">
            {/* Tiêu đề vùng cài đặt */}
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <Palette className="w-5 h-5 text-theme-light" />
                <h3 className="font-bold tracking-wide">Cài đặt giao diện</h3>
            </div>

            <p className="text-xs text-slate-400 mb-4">Thay đổi màu sắc chủ đề cho ứng dụng chi tiêu:</p>

            {/* Lưới các nút chọn màu */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {themes.map((t) => {
                    const isSelected = currentTheme === t.id;
                    return (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setCurrentTheme(t.id)}
                            // text-theme-light và border-theme-light sẽ tự động đổi màu theo nút bạn chọn!
                            className={`flex items-center justify-between px-4 py-3 rounded-xl border font-medium text-sm transition-all duration-200 active:scale-95
                                ${isSelected
                                    ? ' border-theme-light text-white shadow-lg scale-[1.02]'
                                    : ' border-white/5 text-slate-400 hover:border-white/20 hover:text-white'}`}
                        >
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${t.colorClass} shadow-md`} />
                                <span>{t.name}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-theme-light" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}