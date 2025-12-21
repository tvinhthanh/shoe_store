/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { orderItemService } from "../../../services/orderItem.service";
import { useCurrency } from "../../../hooks/useCurrency";

export type OrderModalMode = "view" | "edit";

export interface Order {
    id_order?: number;
    id_user?: string;
    order_code: string;
    customer_name?: string;
    total_amount: number;
    status: string;
    shipping_address?: string;
    created_at?: string;
}

interface OrderModalProps {
    open: boolean;
    mode: OrderModalMode;
    data?: Order | null;
    onClose: () => void;
    onSubmit?: (payload: Partial<Order>) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
    open,
    mode,
    data,
    onClose,
    onSubmit
}) => {
    const [form, setForm] = useState<Partial<Order>>({});
    const [items, setItems] = useState<any[]>([]); // order_items
    const { formatVND } = useCurrency();

    /** Load form + items */
    useEffect(() => {
        if (data) {
            setForm(data);

            if (open && data.id_order) {
                orderItemService
                    .getByOrder(data.id_order)
                    .then(setItems)
                    .catch(() => setItems([]));
            }
        }
    }, [open, data]);

    if (!open || !data) return null;

    const isView = mode === "view";
    const title = isView ? "Chi tiết đơn hàng" : "Cập nhật đơn hàng";

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const submit = () => {
        if (onSubmit) onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg flex flex-col max-h-[90vh]">
                {/* HEADER */}
                <div className="px-4 py-3 border-b flex justify-between flex-shrink-0">
                    <h2 className="font-semibold text-lg">{title}</h2>
                    <button onClick={onClose} className="text-xl">×</button>
                </div>

                {/* BODY */}
                <div className="p-4 space-y-4 text-sm overflow-y-auto">
                    <p><b>Mã đơn:</b> {form.order_code}</p>
                    <p><b>Khách hàng:</b> {form.customer_name}</p>

                    <p>
                        <b>Tổng tiền:</b> {formatVND(form.total_amount ?? 0)}
                    </p>

                    {/* STATUS */}
                    <div>
                        <label className="font-semibold">Trạng thái:</label>
                        {isView ? (
                            <p>{form.status}</p>
                        ) : (
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="border p-2 rounded w-full mt-1"
                            >
                                <option value="pending">Chờ duyệt</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="shipping">Đang giao</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        )}
                    </div>

                    {/* SHIPPING ADDRESS */}
                    <div>
                        <label className="font-semibold">Địa chỉ giao hàng:</label>
                        {isView ? (
                            <p className="whitespace-pre-line">{form.shipping_address}</p>
                        ) : (
                            <textarea
                                name="shipping_address"
                                value={form.shipping_address}
                                onChange={handleChange}
                                rows={3}
                                className="border p-2 rounded w-full mt-1"
                            ></textarea>
                        )}
                    </div>

                    <p>
                        <b>Ngày tạo:</b>{" "}
                        {form.created_at
                            ? new Date(form.created_at).toLocaleString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })
                            : "—"}
                    </p>

                    {/* ORDER ITEMS */}
                    <div className="mt-4">
                        <h3 className="font-semibold text-sm mb-2">Chi tiết sản phẩm</h3>

                        {items.length === 0 ? (
                            <p className="text-gray-500 text-sm">Không có sản phẩm</p>
                        ) : (
                            <table className="w-full text-sm border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2">SP</th>
                                        <th className="border p-2">Biến thể</th>
                                        <th className="border p-2">SL</th>
                                        <th className="border p-2">Giá</th>
                                        <th className="border p-2">Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((it) => (
                                        <tr key={it.id_order_item}>
                                            <td className="border p-2">{it.id_product}</td>
                                            <td className="border p-2">{it.id_variant || "—"}</td>
                                            <td className="border p-2">{it.quantity}</td>
                                            <td className="border p-2">
                                                {formatVND(it.unit_price)}
                                            </td>
                                            <td className="border p-2">
                                                {formatVND(it.total_price)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="border-t px-4 py-3 flex justify-end gap-3 flex-shrink-0">
                    <button className="border px-3 py-2 rounded" onClick={onClose}>
                        Đóng
                    </button>

                    {!isView && (
                        <button
                            onClick={submit}
                            className="bg-blue-600 text-white px-3 py-2 rounded"
                        >
                            Lưu thay đổi
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
