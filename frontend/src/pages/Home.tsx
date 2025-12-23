import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { userService } from "../services/user.service";
import ProductList from "../components/ProductList";
import CategoryShowcase from "../components/CategoryShowcase";

const Home: React.FC = () => {
  const { userId, setSearchTerm } = useAppContext();
  const [, setUserName] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTermFromUrl = searchParams.get("search") || "";
  const categoryIdFromUrl = searchParams.get("category");
  
  // Lấy categoryId từ URL hoặc null
  const selectedCategoryId = categoryIdFromUrl ? parseInt(categoryIdFromUrl) : null;

  useEffect(() => {
    if (userId) {
      userService
        .getById(userId)
        .then((user) => setUserName(user.FullName || "Khách hàng"))
        .catch(console.error);
    }
  }, [userId]);

  // Sync searchTerm từ URL với context
  useEffect(() => {
    setSearchTerm(searchTermFromUrl);
  }, [searchTermFromUrl, setSearchTerm]);

  const handleCategoryClick = (categoryId: number | null) => {
    // Cập nhật URL với categoryId
    if (categoryId) {
      setSearchParams({ category: categoryId.toString() });
    } else {
      setSearchParams({});
    }
    setSearchTerm(""); // Reset search khi chọn category
  };

  return (
    <div id="product-list-section">
      {/* TWO-COLUMN LAYOUT */}
      <div className="max-w-screen-2xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-12 gap-10">

        {/* LEFT SIDEBAR - CATEGORY LIST (3/12) */}
        <div className="md:col-span-3">
          <CategoryShowcase 
            viewMode="list" 
            onCategoryClick={handleCategoryClick}
            selectedCategoryId={selectedCategoryId}
          />
        </div>

        {/* RIGHT CONTENT - PRODUCT LIST (9/12) */}
        <div className="md:col-span-9">
          <ProductList categoryId={selectedCategoryId} searchTerm={searchTermFromUrl} />
        </div>

      </div>
    </div>
  );
};

export default Home;
