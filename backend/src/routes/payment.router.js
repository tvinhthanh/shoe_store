const router = require("express").Router();
const Payments = require("../models/payment.model");

// Lấy thanh toán theo order
router.get("/:orderId", async (req, res) => {
  try {
    const data = await Payments.getByOrder(req.params.orderId);
    res.json(data);
  } catch (err) {
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
  const orderId = req.params.id;
  const status = req.body.status;
  try {
    // await Payments.updateStatus(req.params.id, req.body.status);
    await Payments.getByOrder(orderId, status);
    res.json({ message: "Cập nhật trạng thái thanh toán" });
  } catch (err) {
    res.status(500).json({ message: "Không cập nhật được" });
  }
});

module.exports = router;
