const router = require("express").Router();
const Users = require("../models/user.model");
const auth = require("../middleware/auth"); // nếu chưa dùng thì tạm bỏ

// Lấy tất cả user
router.get("/", async (req, res) => {
  try {
    const data = await Users.getAll();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy 1 user
router.get("/:id", async (req, res) => {
  try {
    const user = await Users.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Tạo user
router.post("/", async (req, res) => {
  try {
    await Users.create(req.body);
    res.json({ message: "Tạo user thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không tạo được user" });
  }
});

// Cập nhật user
router.put("/:id", async (req, res) => {
  try {
    await Users.update(req.params.id, req.body);
    res.json({ message: "Cập nhật user thành công" });
  } catch (err) {
    res.status(500).json({ message: "Không cập nhật được user" });
  }
});

// Xóa user
router.delete("/:id", async (req, res) => {
  try {
    await Users.delete(req.params.id);
    res.json({ message: "Xóa user thành công" });
  } catch (err) {
    res.status(500).json({ message: "Không xóa được user" });
  }
});

module.exports = router;
