/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { paymentService } from "../../../services/payment.service";
import { orderService } from "../../../services/order.service";
import { useAppContext } from "../../../contexts/AppContext";
import { useCurrency } from "../../../hooks/useCurrency";
import PaymentQRModal from "./PaymentQRModal";

export default function PaymentPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast, userId } = useAppContext();
    const { formatVND } = useCurrency();

    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState<any>(null);
    const [payment, setPayment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState("cod"); // cod, bank_transfer, momo, zalopay

    useEffect(() => {
        if (!orderId) {
            showToast("Không tìm thấy đơn hàng", "ERROR");
            navigate("/cart");
            return;
        }

        loadOrderAndPayment();
    }, [orderId]);

    const loadOrderAndPayment = async () => {
        try {
            const orderData = await orderService.getById(orderId);
            setOrder(orderData);

            // Kiểm tra xem đã có payment chưa
            try {
                const paymentData = await paymentService.getByOrder(orderId);
                setPayment(paymentData);
            } catch {
                // Chưa có payment, sẽ tạo mới
            }
        } catch (err) {
            console.error(err);
            showToast("Không thể tải thông tin đơn hàng", "ERROR");
            navigate("/cart");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!orderId || !userId) return;

        // Nếu là COD thì không cần hiển thị QR
        if (paymentMethod === "cod") {
            setProcessing(true);
            try {
                if (payment) {
                    // Cập nhật payment hiện có
                    await paymentService.updateStatus(payment.id_payment, "pending");
                    showToast("Cập nhật phương thức thanh toán thành công", "SUCCESS");
                } else {
                    // Tạo payment mới
                    await paymentService.create({
                        id_order: parseInt(orderId),
                        method: paymentMethod,
                        amount: order.total_amount,
                        status: "pending",
                    });
                    showToast("Tạo thanh toán thành công", "SUCCESS");
                }

                // Reload để lấy payment mới
                await loadOrderAndPayment();
            } catch (err: any) {
                console.error(err);
                showToast(err.message || "Không thể xử lý thanh toán", "ERROR");
            } finally {
                setProcessing(false);
            }
        } else {
            // Các phương thức online: hiển thị QR modal
            // Tạo hoặc cập nhật payment trước
            setProcessing(true);
            try {
                if (payment) {
                    // Nếu đã có payment nhưng method khác, cần tạo lại với method mới
                    // (Backend chưa có API update method, nên tạo mới)
                    await paymentService.create({
                        id_order: parseInt(orderId),
                        method: paymentMethod,
                        amount: order.total_amount,
                        status: "pending",
                    });
                } else {
                    // Tạo payment mới
                    await paymentService.create({
                        id_order: parseInt(orderId),
                        method: paymentMethod,
                        amount: order.total_amount,
                        status: "pending",
                    });
                }
                await loadOrderAndPayment();
                // Hiển thị QR modal
                setShowQRModal(true);
            } catch (err: any) {
                console.error(err);
                showToast(err.message || "Không thể tạo thanh toán", "ERROR");
            } finally {
                setProcessing(false);
            }
        }
    };

    const handleConfirmPayment = async () => {
        setShowQRModal(false);
        setProcessing(true);
        try {
            // Reload payment để đảm bảo có dữ liệu mới nhất
            await loadOrderAndPayment();
            showToast("Đã xác nhận thanh toán. Vui lòng đợi xử lý...", "SUCCESS");
        } catch (err: any) {
            console.error(err);
            showToast(err.message || "Không thể xác nhận thanh toán", "ERROR");
        } finally {
            setProcessing(false);
        }
    };

    const handleCompletePayment = async () => {
        if (!payment) return;

        setProcessing(true);
        try {
            await paymentService.updateStatus(payment.id_payment, "paid");
            await orderService.updateStatus(parseInt(orderId!), "processing");
            showToast("Thanh toán thành công!", "SUCCESS");
            
            setTimeout(() => {
                navigate("/mydonhang");
            }, 2000);
        } catch (err: any) {
            console.error(err);
            showToast(err.message || "Không thể hoàn tất thanh toán", "ERROR");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-screen-xl mx-auto p-6 mt-6 text-center">
                <div>Đang tải thông tin thanh toán...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-screen-xl mx-auto p-6 mt-6 text-center">
                <div>Không tìm thấy đơn hàng</div>
                <button
                    onClick={() => navigate("/cart")}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Quay lại giỏ hàng
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-screen-xl mx-auto p-6 mt-6">
            <h1 className="text-2xl font-bold mb-6">Thanh toán đơn hàng</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LEFT: ORDER INFO */}
                <div className="md:col-span-2 space-y-4">
                    <div className="border rounded-lg p-4 bg-white">
                        <h2 className="text-lg font-semibold mb-3">Thông tin đơn hàng</h2>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-semibold">Mã đơn hàng:</span> {order.order_code}
                            </div>
                            <div>
                                <span className="font-semibold">Trạng thái:</span>{" "}
                                <span className="text-blue-600">{order.status}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Địa chỉ giao hàng:</span> {order.shipping_address}
                            </div>
                            <div>
                                <span className="font-semibold">Tổng tiền:</span>{" "}
                                <span className="text-red-600 font-bold text-lg">
                                    {formatVND(order.total_amount)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ORDER ITEMS */}
                    {order.items && order.items.length > 0 && (
                        <div className="border rounded-lg p-4 bg-white">
                            <h2 className="text-lg font-semibold mb-3">Sản phẩm</h2>
                            <div className="space-y-3">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-3 border-b pb-3">
                                        <img
                                            src={item.product_image}
                                            alt={item.product_name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <div className="font-semibold">{item.product_name}</div>
                                            <div className="text-sm text-gray-600">
                                                {item.variant_color && `Màu: ${item.variant_color}`}
                                                {item.variant_size && ` • Size: ${item.variant_size}`}
                                            </div>
                                            <div className="text-sm">
                                                SL: {item.quantity} × {formatVND(item.unit_price)} ={" "}
                                                <span className="font-semibold text-red-600">
                                                    {formatVND(item.total_price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: PAYMENT METHOD */}
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Phương thức thanh toán</h2>

                    {payment && payment.status === "paid" ? (
                        <div className="text-center py-8">
                            <div className="text-green-600 text-2xl mb-2">✓</div>
                            <div className="font-semibold text-green-600 mb-2">Đã thanh toán</div>
                            <div className="text-sm text-gray-600">
                                Phương thức: {payment.method === "cod" ? "Thanh toán khi nhận hàng" : payment.method}
                            </div>
                            <button
                                onClick={() => navigate("/mydonhang")}
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                Xem đơn hàng của tôi
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>Thanh toán khi nhận hàng (COD)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="bank_transfer"
                                        checked={paymentMethod === "bank_transfer"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>Chuyển khoản ngân hàng</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="momo"
                                        checked={paymentMethod === "momo"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>Ví MoMo</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="zalopay"
                                        checked={paymentMethod === "zalopay"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>ZaloPay</span>
                                </label>
                            </div>

                            {payment ? (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                    Đã tạo thanh toán. Bạn có thể cập nhật phương thức thanh toán hoặc hoàn tất thanh toán.
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                <button
                                    onClick={handlePayment}
                                    disabled={processing}
                                    className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {payment ? "Cập nhật phương thức" : "Xác nhận phương thức"}
                                </button>

                                {payment && (
                                    <button
                                        onClick={handleCompletePayment}
                                        disabled={processing}
                                        className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Hoàn tất thanh toán
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => navigate("/mydonhang")}
                                className="w-full text-gray-600 py-2 underline"
                            >
                                Xem đơn hàng của tôi
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* QR Modal */}
            {order && (
                <PaymentQRModal
                    isOpen={showQRModal}
                    onClose={() => setShowQRModal(false)}
                    paymentMethod={paymentMethod}
                    orderCode={order.order_code}
                    amount={order.total_amount}
                    onConfirm={handleConfirmPayment}
                />
            )}
        </div>
    );
}

