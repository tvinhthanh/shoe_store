const router = require("express").Router();
const Variants = require("../models/productVariant.model");

// Lấy tất cả variant của 1 product
router.get("/product/:productId", async (req, res) => {
  try {
    const data = await Variants.getByProduct(req.params.productId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Variants.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy 1 variant
router.get("/:id", async (req, res) => {
  try {
    const v = await Variants.getById(req.params.id);
    if (!v) return res.status(404).json({ message: "Không tìm thấy biến thể" });
    res.json(v);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Tạo variant
router.post("/", async (req, res) => {
  try {
    await Variants.create(req.body); // id_product, size, color, price_variant...
    // Tự động cập nhật stock của product từ tổng stock các variant
    if (req.body.id_product) {
      await Variants.syncProductStock(req.body.id_product);
    }
    res.json({ message: "Tạo biến thể thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Không tạo được biến thể" });
  }
});

// Cập nhật variant
router.put("/:id", async (req, res) => {
  try {
    // Lấy variant cũ để biết productId trước khi update
    const oldVariant = await Variants.getById(req.params.id);
    if (!oldVariant) {
      return res.status(404).json({ message: "Không tìm thấy biến thể" });
    }

    await Variants.update(req.params.id, req.body);
    
    // Tự động cập nhật stock của product từ tổng stock các variant
    await Variants.syncProductStock(oldVariant.id_product);
    
    res.json({ message: "Cập nhật biến thể thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Không cập nhật được" });
  }
});

// Xóa variant
router.delete("/:id", async (req, res) => {
  try {
    // Lấy variant để biết productId trước khi xóa
    const variant = await Variants.getById(req.params.id);
    if (!variant) {
      return res.status(404).json({ message: "Không tìm thấy biến thể" });
    }

    // Kiểm tra xem variant có đang được sử dụng trong đơn hàng không
    const hasOrderItems = await Variants.hasOrderItems(req.params.id);
    if (hasOrderItems) {
      return res.status(400).json({
        message: "Không thể xóa biến thể này vì đã có đơn hàng sử dụng biến thể này",
      });
    }

    const productId = variant.id_product;
    await Variants.delete(req.params.id);
    
    // Tự động cập nhật stock của product từ tổng stock các variant còn lại
    await Variants.syncProductStock(productId);
    
    res.json({ message: "Xóa biến thể thành công" });
  } catch (err) {
    console.error("Delete variant error:", err);
    // Kiểm tra lỗi foreign key constraint
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
      return res.status(400).json({
        message: "Không thể xóa biến thể này vì đang được sử dụng trong hệ thống",
      });
    }
    res.status(500).json({ message: "Không xóa được" });
  }
});

module.exports = router;
