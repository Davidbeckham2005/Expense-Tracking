import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import AddCategory from '../Category/AddCategory';

import { Plus, ChevronDown } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useCategoryStore } from '../../store/useCategoryStore';

import { transactionSchema } from '../../Schemas/transaction.schemas';

import type { IDBTransaction, ITransactionFormData, ICreateTransaction } from '../../types/Transactions';
import type { TColor, IconName } from '../../types/ICategories';

import { icons } from '../../constants/icon';
import { colors } from '../../constants/color';

import Loading from '../../component/Loading';

import VoiceTransaction from '../DetectTransaction/voice';
interface TransactionFormProps {
    mode?: 'create' | 'update';
    transaction?: IDBTransaction | null;
    onClose?: () => void;
    id?: string | null,
}

export default function TransactionForm({ mode = 'create', transaction, onClose, id }: TransactionFormProps) {
    const { user } = useAuth();
    const [showCreateCategory, setShowCreateCategory] = useState(false);


    const { addTransaction, updateTransaction, deleteTransaction, transactions } = useTransactionStore();
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
    const [isLoading, setIsLoading] = useState(false);
    const HandleDelete = async () => {
        try {
            setIsLoading(true);
            await deleteTransaction(id!, user?.id);
            toast.success('Xóa giao dịch thành công!');
        } catch (e) {
            toast.error('Không thể xóa giao dịch!');
        } finally {
            setIsLoading(false)
        }
    }

    const formatDisplay = (value: number | null): string => {
        if (value === null || isNaN(value)) return '0';
        return new Intl.NumberFormat('vi-VN').format(value);
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
    }
    const HandlefillFormAI = (data: ICreateTransaction) => {
        reset({
            amount: data.amount,
            type: data.type,
            category_id: data.category_id,
            note: data.note ?? '',
            transaction_date: data.transaction_date.split('T')[0],
        });
    };
    const [isOpen, setIsOpen] = useState(false);
    const selectedCategory = filteredCategories.find(cat => cat.id === currentCategoryId);
    const SelectedIcon = selectedCategory ? icons[selectedCategory.icon as IconName] : null;
    return (
        <div className="" >
            {showCreateCategory && (
                <AddCategory
                    type={currentType}
                    open={showCreateCategory}
                    onClose={() => setShowCreateCategory(false)}

                />
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-2 border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex gap-2 max-w-xs mx-auto">
                    {/* switch type transactions */}
                    <button
                        type="button"
                        onClick={() => {
                            setValue('type', 'expense');
                            setValue('category_id', '');
                        }}
                        className={`flex-1 py-2 text-sm font-medium transition-colors rounded-lg border border-zinc-800
          ${currentType === 'expense' ? 'bg-red-600 text-white' : 'text-zinc-400'}`}>Tiền chi
                    </button>
                    <button
                        type="button"
                        onClick={() => { setValue('type', 'income'); setValue('category_id', ''); }}
                        className={`flex-1 py-2 text-sm font-medium transition-colors rounded-lg border border-zinc-800
          ${currentType === 'income' ? 'bg-green-600 text-white' : 'text-zinc-400'}`}>Tiền thu
                    </button>
                </div>
                {/* DATE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-[10px] uppercase font-bold">
                            Ngày giao dịch
                        </span>
                        <div className="p-2 border border-zinc-800 rounded-lg">
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
                    </div>
                    {/* AMOUNT */}
                    <div>
                        <span className="text-[10px] uppercase font-bold">
                            Số tiền
                        </span>
                        <div className="p-2 border border-zinc-800 rounded-lg">
                            {/* tai sao o dau co control ? boi vi  */}
                            <Controller
                                name="amount"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <input
                                        type="text"
                                        value={formatDisplay(value)}
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
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full relative">
                        <span className="text-[10px] uppercase font-bold">Ghi chú</span>
                        <div className="p-2 border border-zinc-800 rounded-lg">
                            <input
                                type="text"
                                {...register('note')}
                                placeholder="ví dụ: mua đồ ăn"
                                className="w-full outline-none" />
                        </div>
                    </div>
                    {/* CATEGORY */}
                    <div className="w-full relative">
                        {errors.category_id && (
                            <p className="text-red-400 text-xs mb-2">
                                {errors.category_id.message}
                            </p>
                        )}
                        <span className="text-[10px] uppercase font-bold">
                            Danh mục
                        </span>
                        {/* <div className="p-2 border border-zinc-800 rounded-lg"> */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full p-2.5 flex items-center justify-between rounded-lg border border-zinc-800 text-left transition-all text-sm" >

                            <div className="flex items-center gap-3">
                                {selectedCategory ? (
                                    <>
                                        {SelectedIcon && (
                                            <SelectedIcon
                                                className="w-5 h-5"
                                                style={{ color: colors[selectedCategory.color as TColor] }}
                                            />
                                        )}
                                        <span>{selectedCategory.name}</span>
                                    </>
                                ) : (
                                    <span className="text-gray-400">Chọn danh mục...</span>
                                )}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Menu Dropdown đổ xuống khi isOpen = true */}
                        {isOpen && (
                            <>
                                {/* Lớp overlay trong suốt để bấm ra ngoài thì đóng menu */}
                                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

                                <div className="absolute left-0 right-0 mt-2 z-20 border border-zinc-800 bg-white rounded-lg shadow-xl overflow-hidden">

                                    <div className="max-h-60 overflow-y-auto no-scrollbar p-1 flex flex-col gap-1">
                                        {filteredCategories.map((cat) => {
                                            const Icon = icons[cat.icon as IconName];
                                            const isSelected = currentCategoryId === cat.id;

                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setValue('category_id', cat.id, { shouldValidate: true });
                                                        setIsOpen(false);
                                                    }}
                                                    className={`w-full p-2.5 flex items-center gap-3 rounded-md text-left text-sm transition-colors hover:bg-zinc-300 ${isSelected
                                                        ? 'bg-theme/30 text-white border border-theme/50'
                                                        : ''
                                                        }`}
                                                >
                                                    {Icon && (<Icon
                                                        className="w-5 h-5 shrink-0"
                                                        style={{ color: colors[cat.color as TColor] }} />
                                                    )}
                                                    <span className="truncate">{cat.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Nút "Thêm mới danh mục" cố định ở đáy Dropdown */}
                                    <div className="border-t border-zinc-800 p-1 hover:bg-zinc-300">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCreateCategory(true);
                                                setIsOpen(false);
                                            }}
                                            className="w-full flex items-center justify-center gap-2 rounded-md text-sm  transition-colors">
                                            <Plus className="w-4 h-4" />
                                            <span>Thêm mới danh mục</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                        {/* </div> */}
                    </div>
                </div>

                {/* SUBMIT */}
                <div className="p-2 max-w-sm mx-auto">
                    <button
                        type="submit"
                        title={mode === 'create' ? 'Thêm giao dịch' : 'Cập nhật giao dịch'}
                        disabled={isLoading}
                        className="w-full bg-theme py-2 text-white rounded-lg flex items-center justify-center hover:scale-95 transition-transform disabled:bg-gray-400">
                        {isLoading ? (
                            <Loading />
                        ) : mode === 'create' ? (
                            currentType === 'expense' ? 'Nhập Khoản Chi' : 'Nhập Khoản Thu'
                        ) : (
                            'Cập nhật giao dịch'
                        )}
                    </button>
                    {mode === "update" && (<button className="w-full bg-red-500 text-white py-2 rounded-lg mt-2" type="button" onClick={() => {
                        if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
                            HandleDelete();
                        }
                    }}>Xóa
                    </button>)}
                </div>
            </form >
            {/* <BoxAI onParsed={(data) => HandlefillFormAI(data)} /> */}
            <VoiceTransaction onParsed={(data) => HandlefillFormAI(data)} />
        </div >
    );
}