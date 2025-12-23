import { useState, useEffect } from "react";
import Table, { Column } from "../../../components/Table";
import OrderModal, { Order, OrderModalMode } from "./OrderModal";
import { orderService } from "../../../services/order.service";
import { useCurrency } from "../../../hooks/useCurrency";
import { useAppContext } from "../../../contexts/AppContext";

const AdminOrdersPage = () => {
    const { showToast } = useAppContext();
    const [data, setData] = useState<Order[]>([]);
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<OrderModalMode>("view");
    const [selected, setSelected] = useState<Order | null>(null);
    const { formatVND } = useCurrency();

    const loadOrders = () => {
        orderService
            .getAll()
            .then((res) => setData(res))
            .catch((err) => console.error("Load orders error:", err));
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleSubmit = async (payload: Partial<Order>) => {
        if (!selected?.id_order || !payload.status) return;
        try {
            await orderService.updateStatus(selected.id_order, payload.status);
            showToast("Cập nhật trạng thái đơn hàng thành công", "SUCCESS");
            setOpen(false);
            loadOrders();
        } catch (err: any) {
            console.error("Update status error:", err);
            const errorMessage = err.message || "Không cập nhật được trạng thái đơn hàng";
            showToast(errorMessage, "ERROR");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) return;
        try {
            await orderService.remove(id);
            showToast("Xóa đơn hàng thành công", "SUCCESS");
            loadOrders();
        } catch (err: any) {
            console.error("Delete order error:", err);
            // Xử lý lỗi an toàn, không để app crash
            let errorMessage = "Không thể xóa đơn hàng này";
            if (err && typeof err === 'object') {
                if (err.message) {
                    errorMessage = err.message;
                } else if (err.error) {
                    errorMessage = err.error;
                }
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            showToast(errorMessage, "ERROR");
        }
    };

    const columns: Column<Order>[] = [
        { title: "ID", dataIndex: "id_order", width: 60 },
        { title: "Mã đơn", dataIndex: "order_code", width: 150 },
        { title: "Khách hàng", dataIndex: "customer_name", width: 140 },
        {
            title: "Tổng tiền",
            dataIndex: "total_amount",
            render: (v) => formatVND(v),
            width: 120
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 100,
            render: (v) => (
                <span className="px-2 py-1 rounded bg-gray-200 text-xs">
                    {v}
                </span>
            )
        },
        {
            title: "Thao tác",
            width: 150,
            render: (_, record) => (
                <div className="flex gap-2">
                <button
                    onClick={() => {
                        setSelected(record);
                        setMode("view");
                        setOpen(true);
                    }}
                    className="border px-2 py-1 text-xs rounded"
                >
                        Xem
                    </button>
                    {record.status !== "completed" && record.status !== "cancelled" && (
                        <button
                            onClick={() => {
                                setSelected(record);
                                setMode("edit");
                                setOpen(true);
                            }}
                            className="border px-2 py-1 text-xs rounded"
                        >
                            Sửa trạng thái
                </button>
                    )}
                    {record.status !== "completed" && record.status !== "cancelled" && (
                        <button
                            onClick={() => handleDelete(record.id_order!)}
                            className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                        >
                            Xóa
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Quản lý đơn hàng</h1>

            <Table columns={columns} data={data} />

            <OrderModal
                open={open}
                mode={mode}
                data={selected}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default AdminOrdersPage;
