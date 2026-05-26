import { useState, useEffect, useRef, useCallback } from 'react';

import { useAuth } from '../context/AuthContext';
import { useTransactionStore } from '../store/useTransactionStore';
import { useCategoryStore } from '../store/useCategoryStore';
import { icons } from '../constants/icon';
import { colors } from '../constants/color';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import type { ICreateTransaction, IDBTransaction, ITransactionFormData } from '../types/Transactions';
import { type TransactionInput, transactionSchema } from '../Schemas/transaction.schemas';
import type { TCategoryType } from '../types/ICategories';
import toast from 'react-hot-toast';
import Loading from '../component/Loading';
export default function ExpenseManager() {
    // các công cụ của react-hook-form
    const { user } = useAuth();
    const { control, register, handleSubmit, getValues, setValue, watch, reset, formState: { errors }, } = useForm<TransactionInput>({
        resolver: zodResolver(transactionSchema), mode: "onSubmit",
        defaultValues: {
            amount: 0,
            type: 'expense',
            category_id: '',
            note: '',
            transaction_date: new Date().toISOString().split('T')[0], // Đặt mặc định là ngày hiện tại
        }
    });
    const { addTransaction } = useTransactionStore();
    const { categories } = useCategoryStore();
    const currentType = watch('type') || 'expense';
    const currentCategoryId = watch('category_id');
    const filteredCategories = categories.filter((cat) => cat.type === currentType);
    const [showKeyboard, setShowKeyboard] = useState(false);

    const formatDisplay = (value: number | null): string => {
        if (value === null || isNaN(value)) return '0';
        return new Intl.NumberFormat('vi-VN').format(value);
    }
    const keyboardRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (keyboardRef.current && !keyboardRef.current.contains(event.target as Node)) {
                setShowKeyboard(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const handleKeyPress = (key: string) => {
        const currentAmount = getValues('amount') ?? 0;
        let currentStr = currentAmount.toString();
        if (key === 'CLEAR') {
            setValue('amount', 0, { shouldValidate: true });
            return;
        }
        if (key === 'BACKSPACE') {
            const strAmount = currentAmount.toString();
            if (strAmount.length <= 1) {
                setValue('amount', 0, { shouldValidate: true });
            } else {
                setValue('amount', Number(strAmount.slice(0, -1)), { shouldValidate: true });
            }
            return;
        }
        if (key.startsWith('+')) {
            let shortcutValue = 0;
            if (key === '+100k') shortcutValue = 100000;
            else if (key === '+500k') shortcutValue = 500000;
            else if (key === '+1M') shortcutValue = 1000000;

            const newAmount = currentAmount + shortcutValue;
            if (newAmount <= 10000000000) {
                setValue('amount', newAmount, { shouldValidate: true });
            }
            return;
        }
        if (currentAmount === 0 && key === '0') return;
        const newAmount = Number(`${currentStr}${key}`);
        if (newAmount <= 10000000000) {
            setValue('amount', newAmount, { shouldValidate: true });
        }
    };
    const onSubmit = async (data: ITransactionFormData) => {
        setIsLoading(true);
        try {
            // console.log("Submitting transaction:", data, "for user:", user?.id);
            await addTransaction(data, user?.id);
            toast.success("Giao dịch đã được thêm thành công!");
            reset();
        } catch (error) {
            console.error("Failed to add transaction:", error);
            toast.error("Có lỗi xảy ra khi thêm giao dịch.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen">
            <div className="flex gap-2 max-w-xs mx-auto mb-4">
                <button type="button"
                    onClick={() => { setValue('type', 'expense'); setValue('category_id', '') }}
                    className={`flex-1 py-2  text-sm font-medium transition-colors
              ${currentType === 'expense'
                            ? 'bg-red-600 text-white'
                            : ' text-zinc-400'}`}
                >
                    Tiền chi
                </button>
                <button type="button"
                    onClick={() => { setValue('type', 'income'); setValue('category_id', '') }}
                    className={`flex-1 py-2  text-sm font-medium transition-colors
              ${currentType === 'income'
                            ? 'bg-green-600 text-white'
                            : ' text-zinc-400'}`}
                >
                    Tiền thu
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {/* Ngày */}
                    <div className="p-2 border border-zinc-800">
                        <span className="text-[10px] block uppercase font-bold">Ngày</span>
                        <input
                            type="date"
                            {...register('transaction_date')}
                            className="bg-gray-800/10 rounded-xs text-sm font-medium  outline-none w-full"
                        />
                        {errors.transaction_date && <p className="text-red-400 text-xs pl-1">{errors.transaction_date.message}</p>}
                    </div>


                    <div className=" p-2  border border-zinc-800">
                        <span className="text-[10px] block uppercase font-bold">Số tiền</span>
                        <div className="grid grid-cols-12 gap-2">
                            <Controller
                                name="amount"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <input
                                        type="text"
                                        inputMode="none"
                                        value={formatDisplay(value) || ''}
                                        onFocus={() => setShowKeyboard(true)}
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\D/g, '');
                                            const numValue = rawValue ? parseInt(rawValue, 10) : 0;
                                            onChange(numValue);
                                        }}
                                        placeholder="0"
                                        className="text-sm font-medium outline-none w-full col-span-11 bg-gray-800/10 rounded-xs"
                                    />
                                )}
                            />
                            <span className="text-right max-w-0.5">VND</span>
                        </div>
                        {errors.amount && <p className="text-red-400 text-xs pl-1">{errors.amount.message}</p>}
                    </div>

                    {showKeyboard && (
                        <div className="p-2 border border-zinc-800/10 bg-zinc-950/40 space-y-2" ref={keyboardRef}>
                            {/* Hàng phím tắt cộng nhanh */}
                            <div className="w-full text-right pr-2">
                                <button className="text-theme" type="button" onClick={() => setShowKeyboard(false)}>
                                    Hoàn thành
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                                {['+100k', '+500k', '+1M'].map((shortcut) => (
                                    <button
                                        key={shortcut}
                                        type="button"
                                        onClick={() => handleKeyPress(shortcut)}
                                        className="py-1.5 text-xs font-semibold  text-zinc-200 hover:bg-zinc-700 active:scale-95 transition rounded"
                                    >
                                        {shortcut}
                                    </button>
                                ))}
                            </div>

                            {/* Lưới bàn phím số chuẩn */}
                            <div className="grid grid-cols-3 gap-1.5 text-white">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => handleKeyPress(num.toString())}
                                        className="py-3 font-medium bg-gray-900 hover:bg-zinc-700 active:bg-zinc-600 transition rounded text-center"
                                    >
                                        {num}
                                    </button>
                                ))}

                                {/* Hàng cuối: Xóa hết, Số 0, Xóa từng số */}
                                <button
                                    type="button"
                                    onClick={() => handleKeyPress('000')}
                                    className="py-3 font-bold text-zinc-400 bg-gray-900 hover:bg-zinc-800 transition rounded"
                                >
                                    .000
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleKeyPress('0')}
                                    className="py-3 font-medium bg-gray-900 hover:bg-zinc-700 active:bg-zinc-600 transition rounded"
                                >
                                    0
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleKeyPress('BACKSPACE')}
                                    className="py-3 text-sm font-bold text-zinc-400 bg-gray-900 hover:bg-zinc-700 active:bg-zinc-600 transition rounded flex items-center justify-center"
                                >
                                    ⌫
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleKeyPress('CLEAR')}
                                className="w-full py-2 text-xs font-semibold text-red-400/80 bg-gray-900 hover:bg-red-950/20 border border-zinc-800/60 transition rounded mt-1.5"
                            >
                                Xóa toàn bộ số tiền
                            </button>
                        </div>
                    )}
                    {/* Ghi chú */}
                    <div className=" p-2  border border-zinc-800">
                        <span className="text-[10px] block uppercase font-bold">Ghi chú</span>
                        <input
                            type="text"
                            {...register('note')}
                            placeholder="Nhập nội dung..."
                            className="bg-transparent text-sm font-medium  outline-none w-full"
                        />
                        {errors.note && <p className="text-red-400 text-xs pl-1">{errors.note.message}</p>}

                    </div>
                    <div className="p-2 border border-zinc-800  overflow-y-auto h-48">
                        <span className="text-[10px] block uppercase font-bold text-zinc-400 tracking-wider">
                            Danh mục chi tiêu
                        </span>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {filteredCategories.map((cat) => {
                                const Icon = icons[cat.icon as keyof typeof icons];
                                const isSelected = currentCategoryId === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setValue('category_id', cat.id, { shouldValidate: true })}
                                        className={`p-3 flex flex-col items-center justify-center gap-1.5 rounded-lg border text-center transition-all active:scale-95
                  ${isSelected
                                                ? `bg-amber-100 font-semibold shadow-sm`
                                                : ' border-zinc-800 hover:bg-gray-900 hover:text-zinc-200'
                                            }`}
                                    >
                                        {/* Icon (Emoji) */}

                                        <span>   {Icon && <Icon className="w-5 h-5 text-white" style={{ color: colors[cat.color as keyof typeof colors] || "#E5E7EB" }} />}</span>
                                        {/* Tên Category */}
                                        <span className="text-xs truncate w-full">{cat.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.category_id && <p className="text-red-400 text-xs pl-1">{errors.category_id.message}</p>}
                    </div>
                    {isLoading && <Loading />}
                    <div className="p-2 max-w-xs mx-auto mt-4 ">
                        <button type="submit"
                            className="w-full bg-theme py-2 rounded-xs text-white font-medium"
                        >
                            {isLoading ? (
                                <Loading></Loading>
                            ) : (
                                `${currentType === 'expense' ? 'Nhập Khoản Chi' : 'Nhập Khoản Thu'}`
                            )}
                        </button>
                    </div>

                </div>
            </form >

        </div >

    );
}