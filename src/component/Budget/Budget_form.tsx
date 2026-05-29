// zoresolver
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { BudgetFormValues } from "../../Schemas/budget.schema";
import { budgetSchema } from "../../Schemas/budget.schema";
import { icons } from '../../constants/icon'
import { colors } from '../../constants/color'
import type { ICreateBudget, IBudget } from '../../types/IBudget'

import type { IconName, TColor } from '../../types/ICategories';

import { useCategoryStore } from '../../store/useCategoryStore'
import { useState } from 'react';
interface BudgetFormProps {
    defaultValue?: IBudget | null;
    mode: 'create' | 'update';
    onClose: () => void;
}
import { ChevronDown, ChevronUp } from 'lucide-react'
export default function BudgetForm({ defaultValue, mode = 'create', onClose }: BudgetFormProps) {
    // use use form, register....
    // console.log("Default value in form:", defaultValue);
    const { control, register, handleSubmit, formState: { errors }, watch } = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            name: defaultValue?.name || '',
            limit_amount: defaultValue?.limit_amount || 0,
            period: defaultValue?.period || 'daily',
            categories: defaultValue?.budget_categories?.map(bc => bc.categories.id) || [],
            description: defaultValue?.description || '',
            start_date: defaultValue?.start_date || new Date().toISOString().split('T')[0],
            end_date: defaultValue?.end_date || new Date().toISOString().split('T')[0],
        },
    })
    // const watchCategories = watch('categories');
    // console.log("Watched categories:", watchCategories);
    const [openCategory, setOpenCategory] = useState(false);
    const { categories } = useCategoryStore();
    const onSubmit = async (data: BudgetFormValues) => {
        console.log("form date", data);
    }
    console.log(categories)
    return (
        < div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 w-full max-w-3xl mx-auto" >
            <h2 className="text-2xl font-bold mb-5">
                {mode === 'create' ? "Tạo mới ngân sách" : "Cập nhật ngân sách"}
            </h2>

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

                <div>
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
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Giai đoạn
                    </label>

                    <select
                        {...register('period')}
                        className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="yearly">Yearly</option>
                        <option value="daily">Daily</option>
                    </select>
                    {errors.period && (
                        <p className="text-red-500 text-sm">
                            {errors.period.message}
                        </p>
                    )}
                </div>

                <Controller
                    control={control}
                    name="categories"
                    render={({ field, fieldState }) => {
                        const selectedCategories = categories.filter(category => field.value.includes((category.id)));
                        return (
                            <div className="relative">
                                <label className="block text-sm font-medium mb-2">Danh mục</label>
                                {/* INPUT */}
                                <button type="button"
                                    onClick={() => setOpenCategory(prev => !prev)}
                                    className="w-full border rounded-2xl px-4 py-3 flex flex-wrap gap-2 items-center min-h-[50px]">

                                    {selectedCategories.length > 0 ? (selectedCategories.map(category => {
                                        const Icon = icons[category.icon as IconName];
                                        return (
                                            <div key={category.id}
                                                className="flex items-center gap-2 px-2 py-1 rounded-full bg-theme/40 text-sm">
                                                {Icon && (<Icon className="w-4 h-4" style={{ color: colors[category.color as TColor], }} />)}
                                                <span>{category.name}</span>
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
                                                    className={`hover:bg-gray-500 w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${isSelected ? 'border-theme/50 bg-theme/40 text-black' : 'border-gray-200'}`}>
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                                        style={{ backgroundColor: colors[category.color as TColor], }}>
                                                        {Icon && (<Icon className="w-5 h-5 text-white" />)}</div>
                                                    <span className="font-medium">{category.name}</span>
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


                <div className="col-span-1 md:col-span-2">
                    <div className="mt-4 grid grid-cols-2 gap-4 cols-span-2">
                        {/* Ngày bắt đầu */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Ngày bắt đầu
                            </label>
                            <input
                                type="date"
                                {...register('start_date')}
                                readOnly
                                className="w-full border rounded-2xl h-11 px-4 outline-none bg-gray-50 text-gray-500 cursor-not-allowed select-none"
                            />
                            {errors.start_date && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.start_date.message}
                                </p>
                            )}
                        </div>

                        {/* Ngày kết thúc */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Ngày kết thúc
                            </label>
                            <input
                                type="date"
                                {...register('end_date')}
                                readOnly
                                className="w-full border rounded-2xl h-11 px-4 outline-none bg-gray-50 text-gray-500 cursor-not-allowed select-none"
                            />
                            {errors.end_date && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.end_date.message}
                                </p>
                            )}
                        </div>
                    </div>
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
                        <button className="px-5 py-2 rounded-2xl bg-black text-white hover:opacity-90 transition">
                            Lưu
                        </button>
                    </div>
                </div>

            </form >

        </div >
    )
}