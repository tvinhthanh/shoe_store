const router = require("express").Router();
const OrderItems = require("../models/orderItem.model");

// Lấy chi tiết theo order
router.get("/:orderId", async (req, res) => {
  try {
    const data = await OrderItems.getByOrder(req.params.orderId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Tạo nhiều chi tiết đơn (khi tạo đơn xong)
router.post("/", async (req, res) => {
  try {
    await OrderItems.createMany(req.body.items); // [{id_order,id_product,...}]
    res.json({ message: "Tạo chi tiết đơn hàng thành công" });
  } catch (err) {
    res.status(500).json({ message: "Không tạo được chi tiết đơn" });
  }
});

module.exports = router;
