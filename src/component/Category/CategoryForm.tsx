import { useState, useEffect } from 'react';
import { icons } from '../../constants/icon';
import { colors } from '../../constants/color';
import type { TCategoryType, IconName, ICategoryFormData, ICategory, TColor } from "../../types/ICategories";
import { motion, AnimatePresence } from "motion/react"

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
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-105 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/40 p-6 shadow-xl"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-slate-800">
                                {mode === 'add' ? 'Tạo mới' : 'Chỉnh sửa'}
                            </h2>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="text-slate-500 hover:text-slate-700"
                            >
                                ✕
                            </motion.button>
                        </div>

                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Tên
                            </label>

                            <input
                                type="text"
                                placeholder="Category name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                className="w-full rounded-xl border border-white/30 bg-white/30 backdrop-blur-sm p-3 outline-none focus:border-theme text-slate-800 placeholder-slate-400"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Biểu tượng
                            </label>

                            <div className="grid grid-cols-6 gap-3 max-h-40 overflow-y-scroll pr-1">
                                {Object.entries(icons).map(([key, Icon]) => (
                                    <button
                                        key={key}
                                        onClick={() =>
                                            setSelectedIcon(key as IconName)
                                        }
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl border transition
                  ${selectedIcon === key
                                            ? 'border-theme bg-theme/20'
                                            : 'border-white/30 bg-white/20 backdrop-blur-sm'
                                        }`}
                                    >
                                        <Icon size={20} />
                                    </button>
                                ))
                                }
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
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

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleSubmit}
                            className="w-full rounded-xl bg-theme py-3 font-medium text-white transition hover:opacity-90"
                        >
                            Lưu
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}