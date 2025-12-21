import React, { useEffect, useState } from "react";

export type CategoryModalMode = "create" | "edit" | "view";

export interface Category {
  id_category?: number;
  name: string;
  description?: string;
  status?: string;
}

interface CategoryModalProps {
  open: boolean;
  mode: CategoryModalMode;
  data?: Category | null;
  onClose: () => void;
  onSubmit?: (payload: Category) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  mode,
  data,
  onClose,
  onSubmit
}) => {
  const [form, setForm] = useState<Category>({
    name: "",
    description: "",
    status: "active"
  });

  useEffect(() => {
    if (data) {
      setForm({
        id_category: data.id_category,
        name: data.name,
        description: data.description || "",
        status: data.status || "active"
      });
    } else {
      setForm({
        name: "",
        description: "",
        status: "active"
      });
    }
  }, [data, open]);

  if (!open) return null;

  const isView = mode === "view";
  const title =
    mode === "create"
      ? "Thêm danh mục"
      : mode === "edit"
        ? "Sửa danh mục"
        : "Chi tiết danh mục";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? undefined : Number(value)) : value,
    }));
  };

  const handleSubmit = () => {
    if (!onSubmit) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b px-4 py-3 flex-shrink-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="px-4 py-4 space-y-4 overflow-y-auto">
          <div>
            <label className="mb-1 block text-sm font-medium">Tên danh mục</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={isView}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isView}
              rows={3}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={isView}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm ẩn</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-4 py-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Đóng
          </button>
          {!isView && (
            <button
              onClick={handleSubmit}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Lưu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
