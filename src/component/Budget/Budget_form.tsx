// zoresolver
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { BudgetFormValues } from "../../Schemas/budget.schema";
import { budgetSchema } from "../../Schemas/budget.schema";
import { icons } from '../../constants/icon'
import { colors } from '../../constants/color'
import type { IBudget, ICreateBudget } from '../../types/IBudget'

import { formatVND } from '../../utils/format'
import type { IconName, TColor } from '../../types/ICategories';
import { X } from 'lucide-react'
import { useCategoryStore } from '../../store/useCategoryStore'
import { useState } from 'react';
import { useBudgetStore } from "../../store/useBudgetStore";

import { useAuth } from '../../context/AuthContext';

import { toast } from 'react-hot-toast'
interface BudgetFormProps {
    defaultValue?: IBudget | null;
    mode: 'create' | 'update';
    onClose: () => void;
}
import { ChevronDown, ChevronUp } from 'lucide-react'

import { useEffect } from 'react'

export default function BudgetForm({ defaultValue, mode = 'create', onClose }: BudgetFormProps) {
    // use use form, register....
    // console.log("Default value in form:", defaultValue);
    const { user } = useAuth();
    const { addBudget, updateBudget, deleteBudget, fetchBudgets } = useBudgetStore();
    const { control, register, handleSubmit, setValue, formState: { errors }, watch } = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            name: defaultValue?.name || '',
            limit_amount: defaultValue?.limit_amount || 0,
            period: defaultValue?.period || 'daily',
            categories_ids: defaultValue?.budget_categories?.map(bc => bc.categories.id) || [],
            description: defaultValue?.description || '',
            start_date: defaultValue?.start_date || new Date().toISOString().split('T')[0],
            end_date: defaultValue?.end_date || new Date().toISOString().split('T')[0],
        }, mode: 'onSubmit'
    })
    // const end_date = watch('end_date');
    const start_date = watch('start_date');
    const period = watch('period');
    const [selectedDate, setSelectedDate] = useState(new Date(start_date).toISOString().split('T')[0]) || new Date().toISOString().split('T')[0];
    const [selectedMonth, setSelectedMonth] = useState(`${new Date(start_date).getFullYear()}-${String(new Date(start_date).getMonth() + 1).padStart(2, '0')}` || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    );
    const [selectedYear, setSelectedYear] = useState(
        String(new Date(start_date || new Date()).getFullYear())
    );
    useEffect(() => {
        let startDate: Date;
        let endDate: Date;

        switch (period) {
            case 'daily': {
                startDate = new Date(selectedDate);
                endDate = new Date(selectedDate);
                break;
            }
            case 'weekly': {
                // const day = today.getDay();
                const currentDate = new Date(selectedDate);
                const day = currentDate.getDay();
                const diffToMonday = day === 0 ? 6 : day - 1;

                startDate = new Date(currentDate);
                startDate.setDate(currentDate.getDate() - diffToMonday)

                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6)

                break;
            }
            case 'monthly': {
                const [year, month] = selectedMonth.split('-').map(Number);
                startDate = new Date(year, month - 1, 1);
                endDate = new Date(year, month, 0);
                break;
            }
            case 'yearly': {
                const year = Number(selectedYear);
                startDate = new Date(year, 0, 1)
                endDate = new Date(year, 11, 31)
                break;
            }
        }
        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        };
        setValue('start_date', formatDate(startDate));
        setValue('end_date', formatDate(endDate));
    }, [period, setValue, selectedDate, selectedMonth, selectedYear]);
    const [openCategory, setOpenCategory] = useState(false);
    const { categories } = useCategoryStore();
    const onSubmit = async (data: ICreateBudget) => {
        try {
            if (mode === 'create') {
                await addBudget(data, user?.id);
                toast.success("Ngân sách đã được tạo thành công!");
                await fetchBudgets(user?.id);
                onClose();
            }
            if (mode === 'update' && defaultValue) {
                const hasChanges = Object.keys(data).some(key => {
                    if (key === 'categories_ids') {
                        const currentCategoryIds = defaultValue.budget_categories?.map(bc => bc.categories.id) || [];
                        return JSON.stringify(currentCategoryIds.sort()) !== JSON.stringify((data.categories_ids || []).sort());
                    }
                    return data[key as keyof ICreateBudget] !== defaultValue[key as keyof IBudget];
                });
                if (!hasChanges) {
                    toast.error("Không có thay đổi nào để cập nhật.");
                }
                else {
                    await updateBudget(defaultValue.id, data, user!.id);
                    toast.success("Ngân sách đã được cập nhật thành công!");
                    await fetchBudgets(user?.id);
                    onClose();
                }

            }
            // else {
            //     await updateBudget(defaultValue!.id, data);
            // }
        }
        catch (error) {
            console.error("Error creating/updating budget:", error);
            toast.error("Có lỗi xảy ra khi tạo/cập nhật ngân sách.");
        }
        finally {
            // setIsSubmitting(false);
        }
    }
    const handleDelete = async () => {
        try {
            await deleteBudget(defaultValue!.id, user!.id);
            toast.success("Ngân sách đã được xóa thành công!");
            onClose();
        }
        catch (error) {
            console.error("Error deleting budget:", error);
            toast.error("Có lỗi xảy ra khi xóa ngân sách.");
        }

    }
    return (
        < div className="bg-white rounded-3xl p-6 shadow-sm border-gray-100 w-full max-w-4xl mx-auto" >
            <div className="flex items-center justify-between">
                <div className="md:flex md:gap-2 md:items-center ">
                    <h2 className="flex-1 text-2xl font-bold md:mb-5">
                        {mode === 'create' ? "Tạo mới ngân sách" : "Cập nhật ngân sách"}
                    </h2>
                    <p className="text-gray-500 text-sm md:mb-3">
                        ({watch('start_date')} → {watch('end_date')})
                    </p>
                </div>
                <button onClick={() => onClose()} className="h-8 w-8 mb-3 text-right hover:text-red-600 cursor-pointer hover:scale-95 rounded-full">
                    ✕
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Tên
                    </label>

                    <input
                        {...register('name')}
                        placeholder="Ví dụ: Ăn uống tháng 5"
                        className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                {/* <div>
                    <label className="block text-sm font-medium mb-2">
                        Số tiền (VND)
                    </label>

                    <input
                        {...register('limit_amount', { valueAsNumber: true })}
                        type="number"
                        placeholder="3000000"
                        className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />
                    {errors.limit_amount && <p className="text-red-500 text-sm mt-1">{errors.limit_amount.message}</p>}
                </div> */}
                <Controller
                    control={control}
                    name="limit_amount"
                    render={({ field }) => (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Số tiền (VND)
                            </label>
                            <input
                                value={formatVND(field.value)}
                                type="text"
                                placeholder="3.000.000"
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, '');
                                    field.onChange(
                                        rawValue ? Number(rawValue) : 0
                                    );
                                }}
                                className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            />
                            {errors.limit_amount && <p className="text-red-500 text-sm mt-1">{errors.limit_amount.message}</p>}
                        </div>
                    )}
                />

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Giai đoạn
                    </label>

                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { value: 'daily', label: 'Ngày' },
                            { value: 'weekly', label: 'Tuần' },
                            { value: 'monthly', label: 'Tháng' },
                            { value: 'yearly', label: 'Năm' },
                        ].map((item) => {
                            const isActive = period === item.value;
                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setValue('period', item.value as any)}
                                    className={`rounded-2xl border py-1 transition-all text-center text-sm border-gray-200 hover:border-gray-400 
                                        ${isActive ? 'bg-theme text-white border-black' : 'border-gray-200 hover:border-black'}`}>
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>

                    {errors.period && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.period.message}
                        </p>
                    )}
                </div>



                <div>
                    {period === 'daily' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Chọn ngày
                            </label>

                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full border rounded-2xl px-4 py-3 outline-none"
                            />
                        </div>
                    )}

                    {period === 'weekly' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Chọn ngày trong tuần
                            </label>

                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full border rounded-2xl px-4 py-3 outline-none"
                            />
                        </div>
                    )}

                    {period === 'monthly' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Chọn tháng
                            </label>

                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="w-full border rounded-2xl px-4 py-3 outline-none"
                            />
                        </div>
                    )}

                    {period === 'yearly' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Chọn năm
                            </label>

                            <input
                                type="number"
                                min="2000"
                                max="2100"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full border rounded-2xl px-4 py-3 outline-none"
                            />
                        </div>)}
                </div>

                <div className="col-span-1 md:col-span-2">
                    <Controller
                        control={control}
                        name="categories_ids"
                        render={({ field, fieldState }) => {
                            const selectedCategories = categories.filter(category => field.value.includes((category.id)));
                            return (
                                <div className="relative">
                                    <label className="block text-sm font-medium mb-2">Danh mục</label>
                                    {openCategory && (
                                        <div className="rounded-2xl text-2xl text-red-500 hover:scale-95 cursor-pointer hover:opacity-90 transition  absolute top-10 right-4"
                                            onClick={() => setOpenCategory(false)}
                                        >
                                            <X></X>
                                        </div>
                                    )}
                                    <button type="button"
                                        onClick={() => setOpenCategory(prev => !prev)}
                                        className="w-full border rounded-2xl px-4 py-3 flex flex-wrap gap-2 items-center min-h-12.5">

                                        {selectedCategories.length > 0 ? (selectedCategories.map(category => {
                                            const Icon = icons[category.icon as IconName];
                                            return (
                                                <div key={category.id}
                                                    className="flex items-center gap-2 px-2 py-1 rounded-full bg-theme/40 text-sm group relative">
                                                    {Icon && (<Icon className="w-4 h-4" style={{ color: colors[category.color as TColor], }} />)}
                                                    <span >{category.name}</span>
                                                    <div
                                                        className=" absolute -top-1 -right-1 hidden group-hover:flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-xs"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            field.onChange(field.value.filter((id: string) => id !== category.id));
                                                        }}><X></X></div>
                                                </div>);

                                        })) :
                                            (
                                                <div className="flex w-full justify-between gap-2 text-gray-500">
                                                    <span className="">Chọn...</span>
                                                    <span>
                                                        {openCategory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </span>
                                                </div>
                                            )}


                                    </button>
                                    {/* DROPDOWN */}
                                    {
                                        openCategory && (<div className="right-0 absolute z-50 w-full bg-white border border-gray-400 shadow-lg p-3 max-h-72 overflow-y-auto no-scrollbar">
                                            <div>{categories.map(category => {
                                                const Icon = icons[category.icon as IconName];
                                                const isSelected = field.value.includes(category.id);
                                                return (
                                                    <button type="button"
                                                        key={category.id}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                field.onChange(field.value.filter((id: string) => id !== category.id));
                                                            }
                                                            else {
                                                                field.onChange([...field.value, category.id,]);
                                                            }
                                                        }}
                                                        className={`hover:bg-gray-500 w-full grid grid-cols-2 gap-3 p-3 rounded-xl border transition-all ${isSelected ? 'border-theme/50 bg-theme/40 text-black' : 'border-gray-200'}`}>
                                                        <div className="col-span-1 flex items-center gap-2 text-left">
                                                            <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                                                style={{ backgroundColor: colors[category.color as TColor], }}>
                                                                {Icon && (<Icon className="w-5 h-5 text-white" />)}</div>
                                                            <span className="font-medium">{category.name}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                            </div>
                                        </div>
                                        )
                                    }

                                    {
                                        fieldState.error && (
                                            <p className="text-red-500 text-sm mt-2">
                                                {fieldState.error.message}
                                            </p>
                                        )
                                    }
                                </div>
                            );
                        }}
                    />
                    <div className="">
                        <label className="block text-sm font-medium mb-2">
                            Mô tả
                        </label>

                        <textarea
                            rows={4}
                            placeholder="Ghi chú..."
                            {...register('description')}
                            className="w-full border rounded-2xl pt-2 px-4 outline-none focus:ring-2 focus:ring-black resize-none"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">
                                {errors.description.message}
                            </p>
                        )}

                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6">
                        <button className="px-5 py-2 rounded-2xl border hover:bg-gray-100 transition" onClick={onClose}>
                            Hủy
                        </button>
                        <button className="px-5 py-2 rounded-2xl bg-theme text-white hover:opacity-90 transition">
                            Lưu
                        </button>
                        {mode === "update" && defaultValue && (
                            <button className="px-5 py-2 rounded-2xl bg-red-600 text-white hover:opacity-90 transition"
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm("Bạn có chắc chắn muốn xóa ngân sách này?")) {
                                        handleDelete()
                                    }
                                }}>
                                Xóa
                            </button>
                        )}
                    </div>
                </div>

            </form >

        </div >
    )
}