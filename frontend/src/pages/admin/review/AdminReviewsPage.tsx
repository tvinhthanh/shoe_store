import { useEffect, useState } from "react";
import Table, { Column } from "../../../components/Table";
import ReviewModal, { Review, ReviewModalMode } from "./ReviewModal";
import { reviewService } from "../../../services/review.service";

const AdminReviewsPage = () => {
    const [data, setData] = useState<Review[]>([]);
    const [open, setOpen] = useState(false);
    const [, setMode] = useState<ReviewModalMode>("view");
    const [selected, setSelected] = useState<Review | null>(null);

    const loadData = () => {
        reviewService.getAll()
            .then((res) => setData(res))
            .catch((err) => {
                console.error("Load reviews failed", err);
                alert("Không thể tải danh sách đánh giá");
            });
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
            width: 150,
            render: (_, record) => (
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
