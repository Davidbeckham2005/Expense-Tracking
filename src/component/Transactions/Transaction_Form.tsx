import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';


import { useAuth } from '../../context/AuthContext';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useCategoryStore } from '../../store/useCategoryStore';

import { transactionSchema } from '../../Schemas/transaction.schemas';

import type { IDBTransaction, ITransactionFormData, ICreateTransaction } from '../../types/Transactions';
import type { TColor, IconName } from '../../types/ICategories';

import { icons } from '../../constants/icon';
import { colors } from '../../constants/color';

import Loading from '../../component/Loading';

interface TransactionFormProps {
    mode?: 'create' | 'update';
    transaction?: IDBTransaction | null;
    onClose?: () => void;
}
// l

export default function TransactionForm({ mode = 'create', transaction, onClose }: TransactionFormProps) {
    const { user } = useAuth();
    const { addTransaction, updateTransaction, } = useTransactionStore();
    const { categories } = useCategoryStore();

    const { control, register, handleSubmit, getValues, setValue, watch, reset, formState: { errors }, } = useForm<ICreateTransaction>({
        resolver: zodResolver(transactionSchema), mode: 'onSubmit',
        defaultValues: {
            amount: transaction?.amount || 0,
            type: transaction?.type || 'expense',
            category_id: transaction?.category_id || '',
            note: transaction?.note || '',
            transaction_date: transaction?.transaction_date.split('T')[0] || new Date().toISOString().split('T')[0],
        },
    });
    const currentType = watch('type');
    const currentCategoryId = watch('category_id');

    const filteredCategories = categories.filter(
        (cat) => cat.type === currentType
    );
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const keyboardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                keyboardRef.current &&
                !keyboardRef.current.contains(event.target as Node)
            ) {
                setShowKeyboard(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    const formatDisplay = (value: number | null): string => {
        if (value === null || isNaN(value)) return '0';
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    const handleKeyPress = (key: string) => {
        const currentAmount = getValues('amount') ?? 0;

        if (key === 'CLEAR') {
            setValue('amount', 0, { shouldValidate: true });
            return;
        }

        if (key === 'BACKSPACE') {
            const strAmount = currentAmount.toString();

            if (strAmount.length <= 1) {
                setValue('amount', 0, { shouldValidate: true });
            } else {
                setValue(
                    'amount',
                    Number(strAmount.slice(0, -1)),
                    {
                        shouldValidate: true,
                    });
            }
            return;
        }
        if (key.startsWith('+')) {
            let shortcutValue = 0;
            if (key === '+100k') shortcutValue = 100000;
            else if (key === '+500k') shortcutValue = 500000;
            else if (key === '+1M') shortcutValue = 1000000;
            setValue('amount', currentAmount + shortcutValue, { shouldValidate: true, });
            return;
        }
        if (key === '000') {
            setValue('amount', Number(`${currentAmount}000`), { shouldValidate: true, });
            return;
        }
        const newAmount = Number(`${currentAmount}${key}`);
        setValue('amount', newAmount, { shouldValidate: true, });
    };
    const onSubmit = async (data: ITransactionFormData) => {
        try {
            setIsLoading(true);
            if (mode === 'create') {
                await addTransaction(data, user?.id);
                toast.success('Giao dịch đã được thêm thành công!');
                reset({
                    amount: 0,
                    type: 'expense',
                    category_id: '',
                    note: '',
                    transaction_date:
                        new Date().toISOString().split('T')[0],
                });
            }
            if (mode === 'update' && transaction) {
                const hasChanges = transaction.amount !== data.amount || transaction.type !== data.type ||
                    transaction.note !== data.note ||
                    transaction.transaction_date !== data.transaction_date;
                if (!hasChanges) {
                    toast.error('Không có thay nào!');
                    return;
                }
                await updateTransaction(transaction.id, data, user?.id);
                toast.success('Cập nhật giao dịch thành công!');
                onClose?.();
            }
        } catch (error) {
            console.error(error);
            toast.error(mode === 'create' ? 'Không thể thêm giao dịch' : 'Không thể cập nhật giao dịch');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen">
            <div className="flex gap-2 max-w-xs mx-auto mb-4">
                {/* switch type transactions */}
                <button
                    type="button"
                    onClick={() => {
                        setValue('type', 'expense');
                        setValue('category_id', '');
                    }}
                    className={`flex-1 py-2 text-sm font-medium transition-colors
          ${currentType === 'expense' ? 'bg-red-600 text-white' : 'text-zinc-400'}`}>Tiền chi
                </button>
                <button
                    type="button"
                    onClick={() => { setValue('type', 'income'); setValue('category_id', ''); }}
                    className={`flex-1 py-2 text-sm font-medium transition-colors
          ${currentType === 'income' ? 'bg-green-600 text-white' : 'text-zinc-400'}`}>Tiền thu
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* DATE */}
                <div className="p-2 border border-zinc-800">
                    <span className="text-[10px] uppercase font-bold">
                        Ngày
                    </span>
                    <input
                        type="date"
                        {...register('transaction_date')}
                        className="w-full outline-none"
                    />

                    {errors.transaction_date && (
                        <p className="text-red-400 text-xs">
                            {errors.transaction_date.message}
                        </p>
                    )}
                </div>

                {/* AMOUNT */}
                <div className="p-2 border border-zinc-800">
                    <span className="text-[10px] uppercase font-bold">
                        Số tiền
                    </span>
                    {/* tai sao o dau co control ? boi vi  */}
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <input
                                type="text"
                                inputMode="none"
                                value={formatDisplay(value)}
                                onFocus={() =>
                                    setShowKeyboard(true)}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, '');
                                    onChange(rawValue ? parseInt(rawValue) : 0
                                    );
                                }}
                                className="w-full outline-none"
                            />
                        )}
                    />
                    {errors.amount && (<p className="text-red-400 text-xs">{errors.amount.message}</p>
                    )}
                </div>
                {/* KEYBOARD */}
                {showKeyboard && (
                    <div ref={keyboardRef} className="p-2 space-y-2 border border-zinc-800">
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9,
                            ].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => handleKeyPress(num.toString())}
                                    className="border border-zinc-800 py-3  rounded-lg">{num}
                                </button>
                            ))}

                            <button
                                className="border border-zinc-800 py-3 rounded-lg"
                                type="button"
                                onClick={() => handleKeyPress('000')}>.000
                            </button>
                            <button
                                className="border border-zinc-800 rounded-lg"
                                type="button"
                                onClick={() => handleKeyPress('0')}>0
                            </button>

                            <button
                                className="border border-zinc-800 py-3 bg-red-500 text-white rounded-lg"
                                type="button"
                                onClick={() => handleKeyPress('BACKSPACE')}>⌫
                            </button>
                        </div>
                    </div>)}

                {/* NOTE */}
                <div className="p-2 border border-zinc-800">
                    <span className="text-[10px] uppercase font-bold">Ghi chú</span>
                    <input
                        type="text"
                        {...register('note')}
                        placeholder="Nhập ghi chú..."
                        className="w-full outline-none" />
                </div>
                {/* CATEGORY */}
                <div className="p-2 border border-zinc-800 max-h-40 overflow-y-auto no-scrollbar">
                    {errors.category_id && (<p className="text-red-400 text-xs mt-2">
                        {errors.category_id.message}
                    </p>
                    )}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {filteredCategories.map((cat) => {
                            const Icon = icons[cat.icon as IconName];
                            const isSelected = currentCategoryId === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setValue('category_id', cat.id, { shouldValidate: true, })}
                                    className={`p-3 rounded-lg border ${isSelected ? 'bg-theme/30' : 'border-zinc-800'}`} >
                                    {Icon && (<Icon className="w-5 h-5 mx-auto" style={{ color: colors[cat.color as TColor], }} />)}
                                    <p className="text-xs mt-2">{cat.name}</p>
                                </button>
                            );
                        })}
                    </div>

                </div>

                {/* SUBMIT */}
                <div className="p-4 max-w-md mx-auto">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-theme py-3 text-white rounded-lg flex items-center justify-center hover:scale-95 transition-transform disabled:bg-gray-400"
                    >
                        {isLoading ? (
                            <Loading />
                        ) : mode === 'create' ? (
                            currentType === 'expense'
                                ? 'Nhập Khoản Chi'
                                : 'Nhập Khoản Thu'
                        ) : (
                            'Cập nhật giao dịch'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}