/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import { orderService } from "../../../services/order.service";
import OrderDetailModal from "./OrderModal";
import { useCurrency } from "../../../hooks/useCurrency";

export default function OrderListPage() {
    const { showToast, userId } = useAppContext();
    const { formatVND } = useCurrency();

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    const loadOrders = async () => {
        try {
            const res = await orderService.getByUser(userId);
            setOrders(res);
        } catch {
            showToast("Không thể tải đơn hàng!", "ERROR");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) loadOrders();
    }, [userId]);

    const cancelOrder = async (id_order: number) => {
        try {
            await orderService.updateStatus(id_order, "cancelled");
            showToast("Đã hủy đơn hàng", "SUCCESS");
            loadOrders();
        } catch {
            showToast("Không thể hủy đơn hàng", "ERROR");
        }
    };

    if (loading) return <div className="p-6 text-center">Đang tải đơn hàng...</div>;

    if (!orders.length)
        return <div className="p-6 text-center">Bạn chưa có đơn hàng nào.</div>;

    return (
        <div className="max-w-screen-lg mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>

            {orders.map(order => (
                <div key={order.id_order} className="border rounded-lg p-4 bg-white shadow-sm">

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">Mã đơn: {order.order_code}</p>
                            <p>
                                Ngày tạo:{" "}
                                {new Date(order.created_at).toLocaleString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>
                            <p className="font-bold text-red-600">
                                Tổng tiền: {formatVND(order.total_amount)}
                            </p>
                            <p className="mt-1">
                                Trạng thái: <b>{order.status}</b>
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Xem chi tiết
                            </button>

                            {order.status === "pending" && (
                                <button
                                    onClick={() => cancelOrder(order.id_order)}
                                    className="px-4 py-2 bg-red-600 text-white rounded"
                                >
                                    Hủy đơn
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            ))}

            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}
