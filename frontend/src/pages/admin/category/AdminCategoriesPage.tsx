import React, { useState } from "react";
import Table, { Column } from "../../../components/Table";
import CategoryModal, { Category, CategoryModalMode } from "./CategoryModal";
import { categoryService } from "../../../services/category.service";

const AdminCategoriesPage = () => {
    const [data, setData] = useState<Category[]>([]);
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<CategoryModalMode>("create");
    const [selected, setSelected] = useState<Category | null>(null);

    const fetchData = async () => {
        try {
            const res = await categoryService.getAll();
            setData(res);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
        try {
            await categoryService.deleteCategory(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete category", error);
        }
    };

    const columns: Column<Category>[] = [
        { title: "ID", dataIndex: "id_category", width: 60 },
        { title: "Tên danh mục", dataIndex: "name" },
        { title: "Trạng thái", dataIndex: "status", width: 120 },
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
                        onClick={() => record.id_category && handleDelete(record.id_category)}
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
                <h1 className="text-xl font-semibold">Quản lý danh mục</h1>

                <button
                    className="bg-blue-600 text-white px-3 py-2 rounded"
                    onClick={() => {
                        setMode("create");
                        setSelected(null);
                        setOpen(true);
                    }}
                >
                    + Thêm danh mục
                </button>
            </div>

            <Table columns={columns} data={data} />

            <CategoryModal
                open={open}
                mode={mode}
                data={selected}
                onClose={() => setOpen(false)}
                onSubmit={async (item) => {
                    try {
                        if (mode === "create") {
                            await categoryService.create(item);
                        } else if (mode === "edit" && item.id_category) {
                            await categoryService.update(item.id_category, item);
                        }
                        setOpen(false);
                        fetchData();
                    } catch (error) {
                        console.error("Failed to save category", error);
                    }
                }}
            />
        </div>
    );
};

export default AdminCategoriesPage;
