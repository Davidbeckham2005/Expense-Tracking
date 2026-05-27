import { useState, useEffect } from 'react';
import { icons } from '../../constants/icon';
import { colors } from '../../constants/color';
import type { TCategoryType, IconName, ICategoryFormData, ICategory, TColor } from "../../types/ICategories";

type Props = {
    open: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    initialData?: ICategory;
    onSubmit: (data: ICategoryFormData) => void;
    type?: TCategoryType;
};

export default function CategoryForm({ open, onClose, mode, initialData, onSubmit, type }: Props) {
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState<IconName | undefined>(undefined);
    const [selectedColor, setSelectedColor] = useState<TColor | undefined>(undefined);

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setName(initialData.name);
            setSelectedIcon(initialData.icon || undefined);
            setSelectedColor(initialData.color || undefined);

        }
    }, [mode, initialData]);
    const handleSubmit = () => {
        const payload: ICategoryFormData = {
            name,
            icon: selectedIcon || undefined,
            color: selectedColor || undefined,
            type: type || 'expense',
        };
        // console.log(payload);
        onSubmit(payload);

        onClose();
    };
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[420px] rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        {mode === 'add' ? 'Tạo mới' : 'Chỉnh sửa'}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500"
                    >
                        ✕
                    </button>
                </div>

                {/* Name */}
                <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium">
                        Tên
                    </label>

                    <input
                        type="text"
                        placeholder="Category name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                    />
                </div>

                {/* Icons */}
                <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium">
                        Biểu tượng
                    </label>

                    <div className="grid grid-cols-6 gap-3 max-h-40 overflow-y-scroll  pr-1">
                        {Object.entries(icons).map(([key, Icon]) => (
                            <button
                                key={key}
                                onClick={() =>
                                    setSelectedIcon(key as IconName)
                                }
                                className={`flex h-12 w-12 items-center justify-center rounded-xl border transition
                  ${selectedIcon === key
                                        ? 'border-theme bg-blue-50'
                                        : 'border-gray-200'
                                    }`}
                            >
                                <Icon size={20} />
                            </button>
                        ))
                        }
                    </div>
                </div>

                {/* Colors */}
                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium">
                        Màu sắc
                    </label>

                    <div className="grid grid-cols-6 gap-3 max-h-40 overflow-y-scroll pr-1">
                        {Object.entries(colors).map(([key, color]) => (
                            <button
                                key={key}
                                onClick={() =>
                                    setSelectedColor(key as TColor)
                                }
                                className={`h-10 w-[1/7] border-2 transition rounded-xl
                ${selectedColor === key
                                        ? 'border-black'
                                        : 'border-transparent'
                                    }`}
                                style={{
                                    backgroundColor: color,
                                }}>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    className="w-full rounded-xl bg-theme py-3 font-medium text-white transition hover:bg-blue-600"
                >
                    Lưu
                </button>
            </div>
        </div >
    );
}