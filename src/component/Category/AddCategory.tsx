import CategoryForm from "./CategoryForm";
import type { ICreateCategory } from "../../types/ICategories"
import { useCategoryStore } from '../../store/useCategoryStore'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'
import type { TCategoryType } from "../../types/ICategories";
type Props = {
    open: boolean;
    onClose: () => void;
    type: TCategoryType;
};
export default function AddCategoryPage({ open, onClose, type }: Props) {
    const { user } = useAuth();
    const { addCategory } = useCategoryStore();
    const handleSubmit = async (data: ICreateCategory): Promise<void> => {
        try {
            await addCategory(data, user?.id);
            toast.success('Thêm danh mục thành công');
        } catch (error) {
            console.error('Failed to create category:', error);
            toast.error('Thêm danh mục thất bại');

        }
    }
    return (
        <div>
            <CategoryForm open={open} onClose={onClose} mode="add" onSubmit={handleSubmit} type={type} />
        </div>
    )
}