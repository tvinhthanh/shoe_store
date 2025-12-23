/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../../../services/product.service";
import { variantService } from "../../../services/variant.service";
import { cartService } from "../../../services/cart.service";
import { reviewService } from "../../../services/review.service";
import { useAppContext } from "../../../contexts/AppContext";
import { useCart } from "../../../contexts/CartContext";
import { useCurrency } from "../../../hooks/useCurrency";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast, userId } = useAppContext();
    const { refresh: refreshCart } = useCart();
    const { formatVND } = useCurrency();

    // PRODUCT
    const [product, setProduct] = useState<any>(null);
    const [variants, setVariants] = useState<any[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [fallbackProducts, setFallbackProducts] = useState<any[]>([]);

    // VARIANT CHOICE
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [activeVariant, setActiveVariant] = useState<any>(null);

    // REVIEW
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);

    // =========================
    // LOAD PRODUCT + VARIANTS
    // =========================
    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            try {
                const [productRes, variantRes] = await Promise.all([
                    productService.getById(Number(id)),
                    variantService.getByProduct(Number(id))
                ]);

                setProduct(productRes);
                setVariants(variantRes);
            } catch {
                showToast("Không thể tải dữ liệu sản phẩm", "ERROR");
            }
        };

        loadData();
    }, [id]);

    // =========================
    // LOAD RELATED PRODUCTS
    // =========================
    useEffect(() => {
        if (!product) return;

        productService.getByCategory(product.id_category).then((res) => {
            const filtered = res.filter((p: any) => p.id_product !== product.id_product);
            setRelatedProducts(filtered.slice(0, 5));
        });

        productService.getAll().then((res) => {
            const shuffled = res
                .filter((p: any) => p.id_product !== product.id_product)
                .sort(() => 0.5 - Math.random());
            setFallbackProducts(shuffled.slice(0, 5));
        });
    }, [product]);

    // =========================
    // ACTIVE VARIANT
    // =========================
    useEffect(() => {
        if (!selectedColor || !selectedSize) {
            setActiveVariant(null);
            return;
        }

        const v = variants.find(
            (x) =>
                x.color === selectedColor &&
                String(x.size) === String(selectedSize)
        );

        setActiveVariant(v || null);
    }, [selectedColor, selectedSize, variants]);

    // =========================
    // ADD TO CART
    // =========================
    const addToCart = () => {
        if (!activeVariant)
            return showToast("Vui lòng chọn màu và size!", "ERROR");

        if (activeVariant.stock <= 0)
            return showToast("Biến thể này đã hết hàng!", "ERROR");

        cartService.add({
            id_product: product.id_product,
            id_variant: activeVariant.id_variant,
            quantity: 1
        });

        // Cập nhật lại context giỏ hàng để lần đầu vào trang /cart thấy ngay sản phẩm
        refreshCart();

        showToast("Đã thêm vào giỏ hàng!", "SUCCESS");
    };

    // =========================
    // LOAD REVIEWS
    // =========================
    const loadReviews = async () => {
        try {
            const res = await reviewService.getByProduct(product.id_product);
            setReviews(res);
        } catch {
            showToast("Không thể tải đánh giá", "ERROR");
        }
    };

    useEffect(() => {
        if (product) loadReviews();
    }, [product]);

    // =========================
    // SUBMIT REVIEW
    // =========================
    const submitReview = async () => {
        if (!userId) return showToast("Bạn phải đăng nhập để đánh giá", "ERROR");
        if (!reviewText.trim()) return showToast("Vui lòng nhập đánh giá", "ERROR");

        try {
            await reviewService.create({
                id_user: userId,
                id_product: product.id_product,
                rating,
                title: null,
                content: reviewText
            });

            showToast("Đã thêm đánh giá!", "SUCCESS");
            setReviewText("");
            loadReviews();

        } catch (err: any) {
            const message =
                err?.message ||
                "Không thể gửi đánh giá";

            showToast(message, "ERROR");
        }
    };


    if (!product) return <div className="p-8 text-center">Đang tải...</div>;

    const colors = [...new Set(variants.map((v) => v.color))];
    const sizes = [...new Set(variants.map((v) => v.size))];

    const recommends =
        relatedProducts.length >= 5
            ? relatedProducts
            : [...relatedProducts, ...fallbackProducts].slice(0, 5);

    return (
        <div className="max-w-screen-xl mx-auto p-6 mt-10 space-y-12">

            {/* PRODUCT DETAIL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="border rounded-xl overflow-hidden shadow">
                    <img src={product.image} className="w-full h-[450px] object-cover" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

                    <div className="text-xl font-semibold text-red-600 mb-3">
                        {activeVariant
                            ? formatVND(activeVariant.price_variant)
                            : formatVND(product.price)}
                    </div>

                    {activeVariant && (
                        <p className="text-sm mb-3 text-gray-600">
                            Tồn kho: <b>{activeVariant.stock}</b> đôi
                        </p>
                    )}

                    {/* COLOR */}
                    <div className="mb-5">
                        <h3 className="font-medium mb-2">Màu sắc</h3>
                        <div className="flex gap-2 flex-wrap">
                            {colors.map((color) => {
                                // Kiểm tra xem có variant nào của màu này còn hàng không
                                const hasStock = variants.some(
                                    (v) => v.color === color && v.stock > 0
                                );
                                return (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        disabled={!hasStock}
                                        className={`px-4 py-2 rounded border text-sm ${
                                            selectedColor === color 
                                                ? "bg-black text-white" 
                                                : hasStock
                                                ? "bg-white hover:bg-gray-50"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        }`}
                                        title={!hasStock ? "Màu này đã hết hàng" : ""}
                                    >
                                        {color}
                                        {!hasStock && " (Hết hàng)"}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* SIZE */}
                    <div className="mb-5">
                        <h3 className="font-medium mb-2">Size</h3>
                        <div className="flex gap-2 flex-wrap">
                            {sizes.map((size) => {
                                // Kiểm tra xem có variant nào của size này với màu đã chọn còn hàng không
                                const hasStock = selectedColor
                                    ? variants.some(
                                          (v) =>
                                              v.color === selectedColor &&
                                              String(v.size) === String(size) &&
                                              v.stock > 0
                                      )
                                    : variants.some(
                                          (v) =>
                                              String(v.size) === String(size) &&
                                              v.stock > 0
                                      );
                                return (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(String(size))}
                                        disabled={!hasStock}
                                        className={`px-4 py-2 rounded border text-sm ${
                                            selectedSize === size
                                                ? "bg-black text-white"
                                                : hasStock
                                                ? "bg-white hover:bg-gray-50"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        }`}
                                        title={!hasStock ? "Size này đã hết hàng" : ""}
                                    >
                                        {size}
                                        {!hasStock && " (Hết hàng)"}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {activeVariant && activeVariant.stock <= 0 && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            ⚠️ Biến thể này đã hết hàng
                        </div>
                    )}

                    <button
                        onClick={addToCart}
                        disabled={!activeVariant || (activeVariant && activeVariant.stock <= 0)}
                        className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {!activeVariant
                            ? "Vui lòng chọn màu và size"
                            : activeVariant.stock <= 0
                            ? "Đã hết hàng"
                            : "Thêm vào giỏ"}
                    </button>

                    <div className="mt-8">
                        <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
                        <p className="text-gray-700">{product.description}</p>
                    </div>
                </div>
            </div>

            {/* ===================== REVIEWS ===================== */}
            <div className="p-4 border rounded-xl bg-white shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Đánh giá sản phẩm</h2>

                {/* REVIEW FORM */}
                <div className="mb-6">
                    <h3 className="font-medium mb-2">Viết đánh giá</h3>

                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="border rounded p-2 mb-3"
                    >
                        {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>{r} sao</option>
                        ))}
                    </select>

                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Nội dung đánh giá..."
                        className="w-full border rounded p-3 mb-3 h-24"
                    />

                    <button
                        onClick={submitReview}
                        className="bg-green-600 text-white px-5 py-2 rounded"
                    >
                        Gửi đánh giá
                    </button>
                </div>

                {/* REVIEW LIST */}
                <div className="space-y-4">
                    {reviews.length === 0 && (
                        <p className="text-gray-500">Chưa có đánh giá nào.</p>
                    )}

                    {reviews.map((rv) => {
                        const displayName =
                            rv.user_name?.trim() ||
                            rv.email?.trim() ||
                            "Người dùng";

                        return (
                            <div key={rv.id_review} className="border p-3 rounded-lg">
                                <p className="font-semibold">{displayName}</p>

                                <p className="text-yellow-500">
                                    {"★".repeat(rv.rating)}
                                    {"☆".repeat(5 - rv.rating)}
                                </p>

                                {rv.title && (
                                    <p className="font-semibold mt-1">{rv.title}</p>
                                )}

                                <p className="mt-1">{rv.content || "Không có nội dung"}</p>

                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(rv.created_at).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ===================== RELATED PRODUCTS ===================== */}
            <div>
                <h2 className="text-xl font-bold mb-4">Sản phẩm gợi ý</h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {recommends.map((p) => (
                        <div
                            key={p.id_product}
                            onClick={() => navigate(`/product/${p.id_product}`)}
                            className="cursor-pointer border rounded-xl p-3 shadow hover:shadow-lg transition"
                        >
                            <img src={p.image} className="w-full h-40 object-cover rounded" />
                            <h3 className="mt-2 font-semibold text-sm">{p.name}</h3>
                            <p className="text-red-600 font-bold text-sm">
                                {formatVND(p.price)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

