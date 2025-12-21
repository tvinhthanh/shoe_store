export const useCurrency = () => {
  const formatVND = (value: number | string | null | undefined) => {
    const n = Number(value ?? 0);
    if (Number.isNaN(n)) return "0 ₫";
    return n.toLocaleString("vi-VN") + " ₫";
  };

  return { formatVND };
};


