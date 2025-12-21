const router = require("express").Router();
const Products = require("../models/product.model");
const { upload, uploadToCloudinary } = require("../middleware/upload");


// GET ALL
router.get("/", async (req, res) => {
  const data = await Products.getAll();
  res.json(data);
});

// SEARCH PRODUCTS - Phải đặt TRƯỚC route /:id
router.get("/search/:keyword", async (req, res) => {
  try {
    const data = await Products.search(req.params.keyword);
    res.json(data);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Lỗi tìm kiếm" });
  }
});

// GET BY CATEGORY - Phải đặt TRƯỚC route /:id
router.get("/category/:id", async (req, res) => {
  const data = await Products.getByCategory(req.params.id);
  res.json(data);
});

// GET ONE - Phải đặt CUỐI CÙNG
router.get("/:id", async (req, res) => {
  const data = await Products.getById(req.params.id);
  if (!data) return res.status(404).json({ message: "Product not found" });
  res.json(data);
});


// CREATE
router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      let imageUrl = null;

      // có file thì upload lên Cloudinary
      if (req.file) {
        const result = await uploadToCloudinary(req.file);
        imageUrl = result.secure_url;
      }

      // ghép imageUrl vào body
      const payload = {
        ...req.body,
        image: imageUrl
      };

      const result = await Products.create(payload);

      res.json({
        message: "Product created",
        id_product: result.insertId,
        imageUrl
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Create failed" });
    }
  }
);

// UPDATE PRODUCT + IMAGE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let imageUrl = null;

    // nếu FE gửi kèm file ảnh → upload Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;
    }

    // body từ FormData
    const payload = {
      ...req.body,
      image: imageUrl || req.body.image || null
    };

    await Products.update(req.params.id, payload);

    res.json({ message: "Product updated", imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});


// DELETE
router.delete("/:id", async (req, res) => {
  await Products.delete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;
