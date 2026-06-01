import { useState, useEffect } from 'react';
import { icons } from '../../constants/icon';
import { colors } from '../../constants/color';
import type { TCategoryType, IconName, ICategoryFormData, ICategory, TColor } from "../../types/ICategories";
import { motion, AnimatePresence } from "motion/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm cursor-pointer" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-[26rem] max-w-[90vw] rounded-2xl bg-popover text-popover-foreground border p-6 shadow-xl"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-foreground">
                                {mode === 'add' ? 'Tạo mới' : 'Chỉnh sửa'}
                            </h2>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                ✕
                            </motion.button>
                        </div>

                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Tên
                            </label>

                            <Input
                                type="text"
                                placeholder="Category name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />
                        </div>

                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Biểu tượng
                            </label>

                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-40 overflow-y-scroll pr-1">
                                {Object.entries(icons).map(([key, Icon]) => (
                                    <button
                                        key={key}
                                        onClick={() =>
                                            setSelectedIcon(key as IconName)
                                        }
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl border transition
                  ${selectedIcon === key
                                                ? 'border-primary bg-primary/20 text-primary'
                                                : 'border-border bg-muted/30 text-foreground'
                                            }`}
                                    >
                                        <Icon size={20} />
                                    </button>
                                ))
                                }
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Màu sắc
                            </label>

                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-40 overflow-y-scroll pr-1">
                                {Object.entries(colors).map(([key, color]) => (
                                    <button
                                        key={key}
                                        onClick={() =>
                                            setSelectedColor(key as TColor)
                                        }
                                        className={`h-10 border-2 transition rounded-xl
                ${selectedColor === key
                                                ? 'border-foreground'
                                                : 'border-transparent'
                                            }`}
                                        style={{
                                            backgroundColor: color,
                                        }}>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleSubmit}
                        >
                            Lưu
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
