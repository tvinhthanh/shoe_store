/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useCurrency } from "../../../hooks/useCurrency";

export type VariantModalMode = "create" | "edit" | "view";

export interface Variant {
  id_variant?: number;
  id_product?: number;
  size?: string;
  color?: string;
  price_variant: number;
  stock: number;
  status?: string;

  cost?: number;
  productSku?: string;
  sku_variant?: string;
}

interface VariantModalProps {
  open: boolean;
  mode: VariantModalMode;
  data?: Variant | null;
  products?: { id_product: number; name: string; cost: number; sku: string }[];
  onClose: () => void;
  onSubmit?: (payload: Variant) => void;
}

const VariantModal: React.FC<VariantModalProps> = ({
  open,
  mode,
  data,
  products,
  onClose,
  onSubmit
}) => {
  const { formatVND } = useCurrency();
  const [form, setForm] = useState<Variant>({
    id_product: undefined,
    size: "",
    color: "",
    price_variant: 0,
    stock: 0,
    status: "active",
    cost: 0,
    sku_variant: "",
    productSku: ""
  });

  /** RESET FORM KHI CREATE / LOAD DATA KHI EDIT */
  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setForm({
        id_product: undefined,
        size: "",
        color: "",
        price_variant: 0,
        stock: 0,
        status: "active",
        cost: 0,
        sku_variant: "",
        productSku: ""
      });
      return;
    }

    if (mode === "edit" && data) {
      const p = products?.find((x) => x.id_product === data.id_product);

      setForm({
        ...data,
        productSku: p?.sku || "",
        cost: p?.cost || 0,
        sku_variant: data.sku_variant || ""
      });
    }
  }, [open, mode, data, products]);

  if (!open) return null;

  const isView = mode === "view";
  const title =
    mode === "create"
      ? "Thêm biến thể"
      : mode === "edit"
        ? "Sửa biến thể"
        : "Chi tiết biến thể";

  const getFirstLetter = (str: string) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .charAt(0)
      .toUpperCase();
  };

  const genSkuVariant = (productSku: string, color: string, size: string) => {
    const c = getFirstLetter(color);
    return `${productSku}${c}${size}`;
  };

  /** HANDLE CHANGE */
  const handle = (e: any) => {
    const { name, value } = e.target;

    // Khi chọn sản phẩm
    if (name === "id_product") {
      const p = products?.find((x) => x.id_product === Number(value));

      setForm((f) => ({
        ...f,
        id_product: Number(value),
        productSku: p?.sku || "",
        cost: p?.cost || 0,
        sku_variant:
          f.color && f.size && p?.sku
            ? genSkuVariant(p.sku, f.color, f.size)
            : f.sku_variant
      }));
      return;
    }

    // Các field khác
    setForm((f) => {
      const updated = { ...f, [name]: value };

      // Auto generate SKU variant nếu đủ dữ liệu
      if (updated.productSku && updated.color && updated.size) {
        updated.sku_variant = genSkuVariant(
          updated.productSku,
          updated.color,
          updated.size
        );
      }

      return updated;
    });
  };

  const submit = () => onSubmit && onSubmit(form);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-xl flex flex-col max-h-[90vh]">
        <div className="border-b px-4 py-3 flex justify-between flex-shrink-0">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button className="text-xl" onClick={onClose}>×</button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-4 overflow-y-auto">

          {/* PRODUCT */}
          <div>
            <label className="text-sm">Sản phẩm</label>
            <select
              name="id_product"
              disabled={isView}
              value={form.id_product || ""}
              onChange={handle}
              className="border p-2 rounded w-full text-sm"
            >
              <option value="">-- Chọn --</option>
              {products?.map((p) => (
                <option key={p.id_product} value={p.id_product}>
                  {p.name} — Cost: {formatVND(p.cost)}
                </option>
              ))}
            </select>
          </div>

          {/* SIZE */}
          <div>
            <label className="text-sm">Size</label>
            <select
              name="size"
              disabled={isView}
              value={form.size || ""}
              onChange={handle}
              className="border p-2 rounded w-full text-sm"
            >
              <option value="">-- Chọn size --</option>
              {Array.from({ length: 49 - 35 + 1 }, (_, i) => 35 + i).map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* COLOR */}
          <div>
            <label className="text-sm">Màu</label>
            <input
              name="color"
              value={form.color || ""}
              disabled={isView}
              onChange={handle}
              className="border p-2 rounded w-full text-sm"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="text-sm">Giá biến thể</label>
            <input
              type="number"
              name="price_variant"
              value={form.price_variant}
              disabled={isView}
              onChange={handle}
              className="border p-2 rounded w-full text-sm"
            />
          </div>

          {/* STOCK */}
          <div>
            <label className="text-sm">Tồn kho</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              disabled={isView}
              onChange={handle}
              className="border p-2 rounded w-full text-sm"
            />
          </div>

          {/* SKU VARIANT */}
          <div className="col-span-2">
            <label className="text-sm">SKU Variant (Tự tạo)</label>
            <input
              value={form.sku_variant || ""}
              disabled
              className="border p-2 rounded w-full bg-gray-100 text-sm"
            />
          </div>

        </div>

        <div className="border-t px-4 py-3 flex justify-end gap-3 flex-shrink-0">
          <button className="border px-3 py-2 rounded" onClick={onClose}>Đóng</button>
          {!isView && (
            <button onClick={submit} className="bg-blue-600 text-white px-3 py-2 rounded">
              Lưu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantModal;
