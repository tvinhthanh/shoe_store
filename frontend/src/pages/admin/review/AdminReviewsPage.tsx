import { useEffect, useState } from "react";
import Table, { Column } from "../../../components/Table";
import ReviewModal, { Review, ReviewModalMode } from "./ReviewModal";
import { reviewService } from "../../../services/review.service";
import { useAppContext } from "../../../contexts/AppContext";

const AdminReviewsPage = () => {
    const { showToast } = useAppContext();
    const [data, setData] = useState<Review[]>([]);
    const [open, setOpen] = useState(false);
    const [, setMode] = useState<ReviewModalMode>("view");
    const [selected, setSelected] = useState<Review | null>(null);

    const loadData = () => {
        reviewService.getAll()
            .then((res) => setData(res))
            .catch((err) => {
                console.error("Load reviews failed", err);
                showToast("Không thể tải danh sách đánh giá", "ERROR");
            });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc muốn xóa đánh giá này không?")) return;
        try {
            await reviewService.remove(id);
            showToast("Xóa đánh giá thành công", "SUCCESS");
            loadData();
        } catch (err: any) {
            console.error("Delete review error:", err);
            // Xử lý lỗi an toàn, không để app crash
            let errorMessage = "Không thể xóa đánh giá này";
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

    useEffect(() => {
        loadData();
    }, []);

    const columns: Column<Review>[] = [
        { title: "ID", dataIndex: "id_review", width: 60 },
        { title: "Sản phẩm", dataIndex: "product_name" },
        { title: "Người dùng", dataIndex: "user_name" },
        { title: "Rating", dataIndex: "rating", width: 80 },
        { title: "Nội dung", dataIndex: "content" },
        {
            title: "Thao tác",
            width: 200,
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
                    <button
                        onClick={() => handleDelete(record.id_review!)}
                        className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >
                        Xóa
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Quản lý đánh giá</h1>

            <Table columns={columns} data={data} />

            <ReviewModal
                open={open}
                data={selected}
                onClose={() => setOpen(false)}
            />
        </div>
    );
};

export default AdminReviewsPage;
