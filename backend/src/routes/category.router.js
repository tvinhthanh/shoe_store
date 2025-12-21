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
    await Category.delete(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Không xóa được" });
  }
});

module.exports = router;
