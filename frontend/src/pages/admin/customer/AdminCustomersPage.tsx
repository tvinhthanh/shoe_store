import { useEffect, useState } from "react";
import Table, { Column } from "../../../components/Table";
import CustomerModal, { Customer, CustomerModalMode } from "./CustomerModal";
import { userService } from "../../../services/user.service";
import { useAppContext } from "../../../contexts/AppContext";

const AdminCustomersPage = () => {
    const { showToast } = useAppContext();

    const [data, setData] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<CustomerModalMode>("view");
    const [selected, setSelected] = useState<Customer | null>(null);

    // =============================
    // Load customers
    // =============================
    useEffect(() => {
        const load = async () => {
            try {
                const res = await userService.getAll();
                setData(res);
            } catch {
                showToast("Không thể tải danh sách người dùng", "ERROR");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // =============================
    // Table columns
    // =============================
    const columns: Column<Customer>[] = [
        { title: "ID", dataIndex: "id_user", width: 60 },
        { title: "Họ tên", dataIndex: "name" },
        { title: "Email", dataIndex: "email" },
        { title: "Phone", dataIndex: "phone", width: 120 },
        { title: "Vai trò", dataIndex: "role", width: 80 },
        {
            title: "Thao tác",
            width: 120,
            render: (_, record) => (
                <button
                    onClick={() => {
                        setSelected(record);
                        setMode("view");
                        setOpen(true);
                    }}
                    className="border px-3 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200"
                >
                    Xem
                </button>
            ),
        },
    ];

    // =============================
    // RENDER UI
    // =============================
    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Quản lý người dùng</h1>

            {loading ? (
                <div className="p-6 text-center">Đang tải...</div>
            ) : (
                <Table columns={columns} data={data} />
            )}

            <CustomerModal
                open={open}
                mode={mode}
                data={selected}
                onClose={() => setOpen(false)}
            />
        </div>
    );
};

export default AdminCustomersPage;
