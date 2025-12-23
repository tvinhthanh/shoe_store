const router = require("express").Router();
const Category = require("../models/category.model");

// GET all
router.get("/", async (req, res) => {
  try {
    const data = await Category.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// GET by id
router.get("/:id", async (req, res) => {
  try {
    const item = await Category.getById(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// CREATE
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    await Category.create(req.body);
    res.json({ message: "Tạo danh mục thành công" });
  } catch (err) {
    console.error("Create Category Error:", err);
    res.status(500).json({ message: "Không tạo được danh mục", error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    await Category.update(req.params.id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Không cập nhật được" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.getById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    
    // Kiểm tra xem category có sản phẩm nào không
    const Products = require("../models/product.model");
    const products = await Products.getByCategory(req.params.id);
    if (products.length > 0) {
      return res.status(400).json({
        message: `Không thể xóa danh mục này vì còn ${products.length} sản phẩm. Vui lòng xóa hoặc chuyển sản phẩm trước.`,
      });
    }
    
    await Category.delete(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ message: "Không xóa được" });
  }
});

module.exports = router;
