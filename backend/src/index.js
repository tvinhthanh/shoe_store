require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const { upload, uploadToCloudinary } = require("./middleware/upload");

const app = express();

// FIX CORS CHUẨN CHO LOGIN COOKIE
app.use(
  cors({
    origin: "http://localhost:5175",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ROUTERS
app.use("/api/auth", require("./routes/auth.router"));
app.use("/api/users", require("./routes/user.router"));
app.use("/api/categories", require("./routes/category.router"));
app.use("/api/products", require("./routes/product.router"));
app.use("/api/variants", require("./routes/productVariant.router"));
app.use("/api/orders", require("./routes/order.router"));
app.use("/api/order-items", require("./routes/orderitem.router"));
app.use("/api/payments", require("./routes/payment.router"));
app.use("/api/reviews", require("./routes/review.router"));
app.use("/api/upload", require("./routes/upload.router"));


// SERVER RUN
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`API đang chạy tại http://localhost:${PORT}`)
);
