export const useCurrency = () => {
  const formatVND = (value: number | string | null | undefined) => {
    const n = Number(value ?? 0);
    if (Number.isNaN(n)) return "0 vn₫";
    // Làm tròn về số nguyên và format với dấu phẩy phân cách hàng nghìn
    const rounded = Math.round(n);
    return rounded.toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " vn₫";
  };

  return { formatVND };
};


