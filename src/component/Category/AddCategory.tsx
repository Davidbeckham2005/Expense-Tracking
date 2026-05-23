import { useState } from 'react';
import {
    Wallet,
    Utensils,
    Car,
    ShoppingCart,
    Gamepad2,
    HeartPulse,
} from 'lucide-react';

const icons = [
    {
        key: 'wallet',
        icon: Wallet,
    },
    {
        key: 'food',
        icon: Utensils,
    },
    {
        key: 'car',
        icon: Car,
    },
    {
        key: 'shopping',
        icon: ShoppingCart,
    },
    {
        key: 'game',
        icon: Gamepad2,
    },
    {
        key: 'health',
        icon: HeartPulse,
    },
];

const colors = [
    '#EF4444',
    '#F97316',
    '#EAB308',
    '#22C55E',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
];

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function AddCategory({
    open,
    onClose,
}: Props) {
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] =
        useState('wallet');

    const [selectedColor, setSelectedColor] =
        useState('#3B82F6');

    if (!open) return null;

    const handleSubmit = () => {
        const payload = {
            name,
            icon: selectedIcon,
            color: selectedColor,
        };

        console.log(payload);

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[420px] rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Add Category
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
                        Category Name
                    </label>

                    <input
                        type="text"
                        placeholder="Food..."
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
                        Choose Icon
                    </label>

                    <div className="grid grid-cols-6 gap-3">
                        {icons.map((item) => {
                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.key}
                                    onClick={() =>
                                        setSelectedIcon(item.key)
                                    }
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl border transition
                  ${selectedIcon === item.key
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200'
                                        }`}
                                >
                                    <Icon size={20} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Colors */}
                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium">
                        Choose Color
                    </label>

                    <div className="flex gap-3">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() =>
                                    setSelectedColor(color)
                                }
                                className={`h-10 w-10 rounded-full border-4 transition
                ${selectedColor === color
                                        ? 'border-black'
                                        : 'border-transparent'
                                    }`}
                                style={{
                                    backgroundColor: color,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    className="w-full rounded-xl bg-blue-500 py-3 font-medium text-white transition hover:bg-blue-600"
                >
                    Create Category
                </button>
            </div>
        </div>
    );
}