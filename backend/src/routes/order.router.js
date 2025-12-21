const router = require("express").Router();
const Orders = require("../models/order.model");

// Lấy tất cả đơn (cho admin – cần thêm route /orders ở backend)
router.get("/", async (req, res) => {
  try {
    const orders = await Orders.getAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy đơn theo user
router.get("/user/:userId", async (req, res) => {
  try {
    const data = await Orders.getByUser(req.params.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy 1 đơn
router.get("/:id", async (req, res) => {
  try {
    const order = await Orders.getById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Tạo đơn
router.post("/", async (req, res) => {
  try {
    const result = await Orders.create(req.body);

    res.json({
      message: "Tạo đơn hàng thành công",
      id_order: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không tạo được đơn" });
  }
});

// Cập nhật trạng thái
router.put("/:id/status", async (req, res) => {
  try {
    const order = await Orders.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn" });
    }

    // Nếu đã hoàn thành hoặc đã hủy thì không cho đổi trạng thái nữa
    if (order.status === "completed" || order.status === "cancelled") {
      return res.status(400).json({
        message:
          "Đơn hàng đã hoàn thành hoặc đã hủy, không thể thay đổi trạng thái",
      });
    }

    await Orders.updateStatus(req.params.id, req.body.status);
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Không cập nhật được" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Orders.remove(req.params.id);
    res.json({ message: "Xóa đơn hàng thành công" });
  } catch (err) {
    res.status(500).json({ message: "Không xóa được đơn" });
  }
});

module.exports = router;
