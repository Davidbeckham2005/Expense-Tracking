import { getCategories } from '../services/categories'
import { useState } from 'react';
import type { ICategory } from '../types/ICategories'
import { useAuth } from '../context/AuthContext'
export default function Input() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const handlerCategory = async () => {
        try {
            const data = await getCategories(user?.id);
            setCategories(data);
            console.log(data);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    }
    return (

        <div className="w-full h-full flex items-center justify-center">
            <button type='button' className='border py-4  px-3 rounded-2xl' onClick={handlerCategory}>Get category</button>
            {categories.map((category) => (
                <div key={category.id}>
                    <p>{category.name}</p>
                </div>
            ))
            }
        </div >
    );
}

