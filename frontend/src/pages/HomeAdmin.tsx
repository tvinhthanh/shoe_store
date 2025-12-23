import React, { useEffect, useState } from "react";
import { statsService } from "../services/stats.service";
import { useCurrency } from "../hooks/useCurrency";

interface DashboardStats {
    categories: number;
    customers: number;
    products: number;
    variants: number;
    orders: number;
    reviews: number;
}

interface NewOrder {
    id_order: number;
    order_code: string;
    total_amount: number;
    status: string;
    created_at: string;
    customer_name: string;
}

interface BestSeller {
    id_product: number;
    name: string;
    image: string;
    total_sold: number;
    total_revenue: number;
}

const HomeAdmin: React.FC = () => {
    const { formatVND } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        categories: 0,
        customers: 0,
        products: 0,
        variants: 0,
        orders: 0,
        reviews: 0,
    });
    const [newOrders, setNewOrders] = useState<NewOrder[]>([]);
    const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await statsService.getDashboard();
            setStats(data.stats);
            setNewOrders(data.newOrders || []);
            setBestSellers(data.bestSellers || []);
        } catch (err) {
            console.error("Load dashboard error:", err);
        } finally {
            setLoading(false);
        }
    };

    const statsConfig = [
        { label: "Danh mục", key: "categories" as keyof DashboardStats, color: "bg-blue-500" },
        { label: "Khách hàng", key: "customers" as keyof DashboardStats, color: "bg-green-500" },
        { label: "Sản phẩm", key: "products" as keyof DashboardStats, color: "bg-indigo-500" },
        { label: "Biến thể", key: "variants" as keyof DashboardStats, color: "bg-purple-500" },
        { label: "Đơn hàng", key: "orders" as keyof DashboardStats, color: "bg-orange-500" },
        { label: "Đánh giá", key: "reviews" as keyof DashboardStats, color: "bg-pink-500" },
        { label: "Test 1", key: "orders" as keyof DashboardStats, color: "bg-orange-500" },
        { label: "Test 2", key: "reviews" as keyof DashboardStats, color: "bg-pink-500" },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "text-yellow-600 bg-yellow-100";
            case "processing":
                return "text-blue-600 bg-blue-100";
            case "completed":
                return "text-green-600 bg-green-100";
            case "cancelled":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>

            {/* GRID 6 MODULE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsConfig.map((item) => (
                    <div
                        key={item.key}
                        className="bg-white shadow rounded-xl p-5 flex items-center gap-4"
                    >
                        <div
                            className={`w-14 h-14 flex items-center justify-center rounded-full text-white text-xl font-bold ${item.color}`}
                        >
                            {stats[item.key]}
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Tổng số</p>
                            <h2 className="text-lg font-semibold">{item.label}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* SECTION BẢNG */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Đơn hàng mới */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="font-semibold mb-4">Đơn hàng mới</h3>
                    {newOrders.length === 0 ? (
                        <p className="text-gray-400 text-sm">Chưa có dữ liệu...</p>
                    ) : (
                        <div className="space-y-3">
                            {newOrders.map((order) => (
                                <div
                                    key={order.id_order}
                                    className="border-b pb-3 last:border-b-0"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">
                                                {order.order_code}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order.customer_name || "Khách"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(order.created_at)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-sm text-red-600">
                                                {formatVND(order.total_amount)}
                                            </p>
                                            <span
                                                className={`inline-block px-2 py-1 rounded text-xs mt-1 ${getStatusColor(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sản phẩm bán chạy */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="font-semibold mb-4">Sản phẩm bán chạy</h3>
                    {bestSellers.length === 0 ? (
                        <p className="text-gray-400 text-sm">Chưa có dữ liệu...</p>
                    ) : (
                        <div className="space-y-3">
                            {bestSellers.map((product) => (
                                <div
                                    key={product.id_product}
                                    className="flex gap-3 border-b pb-3 last:border-b-0"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm line-clamp-1">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Đã bán: <span className="font-semibold">{product.total_sold}</span> sản phẩm
                                        </p>
                                        <p className="text-xs text-red-600 font-semibold mt-1">
                                            Doanh thu: {formatVND(product.total_revenue)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeAdmin;
