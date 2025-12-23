/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem, cartService } from "../../../services/cart.service";
import { useAppContext } from "../../../contexts/AppContext";
import { useCart } from "../../../contexts/CartContext";
import { productService } from "../../../services/product.service";
import { variantService } from "../../../services/variant.service";
import { orderService } from "../../../services/order.service";
import { orderItemService } from "../../../services/orderItem.service";
import { useCurrency } from "../../../hooks/useCurrency";

interface CartViewItem extends CartItem {
    productName: string;
    image: string;
    price: number;
    color?: string;
    size?: string;
}

export default function CartPage() {
    const navigate = useNavigate();
    const { showToast, userId } = useAppContext();
    const { items: cartItems, refresh } = useCart();
    const { formatVND } = useCurrency();

    const [items, setItems] = useState<CartViewItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: ""
    });

    // =============================
    // LOAD CART ITEMS
    // =============================
    const loadCart = async () => {
        if (!cartItems.length) {
            setItems([]);
            setLoading(false);
            return;
        }

        try {
            const viewItems: CartViewItem[] = [];

            for (const item of cartItems) {
                const product = await productService.getById(item.id_product);
                const variant = await variantService.getById(item.id_variant);

                viewItems.push({
                    ...item,
                    productName: product.name,
                    image: product.image,
                    price: variant?.price_variant || product.price,
                    color: variant?.color,
                    size: variant?.size
                });
            }

            setItems(viewItems);
        } catch (err) {
            showToast("Không thể tải giỏ hàng", "ERROR");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, [cartItems]);

    // =============================
    // REMOVE ITEM
    // =============================
    const handleRemove = (id_variant: number) => {
        cartService.remove(id_variant);
        refresh();
    };

    // =============================
    // UPDATE QTY
    // =============================
    const handleChangeQty = (id_variant: number, quantity: number) => {
        if (quantity < 1) return;
        cartService.update(id_variant, quantity);
        refresh();
    };

    // =============================
    // TOTAL PRICE
    // =============================
    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // =============================
    // PLACE ORDER
    // =============================
    const placeOrder = async () => {
        if (!userId)
            return showToast("Bạn cần đăng nhập để đặt hàng", "ERROR");

        if (!form.name || !form.phone || !form.address)
            return showToast("Vui lòng nhập đầy đủ thông tin nhận hàng", "ERROR");

        if (!items.length)
            return showToast("Giỏ hàng trống", "ERROR");

        try {
            // 1. CREATE ORDER
            const res = await orderService.create({
                id_user: userId,
                order_code: "OD" + Date.now(),
                total_amount: total,
                status: "pending",
                shipping_address: form.address
            });

            // ⭐ Backend now returns id_order correctly
            const id_order = res.id_order;

            // 2. CREATE ORDER ITEMS
            const payItems = items.map((it) => ({
                id_order,
                id_product: it.id_product,
                id_variant: it.id_variant,
                quantity: it.quantity,
                unit_price: it.price,
                total_price: it.price * it.quantity
            }));

            await orderItemService.createMany(payItems);

            // 3. CLEAR CART
            cartService.clear();
            refresh();

            showToast("Đặt hàng thành công! Đang chuyển đến trang thanh toán...", "SUCCESS");
            
            // 4. CHUYỂN ĐẾN TRANG THANH TOÁN
            setTimeout(() => {
                navigate(`/payment?orderId=${id_order}`);
            }, 1000);
        } catch (err) {
            console.error(err);
            showToast("Lỗi khi tạo đơn hàng", "ERROR");
        }
    };

    // =============================
    // RENDER UI
    // =============================
    if (loading) return <div className="p-8 text-center">Đang tải giỏ hàng...</div>;
    if (!items.length) return <div className="p-8 text-center">Giỏ hàng trống</div>;

    return (
        <div className="max-w-screen-xl mx-auto p-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* LEFT: CART ITEMS */}
            <div className="md:col-span-2 space-y-4">
                <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>

                {items.map((item) => (
                    <div key={item.id_variant} className="flex gap-4 border rounded-lg p-3 bg-white">

                        <img
                            src={item.image}
                            alt={item.productName}
                            className="w-24 h-24 object-cover rounded"
                        />

                        <div className="flex-1">
                            <div className="font-semibold">{item.productName}</div>
                            <div className="text-sm text-gray-600">
                                Màu: {item.color} • Size: {item.size}
                            </div>

                            <div className="text-red-600 font-bold mt-1">
                                {formatVND(item.price)}
                            </div>

                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    onClick={() => handleChangeQty(item.id_variant, item.quantity - 1)}
                                    className="w-8 h-8 border rounded flex items-center justify-center"
                                >
                                    -
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    onClick={() => handleChangeQty(item.id_variant, item.quantity + 1)}
                                    className="w-8 h-8 border rounded flex items-center justify-center"
                                >
                                    +
                                </button>

                                <button
                                    onClick={() => handleRemove(item.id_variant)}
                                    className="ml-4 text-sm text-red-600 underline"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>

                    </div>
                ))}

                <div className="flex justify-end mt-4 text-xl font-bold text-red-600">
                    Tổng: {formatVND(total)}
                </div>
            </div>

            {/* RIGHT: RECEIVE INFO */}
            <div className="border p-4 rounded-lg bg-white shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Thông tin người nhận</h2>

                <div className="space-y-3">
                    <input
                        className="w-full border p-2 rounded"
                        placeholder="Họ tên"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    <input
                        className="w-full border p-2 rounded"
                        placeholder="Số điện thoại"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />

                    <textarea
                        className="w-full border p-2 rounded"
                        placeholder="Địa chỉ"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />

                    <button
                        onClick={placeOrder}
                        className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
                    >
                        Đặt hàng
                    </button>
                </div>
            </div>

        </div>
    );
}
