import React, { useEffect, useState } from "react";
import { categoryService } from "../services/category.service";
import { useNavigate } from "react-router-dom";

interface Category {
    id_category: number;
    name: string;
    image?: string;
}

interface Props {
    viewMode?: "grid" | "list"; // 2 chế độ hiển thị
    onCategoryClick?: (categoryId: number | null) => void;
    selectedCategoryId?: number | null;
}

const CategoryShowcase: React.FC<Props> = ({ 
    viewMode = "grid", 
    onCategoryClick,
    selectedCategoryId 
}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        categoryService
            .getAll()
            .then((data) => setCategories(data || []))
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="max-w-screen-2xl mx-auto px-8 mt-20">
                <div className="text-center py-10 text-gray-500">Đang tải danh mục...</div>
            </div>
        );
    }

    if (categories.length === 0) {
        return null; // Không hiển thị gì nếu không có danh mục
    }

    return (
        <div className="max-w-screen-2xl mx-auto px-8 mt-20">

            {/* === MODE 1: GRID WITH IMAGE === */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <div
                            key={cat.id_category}
                            onClick={() => onCategoryClick?.(cat.id_category)}
                            className="group cursor-pointer overflow-hidden shadow hover:shadow-xl transition rounded-xl"
                        >
                            {/* IMAGE */}
                            <div className="h-56 w-full overflow-hidden bg-gray-100">
                                <img
                                    src={
                                        cat.image ||
                                        "https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/w_1536,c_limit/a/dplsp4/nike-just-do-it.jpg"
                                    }
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                            </div>

                            {/* NAME */}
                            <div className="p-4 text-center">
                                <h3 className="text-lg font-semibold">{cat.name}</h3>
                                <p className="text-gray-500 text-sm mt-1">Xem sản phẩm</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* === MODE 2: LIST ONLY TEXT === */}
            {viewMode === "list" && (
                <div className="flex flex-col gap-4">
                    {/* Nút "Tất cả" */}
                    <div
                        onClick={() => onCategoryClick?.(null)}
                        className={`cursor-pointer py-3 px-4 rounded-lg text-lg font-medium transition ${
                            selectedCategoryId === null
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                        Tất cả sản phẩm
                    </div>
                    
                    {categories.map((cat) => (
                        <div
                            key={cat.id_category}
                            onClick={() => onCategoryClick?.(cat.id_category)}
                            className={`cursor-pointer py-3 px-4 rounded-lg text-lg font-medium transition ${
                                selectedCategoryId === cat.id_category
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                            {cat.name}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default CategoryShowcase;
