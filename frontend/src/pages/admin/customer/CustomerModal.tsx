/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { userService } from "../../../services/user.service"; // 🆕 thêm service xóa
import { useAppContext } from "../../../contexts/AppContext";

export type CustomerModalMode = "view";

export interface Customer {
    id_user?: number;
    name: string;
    email: string;
    phone: string;
    role: string; // user | admin
    address?: string;
}

interface CustomerModalProps {
    open: boolean;
    mode: CustomerModalMode;
    data?: Customer | null;
    onClose: () => void;
    onDeleted?: () => void; // 🆕 callback khi xóa thành công
}

const CustomerModal: React.FC<CustomerModalProps> = ({
    open,
    data,
    onClose,
    onDeleted
}) => {
    const { showToast } = useAppContext();

    if (!open || !data) return null;

    // ==========================
    // ROLE MAPPING
    // ==========================
    const roleValue = (data.role || "").toLowerCase();

    const roleText =
        roleValue === "admin"
            ? "Quản trị viên"
            : roleValue === "user"
                ? "Khách hàng"
                : data.role;

    if (roleValue !== "user") return null;

    const handleDelete = async () => {
        if (!data.id_user) {
            showToast("Không tìm thấy ID người dùng", "ERROR");
            return;
        }

        if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;

        try {
            await userService.deleteUser(data.id_user.toString());
            showToast("Xóa người dùng thành công", "SUCCESS");

            onClose();
            onDeleted && onDeleted();
        } catch (err: any) {
            console.error("Delete user error:", err);
            // Xử lý lỗi an toàn, không để app crash
            let errorMessage = "Không thể xóa người dùng";
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

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="px-4 py-3 flex justify-between border-b">
                    <h2 className="font-semibold text-lg">Thông tin người dùng</h2>
                    <button onClick={onClose} className="text-xl">×</button>
                </div>

                {/* BODY */}
                <div className="p-4 space-y-3 text-sm overflow-y-auto">
                    <p><b>Họ tên:</b> {data.name}</p>
                    <p><b>Email:</b> {data.email}</p>
                    <p><b>SĐT:</b> {data.phone}</p>
                    <p><b>Vai trò:</b> {roleText}</p>
                    <p><b>Địa chỉ:</b> {data.address || "Không có"}</p>
                </div>

                {/* FOOTER */}
                <div className="px-4 py-3 border-t flex justify-between">
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Xóa người dùng
                    </button>

                    <button
                        onClick={onClose}
                        className="border px-3 py-2 rounded"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerModal;
