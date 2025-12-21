/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import Table, { Column } from "../../../components/Table";
import ProductModal, { Product, ProductModalMode } from "./ProductModal";
import { categoryService } from "../../../services/category.service";
import { productService } from "../../../services/product.service";

const AdminProductsPage = () => {
    const [data, setData] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<ProductModalMode>("create");
    const [selected, setSelected] = useState<Product | null>(null);

    // Load categories 1 lần lúc mount
    useEffect(() => {
        categoryService.getAll()
            .then(setCategories)
            .catch((err) => console.error("Load categories error:", err));
    }, []);

    // Load products
    const loadProducts = useCallback(() => {
        productService.getAll()
            .then(setData)
            .catch((err) => console.error("Load products error:", err));
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // Submit create/update
    const handleSubmit = async (formData: FormData) => {
        try {
            if (mode === "create") {
                await productService.create(formData);
            } else if (mode === "edit" && selected?.id_product) {
                await productService.update(selected.id_product, formData);
            }

            loadProducts();
            setOpen(false);
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra");
        }
    };

    // Delete
    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) return;

        try {
            await productService.remove(id);
            loadProducts();
        } catch (err) {
            console.error(err);
            alert("Xoá thất bại");
        }
    };

    // Table columns
    const columns: Column<Product>[] = [
        { title: "ID", dataIndex: "id_product", width: 60 },
        {
            title: "Ảnh",
            width: 80,
            render: (_, record) => (
                <img
                    src={record.image}
                    className="h-10 w-10 object-cover rounded border"
                />
            ),
        },
        { title: "Tên", dataIndex: "name" },
        { title: "SKU", dataIndex: "sku" },
        { title: "Giá", dataIndex: "price", width: 100 },
        { title: "Kho", dataIndex: "stock", width: 80 },
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
                        className="border px-2 py-1 rounded text-xs"
                    >
                        Xem
                    </button>

                    <button
                        onClick={() => {
                            setSelected(record);
                            setMode("edit");
                            setOpen(true);
                        }}
                        className="border px-2 py-1 rounded text-xs"
                    >
                        Sửa
                    </button>

                    <button
                        onClick={() => handleDelete(record.id_product as number)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                        Xóa
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Quản lý sản phẩm</h1>

                <button
                    className="bg-blue-600 text-white px-3 py-2 rounded"
                    onClick={() => {
                        setMode("create");
                        setSelected(null);
                        setOpen(true);
                    }}
                >
                    + Thêm sản phẩm
                </button>
            </div>

            <Table columns={columns} data={data} />

            <ProductModal
                open={open}
                mode={mode}
                data={selected}
                categories={categories}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default AdminProductsPage;
