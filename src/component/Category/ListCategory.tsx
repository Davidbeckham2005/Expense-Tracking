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
import type { TCategoryType, IconName , TColor} from "../../types/ICategories";
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

        <div className="min-h-screen space-y-6">
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveType("expense")}
                    className={`border rounded-lg px-3 py-1 ${activeType === "expense" ? "bg-gray-200" : ""
                        }`}
                >
                    Chi tiêu
                </button>

                <button
                    onClick={() => setActiveType("income")}
                    className={`border rounded-lg px-3 py-1 ${activeType === "income" ? "bg-gray-200" : ""
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

            <div className="space-y-2 space-x-2">
                <button onClick={() => setShowCreateCategory(true)} className="border rounded-lg">+ Thêm danh mục</button >
                <button onClick={() => setIsShowDeleteConfirm(!isShowDeleteConfirm)} className="border rounded-lg">Chỉnh sửa danh mục</button >

                {filteredCategories.length === 0 ? (
                    <p className="text-center text-gray-500">Không có category</p>
                ) : (
                    <div className="space-y-2">
                        {filteredCategories.map((category) => {
                            const Icon = icons[category.icon as IconName];
                            return (
                                <div onClick={() => { if (category.is_default) return; setshowUpdateForm(true), setSelectedCategory(category) }}
                                    key={category.id}
                                    className={`flex items-center justify-between border-b-2 border-gray-400/40 rounded-lg transition pr-2
        ${category.is_default ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}
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
                                                {isShowDeleteConfirm && (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        )}
                                        <div
                                            className="w-10 h-10 flex items-center justify-center rounded-full"

                                        >
                                            {Icon && <Icon className="w-5 h-5 text-white" style={{ color: colors[category.color as TColor] || "#E5E7EB" }} />}
                                        </div>

                                        <h3 className="font-medium text-state-700">{category.name}</h3>
                                    </div>

                                    {/* Right: button go to edit */}
                                    <button
                                        className="text-gray-400 hover:text-gray-700"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                )}
            </div>

        </div>


    );
}