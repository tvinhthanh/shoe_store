const router = require("express").Router();
const Reviews = require("../models/review.model");

// Lấy tất cả review (cho admin)
router.get("/", async (req, res) => {
  try {
    const data = await Reviews.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy review theo sản phẩm
router.get("/product/:productId", async (req, res) => {
  try {
    const data = await Reviews.getByProduct(req.params.productId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Tạo / cập nhật review (1 user 1 review / product)
router.post("/", async (req, res) => {
  try {
    await Reviews.createOrUpdate(req.body);
    res.json({ message: "Gửi đánh giá thành công" });
  } catch (err) {
    res.status(500).json({ message: "Không gửi được đánh giá" });
  }
});

// Xóa review
router.delete("/:id", async (req, res) => {
  try {
    const review = await Reviews.getById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }
    
    await Reviews.delete(req.params.id);
    res.json({ message: "Xóa đánh giá thành công" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ message: "Không xóa được" });
  }
});

router.post("/create", async (req, res) => {
 const { id_product, id_user } = req.body;

  try {
    // chỉ cho phép đánh giá nếu user đã từng mua sản phẩm này
    const purchased = await Reviews.hasPurchased(id_product, id_user);
    if (!purchased) {
      return res.status(400).json({
        message: "Bạn chỉ có thể đánh giá khi đã mua sản phẩm này",
      });
    }

 const exists = await Reviews.checkExists(id_product, id_user);
 if (exists) {
   return res.status(400).json({
        message: "Bạn đã đánh giá sản phẩm này rồi",
   });
 }

    await Reviews.create(req.body);
    res.json({ message: "Gửi đánh giá thành công" });
  } catch (err) {
    console.error("Create review error:", err);
    res.status(500).json({ message: "Không gửi được đánh giá" });
}
});

module.exports = router;
