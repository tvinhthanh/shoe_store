const router = require("express").Router();
const Payments = require("../models/payment.model");

// Lấy tất cả thanh toán (cho admin)
router.get("/", async (req, res) => {
  try {
    const data = await Payments.getAll();
    res.json(data);
  } catch (err) {
    console.error("Get all payments error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy thanh toán theo order
router.get("/order/:orderId", async (req, res) => {
  try {
    const data = await Payments.getByOrder(req.params.orderId);
    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy thanh toán" });
    }
    res.json(data);
  } catch (err) {
    console.error("Get payment by order error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy thanh toán theo id
router.get("/:id", async (req, res) => {
  try {
    const data = await Payments.getById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy thanh toán" });
    }
    res.json(data);
  } catch (err) {
    console.error("Get payment by id error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Tạo thanh toán
router.post("/", async (req, res) => {
  try {
    await Payments.create(req.body);
    res.json({ message: "Ghi nhận thanh toán thành công" });
  } catch (err) {
    res.status(500).json({ message: "Không ghi nhận được thanh toán" });
  }
});

// Cập nhật trạng thái
router.put("/:id/status", async (req, res) => {
  try {
    const payment = await Payments.getById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Không tìm thấy thanh toán" });
    }
    
    await Payments.updateStatus(req.params.id, req.body.status);
    res.json({ message: "Cập nhật trạng thái thanh toán thành công" });
  } catch (err) {
    console.error("Update payment status error:", err);
    res.status(500).json({ message: "Không cập nhật được" });
  }
});

// Xóa thanh toán
router.delete("/:id", async (req, res) => {
  try {
    const payment = await Payments.getById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Không tìm thấy thanh toán" });
    }
    
    // Kiểm tra nếu payment đã được thanh toán (status = 'paid' hoặc 'completed')
    // thì có thể không cho xóa hoặc cảnh báo
    if (payment.status === 'paid' || payment.status === 'completed') {
      return res.status(400).json({
        message: "Không thể xóa thanh toán đã hoàn thành. Vui lòng liên hệ admin.",
      });
    }
    
    await Payments.delete(req.params.id);
    res.json({ message: "Xóa thanh toán thành công" });
  } catch (err) {
    console.error("Delete payment error:", err);
    res.status(500).json({ message: "Không xóa được thanh toán" });
  }
});

module.exports = router;
