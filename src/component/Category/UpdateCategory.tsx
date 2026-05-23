import CategoryForm from "./CategoryForm";
import { toast } from "react-hot-toast";
import type {
    ICategory,
    IUpdateCategoryDto,
} from "../../types/ICategories";

import { useCategoryStore } from "../../store/useCategoryStore";
import { useAuth } from "../../context/AuthContext";

type Props = {
    open: boolean;
    onClose: () => void;
    category: ICategory;
};

export default function UpdateCategoryPage({ open, onClose, category, }: Props) {
    const { user } = useAuth();

    const { updateCategory } = useCategoryStore();

    const handleSubmit = async (data: IUpdateCategoryDto): Promise<void> => {
        try {
            await updateCategory(
                category.id,
                data,
                user?.id
            );
            toast.success("Cập nhật danh mục thành công");
        } catch (error) {
            console.error(
                "Failed to update category:",
                error
            );
            toast.error("Cập nhật danh mục thất bại");
        }
    };

    return (
        <CategoryForm
            open={open}
            onClose={onClose}
            mode="edit"
            initialData={category}
            onSubmit={handleSubmit}
        />
    );
}