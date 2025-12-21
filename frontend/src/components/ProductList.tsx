import React, { useEffect, useState } from "react";
import { productService } from "../services/product.service";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../hooks/useCurrency";

interface Product {
  id_product: number;
  name: string;
  price: number;
  description: string;
  image: string;
  id_category?: number;
}

interface ProductListProps {
  categoryId?: number | null;
  searchTerm?: string;
}

const ProductList: React.FC<ProductListProps> = ({ categoryId, searchTerm }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { formatVND } = useCurrency();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let data: Product[];
        
        if (searchTerm && searchTerm.trim() !== "") {
          // Tìm kiếm sản phẩm
          data = await productService.search(searchTerm);
        } else if (categoryId) {
          // Lấy sản phẩm theo category
          data = await productService.getByCategory(categoryId);
        } else {
          // Lấy tất cả sản phẩm
          data = await productService.getAll();
        }

        setProducts(data || []);
      } catch {
        setProducts([]); // Không có data nếu API lỗi
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [categoryId, searchTerm]);

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Danh sách sản phẩm</h1>
        <div className="text-center py-10 text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-screen-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Danh sách sản phẩm</h1>
        <div className="text-center py-10 text-gray-500">
          {searchTerm 
            ? `Không tìm thấy sản phẩm nào với từ khóa "${searchTerm}"`
            : categoryId
            ? "Không có sản phẩm nào trong danh mục này"
            : "Chưa có sản phẩm nào"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-10">

      {/* LIST PRODUCTS */}
      <h1 className="text-3xl font-bold mb-8">Danh sách sản phẩm</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <div
            key={index}
            className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition bg-white"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
            />

            <div className="p-5">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <span className="text-yellow-500 text-xl">⭐</span>
              </div>

              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {product.description}
              </p>

              <p className="text-black font-bold text-xl mt-3">
                {formatVND(product.price)}
              </p>
              <button
                onClick={() => navigate(`/product/${product.id_product}`)}
                className="w-full mt-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
