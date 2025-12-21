/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";

export type ProductModalMode = "create" | "edit" | "view";

export interface Product {
    id_product?: number;
    id_category?: number;
    name: string;
    sku: string;
    price: number;
    stock: number;
    unit?: string;
    description?: string;
    status?: string;
    image?: string;
    cost?: number;
}

interface ProductModalProps {
    open: boolean;
    mode: ProductModalMode;
    data?: Product | null;
    categories?: { id_category: number; name: string }[];
    onClose: () => void;

    /** 
     * ✔ FE gửi FormData luôn 
     * onSubmit(formData)
     */
    onSubmit?: (payload: FormData) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
    open,
    mode,
    data,
    categories,
    onClose,
    onSubmit
}) => {
    // ảnh tạm để preview
    const [preview, setPreview] = useState<string>("");

    // file upload thật
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [form, setForm] = useState<Product>({
        name: "",
        sku: "",
        price: 0,
        stock: 0,
        cost: 0,
        unit: "",
        id_category: 0,
        description: "",
        status: "active",
        image: ""
    });

    useEffect(() => {
        if (data) {
            setForm(data);
            setPreview(data.image || "");
        } else {
            setForm({
                name: "",
                sku: "",
                price: 0,
                stock: 0,
                cost: 0,
                unit: "",
                id_category: 0,
                description: "",
                status: "active",
                image: ""
            });
            setPreview("");
        }
    }, [data, open]);

    if (!open) return null;

    const isView = mode === "view";
    const title =
        mode === "create"
            ? "Thêm sản phẩm"
            : mode === "edit"
                ? "Chỉnh sửa sản phẩm"
                : "Thông tin sản phẩm";

    const handle = (e: any) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleFile = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);
        setPreview(URL.createObjectURL(file)); // preview local
    };

    /**
     * ✔ Gửi FormData duy nhất
     */
    const submit = () => {
        if (!onSubmit) return;

        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (v !== undefined && v !== null) fd.append(k, String(v));
        });

        // có file mới → append file
        if (imageFile) fd.append("image", imageFile);

        onSubmit(fd);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-3xl rounded-xl shadow flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-4 py-3 border-b flex justify-between flex-shrink-0">
                    <h2 className="font-semibold text-lg">{title}</h2>
                    <button className="text-xl" onClick={onClose}>×</button>
                </div>

                {/* FORM */}
                <div className="p-4 grid grid-cols-2 gap-4 overflow-y-auto">
                    {/* CATEGORY */}
                    <div>
                        <label className="text-sm">Danh mục</label>
                        <select
                            name="id_category"
                            disabled={isView}
                            value={form.id_category || ""}
                            onChange={handle}
                            className="border p-2 rounded w-full text-sm"
                        >
                            <option value="">-- Chọn --</option>
                            {categories?.map((c) => (
                                <option key={c.id_category} value={c.id_category}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm">Tên sản phẩm</label>
                        <input
                            name="name"
                            disabled={isView}
                            value={form.name}
                            onChange={handle}
                            className="border p-2 rounded w-full text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm">SKU</label>
                        <input
                            name="sku"
                            disabled={isView}
                            value={form.sku}
                            onChange={handle}
                            className="border p-2 rounded w-full text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Giá</label>
                        <input
                            type="number"
                            name="price"
                            disabled={isView}
                            value={form.price}
                            onChange={handle}
                            className="border p-2 rounded w-full text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Giá nhập (Cost)</label>
                        <input
                            type="number"
                            name="cost"
                            disabled={isView}
                            value={form.cost || 0}
                            onChange={handle}
                            className="border p-2 rounded w-full text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Tồn kho (Tự động từ biến thể)</label>
                        <input
                            type="number"
                            name="stock"
                            disabled={true}
                            value={form.stock}
                            className="border p-2 rounded w-full text-sm bg-gray-100"
                            title="Số lượng được tính tự động từ tổng số lượng các biến thể"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Đơn vị</label>
                        <input
                            name="unit"
                            disabled={isView}
                            value={form.unit}
                            onChange={handle}
                            className="border p-2 rounded w-full text-sm"
                        />
                    </div>

                    {/* IMAGE */}
                    <div className="col-span-2">
                        <label className="text-sm">Ảnh sản phẩm</label>
                        <input
                            type="file"
                            accept="image/*"
                            disabled={isView}
                            onChange={handleFile}
                            className="border p-2 rounded w-full text-sm"
                        />

                        {preview && (
                            <img
                                src={preview}
                                alt="preview"
                                className="mt-3 h-40 rounded border object-cover"
                            />
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm">Mô tả</label>
                        <textarea
                            name="description"
                            disabled={isView}
                            value={form.description}
                            onChange={handle}
                            rows={3}
                            className="border p-2 rounded w-full text-sm"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t px-4 py-3 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="border px-3 py-2 rounded">
                        Đóng
                    </button>
                    {!isView && (
                        <button
                            onClick={submit}
                            className="bg-blue-600 text-white px-3 py-2 rounded"
                        >
                            Lưu
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
