import React from "react";

const HomeAdmin: React.FC = () => {
    // TODO: gọi API sau - hiện tại để UI trước
    const stats = [
        { label: "Danh mục", value: 12, color: "bg-blue-500" },
        { label: "Khách hàng", value: 240, color: "bg-green-500" },
        { label: "Sản phẩm", value: 320, color: "bg-indigo-500" },
        { label: "Biến thể", value: 780, color: "bg-purple-500" },
        { label: "Đơn hàng", value: 145, color: "bg-orange-500" },
        { label: "Đánh giá", value: 85, color: "bg-pink-500" },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>

            {/* GRID 6 MODULE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((item, i) => (
                    <div
                        key={i}
                        className="bg-white shadow rounded-xl p-5 flex items-center gap-4"
                    >
                        <div
                            className={`w-14 h-14 flex items-center justify-center rounded-full text-white text-xl font-bold ${item.color}`}
                        >
                            {item.value}
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Tổng số</p>
                            <h2 className="text-lg font-semibold">{item.label}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* TODO: SECTION BẢNG, BIỂU ĐỒ */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="font-semibold mb-4">Đơn hàng mới</h3>
                    <p className="text-gray-400 text-sm">Chưa có dữ liệu...</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="font-semibold mb-4">Sản phẩm bán chạy</h3>
                    <p className="text-gray-400 text-sm">Chưa có dữ liệu...</p>
                </div>
            </div>
        </div>
    );
};

export default HomeAdmin;
