import React from "react";

export type ReviewModalMode = "view";

export interface Review {
    id_review?: number;
    product_name: string;
    user_name: string;
    rating: number;
    content: string;
    created_at?: string;
}

interface ReviewModalProps {
    open: boolean;
    data?: Review | null;
    onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
    open,
    data,
    onClose
}) => {
    if (!open || !data) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl flex flex-col max-h-[90vh]">
                <div className="px-4 py-3 flex justify-between border-b flex-shrink-0">
                    <h2 className="font-semibold text-lg">Chi tiết đánh giá</h2>
                    <button onClick={onClose} className="text-xl">
                        ×
                    </button>
                </div>

                <div className="p-4 space-y-3 text-sm overflow-y-auto">
                    <p><b>Sản phẩm:</b> {data.product_name}</p>
                    <p><b>Người dùng:</b> {data.user_name}</p>
                    <p><b>Rating:</b> {data.rating} ⭐</p>
                    <p><b>Nội dung:</b> {data.content}</p>
                    <p>
                        <b>Ngày đánh giá:</b>{" "}
                        {data.created_at
                            ? new Date(data.created_at).toLocaleString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })
                            : "—"}
                    </p>
                </div>

                <div className="border-t px-4 py-3 text-right flex-shrink-0">
                    <button className="border px-3 py-2 rounded" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
