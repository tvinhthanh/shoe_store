/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Table, { Column } from "../../../components/Table";
import VariantModal, { Variant, VariantModalMode } from "./VariantModal";
import { variantService } from "../../../services/variant.service";
import { productService } from "../../../services/product.service";

const AdminVariantsPage = () => {
    const [data, setData] = useState<Variant[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<VariantModalMode>("create");
    const [selected, setSelected] = useState<Variant | null>(null);

    // LOAD DATA
    const loadData = () => {
        variantService.getAll() // cần thêm API getAll bên backend
            .then((res) => setData(res))
            .catch((err) => console.error(err));
    };

    // LOAD PRODUCTS
    useEffect(() => {
        productService.getAll().then((res) => setProducts(res));
        loadData();
    }, []);

    // SUBMIT
    const handleSubmit = async (form: Variant) => {
        try {
            if (mode === "create") {
                await variantService.create(form);
            } else if (mode === "edit" && selected?.id_variant) {
                await variantService.update(selected.id_variant, form);
            }

            loadData();
            setOpen(false);
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra!");
        }
    };

    const columns: Column<Variant>[] = [
        { title: "ID", dataIndex: "id_variant", width: 60 },
        {
            title: "Sản phẩm",
            render: (_, r) => products.find(p => p.id_product === r.id_product)?.name || "—"
        },
        { title: "Size", dataIndex: "size", width: 80 },
        { title: "Màu", dataIndex: "color", width: 100 },
        {
            title: "Giá",
            dataIndex: "price_variant",
            width: 120,
            render: (v) => Number(v).toLocaleString("vi-VN") + " ₫"
        },
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
                        className="border px-2 py-1 text-xs rounded"
                    >
                        Xem
                    </button>

                    <button
                        onClick={() => {
                            setSelected(record);
                            setMode("edit");
                            setOpen(true);
                        }}
                        className="border px-2 py-1 text-xs rounded"
                    >
                        Sửa
                    </button>

                    <button
                        onClick={async () => {
                            if (!window.confirm("Xóa biến thể này?")) return;
                            await variantService.remove(record.id_variant!);
                            loadData();
                        }}
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
                <h1 className="text-xl font-semibold">Quản lý biến thể</h1>

                <button
                    className="bg-blue-600 text-white px-3 py-2 rounded"
                    onClick={() => {
                        setMode("create");
                        setSelected(null);
                        setOpen(true);
                    }}
                >
                    + Thêm biến thể
                </button>
            </div>

            <Table columns={columns} data={data} />

            <VariantModal
                open={open}
                mode={mode}
                data={selected}
                products={products}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default AdminVariantsPage;
