import { useAuth } from "../../context/AuthContext";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useState } from "react";
import { icons } from '../../constants/icon';
import { colors } from '../../constants/color';
import type { ICategory } from '../../types/ICategories'
import AddCategory from "./AddCategory";
import UpdateCategory from './UpdateCategory'
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import type { TCategoryType, IconName, TColor } from "../../types/ICategories";
export default function ListCategory() {
    const [activeType, setActiveType] = useState<TCategoryType>('expense');
    const { deleteCategory } = useCategoryStore();
    const { user } = useAuth();
    const { categories } = useCategoryStore();
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [showUpdateForm, setshowUpdateForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState(false);
    const handleDeleteCategory = async (categoryId: string) => {
        try {
            await deleteCategory(categoryId, user?.id || '');
            toast.success("Xóa danh mục thành công");
        }
        catch (error) {
            console.error("Failed to delete category:", error);
            toast.error("Xóa danh mục thất bại");
        }
    }
    const filteredCategories = categories.filter((cat) => cat.type === activeType);

    return (

        <div className="min-h-screen space-y-6 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveType("expense")}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${activeType === "expense"
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    Chi tiêu
                </button>

                <button
                    onClick={() => setActiveType("income")}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${activeType === "income"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    Thu nhập
                </button>
                {showCreateCategory && (
                    <AddCategory
                        type={activeType}
                        open={showCreateCategory}
                        onClose={() => setShowCreateCategory(false)}

                    />
                )}
                {showUpdateForm && selectedCategory && (
                    <UpdateCategory
                        open={showUpdateForm}
                        onClose={() => setshowUpdateForm(false)}
                        category={selectedCategory}
                    />
                )}
            </div>

            <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setShowCreateCategory(true)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        + Thêm danh mục
                    </button>
                    <button
                        onClick={() => setIsShowDeleteConfirm(!isShowDeleteConfirm)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${isShowDeleteConfirm
                            ? "border-red-500 bg-red-50 text-red-600"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        Chỉnh sửa danh mục
                    </button>
                </div>

                {filteredCategories.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-gray-500">
                        Không có category
                    </p>
                ) : (
                    <div className="space-y-3">
                        {filteredCategories.map((category) => {
                            const Icon = icons[category.icon as IconName];
                            return (
                                <div onClick={() => { if (category.is_default) return; setshowUpdateForm(true), setSelectedCategory(category) }}
                                    key={category.id}
                                    className={`group flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition
        ${category.is_default ? "opacity-60" : "cursor-pointer hover:border-gray-300 hover:bg-gray-50"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {!category.is_default && isShowDeleteConfirm && (
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
                                                    handleDeleteCategory(category.id);
                                                }
                                            }}
                                                className="text-gray-400 hover:text-red-500 transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <div
                                            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100"

                                        >
                                            {Icon && <Icon className="h-5 w-5" style={{ color: colors[category.color as TColor] || "#9CA3AF" }} />}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-800">{category.name}</h3>
                                            <p className="text-xs text-gray-500">{category.is_default ? "Mặc định" : category.type}</p>
                                        </div>
                                    </div>

                                    {/* Right: button go to edit */}
                                    <span className="text-gray-300 transition group-hover:text-gray-500">&gt;</span>
                                </div>
                            );
                        })}
                    </div>

                )}
            </div>

        </div>


    );
}