const router = require("express").Router();
const { upload, uploadToCloudinary } = require("../middleware/upload");

// upload.single("image") → Frontend gửi field "image"
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file);
    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

module.exports = router;
