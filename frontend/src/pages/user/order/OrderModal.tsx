/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCurrency } from "../../../hooks/useCurrency";

export default function OrderDetailModal({
    order,
    onClose
}: {
    order: any;
    onClose: () => void;
}) {
    const { formatVND } = useCurrency();
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 animate-fadeIn">

                {/* HEADER */}
                <h2 className="text-xl font-bold mb-4">
                    Chi tiết đơn hàng
                    <span className="text-blue-600 ml-2">{order.order_code}</span>
                </h2>

                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">

                    {/* LIST ITEMS */}
                    {order.items.map((it: any) => (
                        <div
                            key={it.id_order_item}
                            className="flex gap-4 border rounded-lg p-3 bg-gray-50"
                        >
                            {/* IMAGE */}
                            <img
                                src={it.product_image}
                                alt={it.product_name}
                                className="w-20 h-20 object-cover rounded border"
                            />

                            {/* INFO */}
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">{it.product_name}</p>

                                <p className="text-sm text-gray-600">
                                    Màu: <b>{it.variant_color || "—"}</b> •
                                    Size: <b>{it.variant_size || "—"}</b>
                                </p>

                                <p className="mt-1 text-red-600 font-bold">
                                    {formatVND(it.unit_price)}
                                </p>

                                <p className="text-sm">
                                    Số lượng: <b>{it.quantity}</b>
                                </p>

                                <p className="font-semibold mt-1">
                                    Thành tiền:{" "}
                                    <span className="text-blue-600">
                                        {formatVND(it.total_price)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
