import { useAuth } from "../../context/AuthContext";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useEffect } from "react";
import AddCategory from './AddCategory'
import { Link } from 'react-router-dom';
export default function ListCategory() {
    const { user } = useAuth();
    const { categories, fetchCategories, isLoading } = useCategoryStore();
    useEffect(() => {
        fetchCategories(user?.id);
    }, []);
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (

        <div>
            <div className="space-y-2">
                <Link to={"/category/add"} className="border rounded-lg">Thêm danh mục</Link>
                {categories.length === 0 ? (
                    <p>Không có category</p>
                ) : (
                    categories.map((category) => (
                        <div
                            key={category.id}
                            className="p-3 border rounded-lg"
                        >
                            <h3 className="font-semibold">
                                {category.name}
                            </h3>
                        </div>
                    ))
                )}
            </div>

        </div>


    );
}